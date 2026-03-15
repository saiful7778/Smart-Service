import type { UserRoleEnumType } from "@workspace/drizzle/client-enums";
import type { LucideIcon } from "lucide-react";
import type { RouteType } from "next/dist/lib/load-custom-routes";

export type SidebarMenuLink = {
  title: string;
  path: __next_route_internal_types__.RouteImpl<RouteType>;
  icon?: LucideIcon | undefined;
  items?: Array<SidebarMenuLink> | undefined;
};

export type BreadcrumbRoute = {
  title: string;
  path: __next_route_internal_types__.RouteImpl<RouteType>;
  children?: BreadcrumbRoute[];
};

export type AuthUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined | undefined;
  role: UserRoleEnumType;
  displayRole: string;
  banned: boolean | null | undefined;
  banReason?: string | null | undefined;
  banExpires?: Date | null | undefined;
};
