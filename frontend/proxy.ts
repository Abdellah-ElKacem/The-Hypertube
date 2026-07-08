import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authMiddleware } from "@/core/middleware/auth";

export function proxy(request: NextRequest) {
  // 1. Run Auth Middleware
  const authResponse = authMiddleware(request);
  if (authResponse) return authResponse;

  // Note: You can import and run additional middlewares here in sequence:
  // const anotherResponse = anotherMiddleware(request);
  // if (anotherResponse) return anotherResponse;

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/sign-up",
    "/forgot-password",
    "/reset-password/:path*",
    "/verify-email",
    "/home/:path*",
  ],
};
