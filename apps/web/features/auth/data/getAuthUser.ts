import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import "server-only";

import { auth } from "@/lib/better-auth/auth";

import { DEFAULT_UNAUTH_PATH } from "@/constant";

export const getAuthUser = cache(async () => {
  const dbSession = await auth.api.getSession({ headers: await headers() });

  if (!dbSession) return redirect(DEFAULT_UNAUTH_PATH);

  return dbSession;
});
