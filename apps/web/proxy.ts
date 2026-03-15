import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import {
  ACCEPT_INVITATION,
  AUTH_ROUTES,
  DEFAULT_AUTH_PATH,
  DEFAULT_UNAUTH_PATH,
  PUBLIC_ROUTES,
} from "./constant";
import { auth } from "./lib/better-auth/auth";
import { UserRoleEnumSchema } from "@workspace/drizzle/client-enums";
import type { RouteType } from "next/dist/lib/load-custom-routes";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoutes = PUBLIC_ROUTES.includes(
    pathname as __next_route_internal_types__.RouteImpl<RouteType>
  );
  const isAuthRoutes = AUTH_ROUTES.includes(
    pathname as __next_route_internal_types__.RouteImpl<RouteType>
  );

  const sessionCookie = getSessionCookie(request);

  let dbSession: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;

  if (sessionCookie) {
    dbSession = await auth.api.getSession({ headers: request.headers });
  }

  // cookie exists but session is invalid
  if (sessionCookie && !dbSession) {
    const response = NextResponse.redirect(
      new URL(DEFAULT_UNAUTH_PATH, request.url)
    );

    return response;
  }

  if (!dbSession && !isPublicRoutes) {
    const unAuthUrl = new URL(DEFAULT_UNAUTH_PATH, request.url);

    if (pathname.includes(ACCEPT_INVITATION)) {
      unAuthUrl.searchParams.set("callback", pathname);
    }

    return NextResponse.redirect(unAuthUrl);
  }

  if (isAuthRoutes && sessionCookie) {
    return NextResponse.redirect(new URL(DEFAULT_AUTH_PATH, request.url));
  }

  if (pathname.startsWith("/super-admin") && dbSession) {
    const isSuperAdmin =
      dbSession.user.role === UserRoleEnumSchema.enum.SUPER_ADMIN;

    if (!isSuperAdmin) {
      return NextResponse.redirect(new URL(DEFAULT_UNAUTH_PATH, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /**
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - orpc (orpc routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|orpc|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$).*)",
  ],
};
