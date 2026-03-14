import z from "zod"
import { USER_ROLES } from "./enum-values"

export const UserRoleEnumSchema = z.enum(USER_ROLES)
export type UserRoleEnumType = z.infer<typeof UserRoleEnumSchema>
