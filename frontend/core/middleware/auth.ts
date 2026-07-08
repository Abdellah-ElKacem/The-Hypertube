import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function authMiddleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // ── 0. Handle OAuth callback: /?token=ACCESS&refreshToken=REFRESH ──
  // The backend redirects here after OAuth login. We grab the tokens,
  // set them as cookies server-side, and redirect to /home immediately
  // so the user never sees the landing page flash.
  const oauthToken = searchParams.get("token");
  const oauthRefreshToken = searchParams.get("refreshToken");

  if (oauthToken && oauthRefreshToken) {
    const redirectTo = request.cookies.get("oauth_redirect_to")?.value || "/home";
    const redirectUrl = new URL(redirectTo, request.url);
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("access_token", oauthToken, { path: "/" });
    response.cookies.set("refresh_token", oauthRefreshToken, { path: "/" });
    response.cookies.delete("oauth_redirect_to");
    return response;
  }

  // ── Normal auth checks ──
  const token = request.cookies.get("access_token")?.value;

  const isOnboardingRoute =
    pathname === "/login" ||
    pathname === "/sign-up" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/reset-password") ||
    pathname === "/verify-email";

  const isProtectedRoute = pathname.startsWith("/home");

  // 1. If authenticated and on onboarding/auth pages or landing page, redirect to /home
  if (token && (isOnboardingRoute || pathname === "/")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // 2. If NOT authenticated and on protected routes, redirect to /login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Return null to continue execution of subsequent middlewares
  return null;
}
