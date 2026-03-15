import "server-only"

import { auth } from "@/lib/better-auth/auth"
import { LiteralString } from "better-auth"
import { cache } from "react"

export const getUserPermission = cache(
  async (
    userId: string,
    permissions: {
      readonly [x: string]: LiteralString[] | undefined
    }
  ) => {
    return auth.api.userHasPermission({
      body: {
        userId,
        permissions,
      },
    })
  }
)
