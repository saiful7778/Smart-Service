import { UserRoleEnumSchema } from "@workspace/drizzle/client-enums"
import { baseOs, publicOs } from "../orpc.context"
import { auth } from "@/lib/better-auth/auth"

export const authMiddleware = baseOs.middleware(
  async ({ context, next, errors }) => {
    const sessionData = await auth.api.getSession({
      headers: context.reqHeaders,
    })

    if (!sessionData?.session || !sessionData?.user) {
      throw errors.UNAUTHORIZED()
    }

    return next({
      context: {
        session: sessionData.session,
        user: sessionData.user,
      },
    })
  }
)

export const authBaseOs = publicOs.use(authMiddleware)

export const superAdminMiddleware = baseOs.middleware(
  async ({ context, next, errors }) => {
    const sessionData = await auth.api.getSession({
      headers: context.reqHeaders,
    })

    if (!sessionData?.session || !sessionData?.user) {
      throw errors.UNAUTHORIZED()
    }

    if (sessionData.user.role !== UserRoleEnumSchema.enum.SUPER_ADMIN) {
      throw errors.FORBIDDEN()
    }

    return next({
      context: {
        session: sessionData.session,
        user: sessionData.user,
      },
    })
  }
)

export const superAdminBaseOs = publicOs.use(superAdminMiddleware)
