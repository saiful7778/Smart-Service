import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    GOOGLE_AUTH_CLIENT_SECRET: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url().min(1),
    MAIL_FROM: z.email().min(1),
    GOOGLE_MAIL_USER: z.string().min(1),
    GOOGLE_MAIL_PASS: z.string().min(1),
    MAILHOG_HOST: z.string().min(1),
    MAILHOG_PORT: z
      .string()
      .default("1025")
      .transform((arg) => parseInt(arg)),
  },
  client: {
    NEXT_PUBLIC_NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.url().min(1),
    NEXT_PUBLIC_SITE_NAME: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_AUTH_CLIENT_SECRET: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID,
    MAIL_FROM: process.env.MAIL_FROM,
    GOOGLE_MAIL_USER: process.env.GOOGLE_MAIL_USER,
    GOOGLE_MAIL_PASS: process.env.GOOGLE_MAIL_PASS,
    MAILHOG_HOST: process.env.MAILHOG_HOST,
    MAILHOG_PORT: process.env.MAILHOG_PORT,
  },
});
