import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const protectedPaths = ["/write", "/dashboard", "/admin", "/new", "/settings", "/edit"];
    const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    try {
        // Try to get and validate the JWT token
        const token = await getToken({ 
            req: request,
            secret: process.env.AUTH_SECRET,
        });

        if (!token) {
            const signInUrl = new URL("/auth/signin", request.nextUrl.origin);
            signInUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(signInUrl);
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware auth error:", error);
        // On error, check for session cookie as fallback
        const sessionCookie = request.cookies.get("authjs.session-token") || 
                              request.cookies.get("__Secure-authjs.session-token");

        if (!sessionCookie) {
            const signInUrl = new URL("/auth/signin", request.nextUrl.origin);
            signInUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(signInUrl);
        }

        // Let it through if cookie exists, server-side pages will validate
        return NextResponse.next();
    }
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        "/write/:path*",
        "/dashboard/:path*",
        "/new/:path*",
        "/admin/:path*",
        "/settings/:path*",
        "/edit/:path*",
    ],
};
