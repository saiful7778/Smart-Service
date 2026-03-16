import type { InferRouterOutputs } from "@orpc/server";
import z from "zod";

import {
  and,
  buildPaginateOptions,
  buildPaginationMeta,
  count,
  countDistinct,
  eq,
  gte,
  lte,
  max,
  selectUserSchema,
  sql,
  updateUserSchema,
  UserActivityTable,
  UserTable,
} from "@workspace/drizzle";
import {
  apiOutput,
  paginateOutputZodSchema,
  paginateSchema,
} from "@workspace/lib";

import { auth } from "@/lib/better-auth/auth";

import { API_MESSAGES } from "@/constant/apiMessage";
import { superAdminBaseOs } from "@/server/middleware/auth.middleware";

import { userBannedSchema } from "../user.schema";

const tags = ["users"] as const;

const listUser = superAdminBaseOs
  .route({
    path: "/users/list",
    description: "List of users",
    tags,
  })
  .input(
    paginateSchema<typeof selectUserSchema>({
      searchFields: ["name", "email"],
      orderFields: ["name", "email", "createdAt", "updatedAt"],
      filter: z.object({
        emailVerified: z.boolean().optional(),
        banned: z.boolean().optional(),
      }),
    })
  )
  .output(
    apiOutput(
      paginateOutputZodSchema(
        selectUserSchema.extend({
          lastLogin: z.date().nullable(),
        })
      )
    )
  )
  .handler(async ({ context, input }) => {
    const { where, orderBy, limit, offset, page } = buildPaginateOptions(
      UserTable,
      input
    );

    const lastLoginSq = context.db
      .select({
        userId: UserActivityTable.userId,
        lastLogin: max(UserActivityTable.loginAt).as("last_login"),
      })
      .from(UserActivityTable)
      .groupBy(UserActivityTable.userId)
      .as("last_login_sq");

    const users = await context.db
      .select({
        // Spread all UserTable columns explicitly
        id: UserTable.id,
        name: UserTable.name,
        email: UserTable.email,
        emailVerified: UserTable.emailVerified,
        phone: UserTable.phone,
        image: UserTable.image,
        role: UserTable.role,
        displayRole: UserTable.displayRole,
        banned: UserTable.banned,
        banReason: UserTable.banReason,
        banExpires: UserTable.banExpires,
        createdAt: UserTable.createdAt,
        updatedAt: UserTable.updatedAt,
        // Joined column
        lastLogin: lastLoginSq.lastLogin,
      })
      .from(UserTable)
      .leftJoin(lastLoginSq, eq(UserTable.id, lastLoginSq.userId))
      .where(where)
      .orderBy(orderBy ?? sql`1`)
      .limit(limit)
      .offset(offset);

    const meta = await buildPaginationMeta(context.db, UserTable, page, limit);

    return {
      message: API_MESSAGES.USER.GET_ALL,
      data: {
        ...meta,
        data: users,
      },
    };
  });
export type ListUserOutput = InferRouterOutputs<typeof listUser>;

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function calcGrowth(previous: number, current: number): number | null {
  if (previous === 0) return null; // avoid division by zero — no data last period
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

const getUserStats = superAdminBaseOs
  .route({
    path: "/users/stats",
    description: "Get stats",
    tags,
  })
  .output(
    apiOutput(
      z.object({
        totalUsers: z.number(),
        totalUsersGrowth: z.number().nullable(),
        activeNow: z.number(),
        wau: z.number(),
        wauGrowth: z.number().nullable(),
        mau: z.number(),
        mauGrowth: z.number().nullable(),
      })
    )
  )
  .handler(async ({ context }) => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const thisWeekStart = daysAgo(7);
    const lastWeekStart = daysAgo(14);
    const thisMonthStart = daysAgo(30);
    const lastMonthStart = daysAgo(60);

    const allData = await Promise.all([
      // Total registered users
      context.db.$count(UserTable),
      // Total users 30 days ago (to compute growth)
      context.db
        .select({ count: count() })
        .from(UserTable)
        .where(lte(UserTable.createdAt, thisMonthStart)),

      // Active now
      context.db
        .select({ count: countDistinct(UserActivityTable.userId) })
        .from(UserActivityTable)
        .where(gte(UserActivityTable.lastSeenAt, fiveMinutesAgo)),

      // WAU: unique logins in last 7 days
      context.db
        .select({ count: countDistinct(UserActivityTable.userId) })
        .from(UserActivityTable)
        .where(gte(UserActivityTable.loginAt, thisWeekStart)),

      // Last WAU: unique logins in the 7 days before that
      context.db
        .select({ count: countDistinct(UserActivityTable.userId) })
        .from(UserActivityTable)
        .where(
          and(
            gte(UserActivityTable.loginAt, lastWeekStart),
            lte(UserActivityTable.loginAt, thisWeekStart)
          )
        ),

      // MAU: unique logins in last 30 days
      context.db
        .select({ count: countDistinct(UserActivityTable.userId) })
        .from(UserActivityTable)
        .where(gte(UserActivityTable.loginAt, thisMonthStart)),

      // Last MAU: unique logins in the 30 days before that
      context.db
        .select({ count: countDistinct(UserActivityTable.userId) })
        .from(UserActivityTable)
        .where(
          and(
            gte(UserActivityTable.loginAt, lastMonthStart),
            lte(UserActivityTable.loginAt, thisMonthStart)
          )
        ),
    ]);

    const totalUsers = allData[0];
    const lastMonthTotal = allData[1][0]!;
    const activeNow = allData[2][0]!;
    const wau = allData[3][0]!;
    const lastWau = allData[4][0]!;
    const mau = allData[5][0]!;
    const lastMau = allData[6][0]!;

    return {
      message: API_MESSAGES.USER.GET_STATS,
      data: {
        totalUsers: totalUsers,
        totalUsersGrowth: calcGrowth(lastMonthTotal.count, totalUsers),
        activeNow: activeNow.count,
        wau: wau.count,
        wauGrowth: calcGrowth(lastWau.count, wau.count),
        mau: mau.count,
        mauGrowth: calcGrowth(lastMau.count, mau.count),
      },
    };
  });
export type UserStatsOutput = InferRouterOutputs<typeof getUserStats>;

const updateUser = superAdminBaseOs
  .route({
    path: "/users/update",
    description: "Update user",
    tags,
  })
  .errors({
    NOT_FOUND: {
      message: API_MESSAGES.USER.NOT_FOUND,
      status: 404,
    },
  })
  .input(
    updateUserSchema.extend({
      userId: z.uuid(),
    })
  )
  .output(apiOutput(selectUserSchema))
  .handler(async ({ input, context, errors }) => {
    const { userId, ...data } = input;

    const [user] = await context.db
      .update(UserTable)
      .set(data)
      .where(eq(UserTable.id, userId))
      .returning();

    if (!user) {
      throw errors.NOT_FOUND();
    }

    return { message: API_MESSAGES.USER.UPDATE, data: user };
  });
export type UpdateUserOutput = InferRouterOutputs<typeof updateUser>;

const userBan = superAdminBaseOs
  .route({
    path: "/users/ban",
    description: "Ban or unban user",
    tags,
  })
  .input(userBannedSchema.extend({ userId: z.uuid() }))
  .output(apiOutput(z.null()))
  .handler(async ({ input, context }) => {
    if (input?.banned) {
      let banExpiresIn: number = 60 * 60 * 24 * 10;

      if (input.banExpires) {
        banExpiresIn = input.banExpires.getTime() - Date.now();
      }

      await auth.api.banUser({
        body: {
          userId: input.userId,
          banReason: input.banReason,
          banExpiresIn,
        },
        headers: context.reqHeaders,
      });

      return {
        message: API_MESSAGES.USER.BAN,
        data: null,
      };
    }
    await auth.api.unbanUser({
      body: {
        userId: input.userId,
      },
      headers: context.reqHeaders,
    });

    return {
      message: API_MESSAGES.USER.UNBAN,
      data: null,
    };
  });
export type UserBanOutput = InferRouterOutputs<typeof userBan>;

const deleteUser = superAdminBaseOs
  .route({
    path: "/users/delete",
    description: "Delete user",
    tags,
  })
  .errors({
    NOT_FOUND: {
      message: API_MESSAGES.USER.NOT_FOUND,
      status: 404,
    },
  })
  .input(
    z.object({
      userId: z.uuid(),
    })
  )
  .output(apiOutput(z.null()))
  .handler(async ({ input, context, errors }) => {
    const [user] = await context.db
      .delete(UserTable)
      .where(eq(UserTable.id, input.userId))
      .returning();

    if (!user) {
      throw errors.NOT_FOUND();
    }

    return {
      message: API_MESSAGES.USER.DELETE,
      data: null,
    };
  });
export type DeleteUserOutput = InferRouterOutputs<typeof deleteUser>;

export const userRouter = {
  list: listUser,
  stats: getUserStats,
  update: updateUser,
  ban: userBan,
  delete: deleteUser,
};
