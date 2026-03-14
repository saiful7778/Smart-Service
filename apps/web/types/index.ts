export type AuthUser = {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  emailVerified: boolean
  name: string
  image?: string | null | undefined | undefined
  role: "USER" | "ADMIN" | "SUPER_ADMIN"
  displayRole: string
  banned: boolean | null | undefined
  banReason?: string | null | undefined
  banExpires?: Date | null | undefined
}
