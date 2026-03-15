import { SidebarMenuLink } from "@/types"
import {
  UserRoleEnumSchema,
  UserRoleEnumType,
} from "@workspace/drizzle/client-enums"
import { House, Settings, UsersRound } from "lucide-react"

export const mainMenuLinks: Array<{
  groupName: string
  accessibleUserRoles: Array<UserRoleEnumType>
  items: Array<SidebarMenuLink>
}> = [
  {
    groupName: "Dashboard",
    accessibleUserRoles: [
      UserRoleEnumSchema.enum.USER,
      UserRoleEnumSchema.enum.ADMIN,
      UserRoleEnumSchema.enum.SUPER_ADMIN,
    ],
    items: [
      {
        title: "Dashboard",
        icon: House,
        path: "/dashboard",
      },
    ],
  },
  {
    groupName: "Super Admin",
    accessibleUserRoles: [UserRoleEnumSchema.enum.SUPER_ADMIN],
    items: [
      {
        title: "All Users",
        icon: UsersRound,
        path: "/dashboard/super-admin/users",
      },
    ],
  },
]

export const footerMenuLinks: Array<SidebarMenuLink> = [
  {
    title: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
]
