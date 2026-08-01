import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const pathname = request.nextUrl.pathname;

  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ];

  const isPublic = publicRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`) ||
      routing.locales.some(
        (locale) =>
          pathname === `/${locale}${route}` ||
          pathname.startsWith(`/${locale}${route}/`),
      ),
  );

  // If there's no token and it's not a public route, redirect to /login
  if (!token && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If there is a token and it's a public route, redirect to /workspaces
  if (token && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/workspaces";
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
