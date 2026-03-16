import { db_id } from "../../utils/db-utils"
import {
  text,
  index,
  foreignKey,
  timestamp,
  varchar,
  uuid,
  pgTable,
} from "drizzle-orm/pg-core"
import { UserTable } from "./user.table"
import { relations } from "drizzle-orm"
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod"
import z from "zod"

export const UserActivityTable = pgTable(
  "user_activities",
  {
    id: db_id,
    userId: uuid("user_id").notNull(),
    sessionId: uuid("session_id").notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    loginAt: timestamp("login_at", { withTimezone: true, precision: 3 })
      .notNull()
      .defaultNow(),
    logoutAt: timestamp("logout_at", { withTimezone: true, precision: 3 }),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true, precision: 3 })
      .notNull()
      .defaultNow(),
  },
  (userActivity) => [
    foreignKey({
      name: "user_activity_user_fkey",
      columns: [userActivity.userId],
      foreignColumns: [UserTable.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    index("user_activity_user_id_idx").on(userActivity.userId),
    index("user_activity_login_at_idx").on(userActivity.loginAt),
    index("session_activity_last_seen_at_idx").on(userActivity.lastSeenAt),
  ]
)

export const UserActivityRelations = relations(
  UserActivityTable,
  ({ one }) => ({
    user: one(UserTable, {
      relationName: "UserToUserActivity",
      fields: [UserActivityTable.userId],
      references: [UserTable.id],
    }),
  })
)

export const insertUserActivitySchema = createInsertSchema(
  UserActivityTable
).omit({
  id: true,
})
export const selectUserActivitySchema = createSelectSchema(UserActivityTable)
export const updateUserActivitySchema = createUpdateSchema(
  UserActivityTable
).omit({
  id: true,
})

export type UserActivityDataModel = typeof UserActivityTable.$inferSelect
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>
export type SelectUserActivity = z.infer<typeof selectUserActivitySchema>
