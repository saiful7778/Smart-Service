import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth, type BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import {
  type AccessControl,
  admin,
  haveIBeenPwned,
  oneTap,
  openAPI,
} from "better-auth/plugins";
import "server-only";

import {
  AccountTable,
  SessionTable,
  UserTable,
  VerificationTable,
} from "@workspace/drizzle";
import {
  UserEventCategoryEnumSchema,
  UserRoleEnumSchema,
} from "@workspace/drizzle/client-enums";

import { env } from "@/configs/env.config";
import { ERROR_PAGE_PATH } from "@/constant";
import { createUserActivity } from "@/features/user/data/create-user-activity";
import { createUserEvent } from "@/features/user/data/create-user-event";

import { db } from "../db";
import { mailProvider } from "../mail";
import { accessControl } from "./accessControl";

function createBetterAuth() {
  const defaultPlugins: Array<BetterAuthPlugin> = [];

  if (env.NODE_ENV === "production") {
    defaultPlugins.push(
      haveIBeenPwned({
        customPasswordCompromisedMessage:
          "This password is compromised, choose a stronger one",
      })
    );
  }

  return betterAuth({
    appName: env.NEXT_PUBLIC_SITE_NAME,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: UserTable,
        session: SessionTable,
        account: AccountTable,
        verification: VerificationTable,
      },
    }),
    telemetry: { enabled: true },
    trustedOrigins: [env.NEXT_PUBLIC_SITE_URL],
    advanced: {
      database: {
        generateId: false,
      },
    },
    databaseHooks: {
      session: {
        create: {
          before: async (session) => {
            return {
              data: {
                ...session,
              },
            };
          },
          after: async (session) => {
            await createUserActivity({
              userId: session.userId,
              sessionId: session.id,
              ipAddress: session.ipAddress,
              userAgent: session.userAgent,
            });

            // Log AUTH event
            await createUserEvent({
              userId: session.userId,
              category: UserEventCategoryEnumSchema.enum.AUTH,
              action: "LOGIN",
              ipAddress: session.ipAddress,
              metadata: { userAgent: session.userAgent },
            });
          },
        },
      },
    },
    hooks: {
      after: createAuthMiddleware(async (ctx) => {
        if (ctx.path.startsWith("/sign-up")) {
          // after user successfully sign up
          const user = ctx.context.newSession?.user ?? {
            name: ctx.body.name,
            email: ctx.body.email,
          };
          if (user != null) {
            console.log("User Signup", user);
          }
        }
      }),
    },
    onAPIError: {
      errorURL: ERROR_PAGE_PATH,
    },
    account: {
      accountLinking: {
        trustedProviders: ["google", "email-password"],
      },
    },
    socialProviders: {
      google: {
        clientId: env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID,
        clientSecret: env.GOOGLE_AUTH_CLIENT_SECRET,
        redirectURI: `${env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/google`,
        accessType: "offline",
        prompt: "select_account",
        mapProfileToUser: () => {
          return {
            role: UserRoleEnumSchema.enum.USER,
            displayRole: "User",
          };
        },
      },
    },
    user: {
      changeEmail: {
        enabled: false,
      },
      deleteUser: {
        enabled: false,
      },
      additionalFields: {
        role: {
          type: UserRoleEnumSchema.options,
          defaultValue: UserRoleEnumSchema.enum.USER,
          input: true,
        },
        displayRole: {
          type: "string",
          defaultValue: "User",
          input: true,
        },
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      expiresIn: 60 * 60,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        const { html, subject, text, to } =
          await mailProvider.createEmailVerificationMail({
            to: user.email,
            verifyUrl: url,
            userName: user.name,
          });

        await mailProvider.sendMail({
          html,
          subject,
          text,
          to,
        });
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      maxPasswordLength: 20,
      autoSignIn: false,
      requireEmailVerification: true,
      resetPasswordTokenExpiresIn: 60 * 60,
      sendResetPassword: async ({ user, url }) => {
        const { subject, to, html, text } =
          await mailProvider.createPasswordResetMail({
            to: user.email,
            resetUrl: url,
            userName: user.name,
          });

        await mailProvider.sendMail({
          html,
          subject,
          text,
          to,
        });
      },
    },
    plugins: [
      admin({
        ac: accessControl.ac as AccessControl,
        roles: accessControl.roles,
        defaultRole: UserRoleEnumSchema.enum.USER,
        defaultBanExpiresIn: 60 * 60 * 24 * 10, // 10 day
        bannedUserMessage: "Your account is currently banned",
        adminRoles: [UserRoleEnumSchema.enum.SUPER_ADMIN],
      }),
      ...defaultPlugins,
      openAPI(),
      oneTap(),
      nextCookies(),
    ],
  });
}

export const auth = createBetterAuth();
