/* eslint-disable no-undef */
import { config } from "dotenv"
import { join } from "node:path"

const NODE_ENV = process.env.NODE_ENV || "development"

config({
  path: [
    join(process.cwd(), "../../.env"),
    join(process.cwd(), `../../.env.${NODE_ENV}.local`),
  ],
  debug: NODE_ENV === "development",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/drizzle"],
  typedRoutes: true,
  reactCompiler: true,
}

export default nextConfig
