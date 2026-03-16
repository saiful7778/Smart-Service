import type { RouteType } from "next/dist/lib/load-custom-routes";

import type { LucideIcon } from "lucide-react";

import type { UserRoleEnumType } from "@workspace/drizzle/client-enums";

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

export interface IApiHookInput {
  onRequest?: () => void;
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string) => void;
  onValidationErrors?: (
    fields: Array<{ fieldName: string; message: string }>
  ) => void;
}

export type FiltersType = Partial<{
  page: number;
  limit: number;
  search: string;
  order: "asc" | "desc";
  orderField: string;
}>;
