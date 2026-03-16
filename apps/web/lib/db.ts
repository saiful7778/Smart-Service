import "server-only";

import { createDrizzleClient, type DatabaseType } from "@workspace/drizzle";

import { env } from "@/configs/env.config";

const globalForDb = globalThis as unknown as {
  db: DatabaseType | undefined;
};

export const db: DatabaseType =
  globalForDb.db ??
  createDrizzleClient(env.DATABASE_URL, env.NODE_ENV, "normal");

if (env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
