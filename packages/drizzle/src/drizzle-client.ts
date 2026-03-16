import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schemas";

export function createDrizzleClient(
  DATABASE_URL: string,
  NODE_ENV: string,
  DB_OPERATION_MODE: "seed" | "normal"
): PostgresJsDatabase<typeof schema> {
  const connection = postgres(DATABASE_URL, {
    max: NODE_ENV === "production" ? 20 : 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
    debug: NODE_ENV === "development" && DB_OPERATION_MODE !== "seed",
  });

  return drizzle(connection, {
    schema,
    logger: NODE_ENV === "development" && DB_OPERATION_MODE !== "seed",
  });
}

export type DatabaseType = ReturnType<typeof createDrizzleClient>;
