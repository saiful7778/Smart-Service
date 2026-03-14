import { config } from "dotenv";
import { join } from "node:path";
import { defineConfig } from "drizzle-kit";

const NODE_ENV = process.env.NODE_ENV || "development";

config({
  path: [
    join(process.cwd(), "../../.env"),
    join(process.cwd(), `../../.env.${NODE_ENV}.local`),
  ],
  debug: true,
});

export default defineConfig({
  dialect: "postgresql",
  out: "./migrations/",
  schema: "./src/schemas/**",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "__drizzle_migrations",
    schema: "public",
  },
  breakpoints: true,
  verbose: true,
  strict: true,
});
