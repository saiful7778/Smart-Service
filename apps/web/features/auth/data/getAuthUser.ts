import "server-only"

import { DEFAULT_UNAUTH_PATH } from "@/constant"
import { auth } from "@/lib/better-auth/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"

export const getAuthUser = cache(async () => {
  const dbSession = await auth.api.getSession({ headers: await headers() })

  if (!dbSession) return redirect(DEFAULT_UNAUTH_PATH)

  return dbSession
})
