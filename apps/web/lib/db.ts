import "server-only"

import { env } from "@/configs/env.config"
import { createDrizzleClient, type DatabaseType } from "@workspace/drizzle"

const globalForDb = globalThis as unknown as {
  db: DatabaseType | undefined
}

export const db: DatabaseType =
  globalForDb.db ??
  createDrizzleClient(env.DATABASE_URL, env.NODE_ENV, "normal")

if (env.NODE_ENV !== "production") {
  globalForDb.db = db
}
