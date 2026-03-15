import { BreadcrumbRoute } from "@/types"
import type { RouteType } from "next/dist/lib/load-custom-routes"

export const DEFAULT_AUTH_PATH: __next_route_internal_types__.RouteImpl<RouteType> =
  "/dashboard"
export const DEFAULT_UNAUTH_PATH: __next_route_internal_types__.RouteImpl<RouteType> =
  "/login"
export const RESET_PASSWORD_PATH: __next_route_internal_types__.RouteImpl<RouteType> =
  "/reset-password"
export const ERROR_PAGE_PATH: __next_route_internal_types__.RouteImpl<RouteType> =
  "/error"
export const ACCEPT_INVITATION: __next_route_internal_types__.RouteImpl<RouteType> =
  "/accept-invitation"

export const AUTH_ROUTES: Array<
  __next_route_internal_types__.RouteImpl<RouteType>
> = [DEFAULT_UNAUTH_PATH, "/register", "/forget-password", RESET_PASSWORD_PATH]

export const PUBLIC_ROUTES: Array<
  __next_route_internal_types__.RouteImpl<RouteType>
> = [...AUTH_ROUTES, "/"]

export const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

export const breadcrumbRoutes: Array<BreadcrumbRoute> = [
  {
    title: "Dashboard",
    path: "/dashboard",
    children: [
      {
        title: "All Users",
        path: "/dashboard/super-admin/users",
      },
      {
        title: "Settings",
        path: "/dashboard/settings",
        children: [
          {
            title: "Profile",
            path: "/dashboard/settings/profile",
          },
        ],
      },
    ],
  },
]
