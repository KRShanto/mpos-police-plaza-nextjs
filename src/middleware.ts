import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path.startsWith("/auth/");
  const isApiPath = path.startsWith("/api/");

  // Don't redirect API routes, let them handle their own auth
  if (isApiPath) {
    return NextResponse.next();
  }

  // Get token from cookies using request.cookies
  const token = request.cookies.get("token")?.value;

  // For public paths (login, register, etc.)
  if (isPublicPath) {
    // If user is logged in, redirect to dashboard
    if (token) {
      try {
        const payload = await verifyJWT(token);
        if (payload) {
          const response = NextResponse.redirect(new URL("/", request.url));
          // Preserve the token in the response
          response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
          return response;
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Token verification error:", error.message);
        }
        // If token is invalid, continue to public path without clearing cookie
        return NextResponse.next();
      }
    }
    // No token on public path - allow access
    return NextResponse.next();
  }

  // For protected paths
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Verify token for protected paths
  try {
    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Protected path token verification error:", error.message);
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
