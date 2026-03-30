import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/invite", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get("cx-auth")?.value === "true";
  const userRole = request.cookies.get("cx-role")?.value;
  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p));

  // Public paths: redirect to home if already logged in
  if (isPublicPath) {
    if (isAuthenticated && pathname === "/login") {
      const redirectUrl = userRole === "customer" ? "/customer" : "/";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // Protected paths: redirect to login if not authenticated
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route guard
  if (pathname.startsWith("/customer") && userRole !== "customer") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !pathname.startsWith("/customer") &&
    userRole === "customer" &&
    !isPublicPath
  ) {
    return NextResponse.redirect(new URL("/customer", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo/).*)"],
};
