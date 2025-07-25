import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow Next.js internals and auth pages
  const publicPaths = [
    "/login",
    "/forgotpassword",
    "/favicon.ico",
    "/background.jpg",
  ];

  const isPublic =
    publicPaths.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api");

  if (isPublic) {
    return NextResponse.next();
  }

  // 🔐 Check for authenticated token with role
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.role !== "ADMIN") {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|background.jpg|api|login|forgotpassword).*)",
  ],
};