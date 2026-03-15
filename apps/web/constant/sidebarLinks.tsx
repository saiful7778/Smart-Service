import { SidebarMenuLink } from "@/types";
import {
  UserRoleEnumSchema,
  UserRoleEnumType,
} from "@workspace/drizzle/client-enums";
import { House, Settings } from "lucide-react";

export const mainMenuLinks: Array<{
  groupName: string;
  accessibleUserRoles: Array<UserRoleEnumType>;
  items: Array<SidebarMenuLink>;
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
];

export const footerMenuLinks: Array<SidebarMenuLink> = [
  {
    title: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

export const settingsMenuLinks: Array<{ title: string; path: string }> = [
  {
    title: "Profile",
    path: "/dashboard/settings/profile",
  },
  {
    title: "Update Password",
    path: "/dashboard/settings/update-password",
  },
  {
    title: "Sessions",
    path: "/dashboard/settings/sessions",
  },
  {
    title: "Connected Apps",
    path: "/dashboard/settings/connected-apps",
  },
];
