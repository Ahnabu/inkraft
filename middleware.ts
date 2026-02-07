import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    // Protected routes that require authentication
    const protectedPaths = ["/write", "/dashboard", "/admin", "/new"];
    
    // Check if the current path starts with any protected path
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected && !isLoggedIn) {
        // Redirect to sign-in with callback URL
        const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
});

// Configure which routes to run middleware on
export const config = {
    matcher: [
        "/write/:path*",
        "/dashboard/:path*",
        "/new/:path*",
        "/admin/:path*",
    ],
};
