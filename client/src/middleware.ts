import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - login, register (login and register pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export function middleware(request: NextRequest) {
  const isLoginOrRegisterPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";
  const userLoginCookie = request.cookies.get("user_login");

  // If cookie is missing or invalid, redirect to the login page
  if (!userLoginCookie) {
    if (isLoginOrRegisterPage) {
      return NextResponse.next(); // stay
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const loginData = JSON.parse(userLoginCookie.value);

    // If any required field is missing in the cookie, redirect to login
    if (!loginData.username || !loginData.password) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch {
    // If parsing fails, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // if on login or register page and we have the cookie, redirect to home
  if (isLoginOrRegisterPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // If the user is authenticated, continue to the requested page
  return NextResponse.next();
}
