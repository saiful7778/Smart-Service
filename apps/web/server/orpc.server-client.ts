import { headers } from "next/headers";

import { createRouterClient } from "@orpc/server";
import "server-only";

import { db } from "@/lib/db";

import { router } from "./orpc.router";

export const orpcServerClient = createRouterClient(router, {
  /**
   * Provide initial context if needed.
   *
   * Because this client instance is shared across all requests,
   * only include context that's safe to reuse globally.
   * For per-request context, use middleware context or pass a function as the initial context.
   */
  context: async () => ({
    reqHeaders: await headers(),
    db,
  }),
});

globalThis.$client = orpcServerClient;
