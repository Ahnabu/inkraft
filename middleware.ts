import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
    const session = await auth();

    // Protected routes that require authentication
    const protectedPaths = ["/write", "/dashboard", "/admin"];
    const { pathname } = request.nextUrl;

    // Check if the current path starts with any protected path
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected && !session) {
        // Redirect to sign-in with callback URL
        const signInUrl = new URL("/api/auth/signin", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        "/write/:path*",
        "/dashboard/:path*",
        "/new/:path*",
        "/admin/:path*",
    ],
};
