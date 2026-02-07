import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ 
        req: request,
        secret: process.env.AUTH_SECRET,
    });

    const { pathname } = request.nextUrl;
    const protectedPaths = ["/write", "/dashboard", "/admin", "/new", "/settings", "/edit"];
    const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtectedRoute && !token) {
        const signInUrl = new URL("/auth/signin", request.nextUrl.origin);
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
        "/settings/:path*",
        "/edit/:path*",
    ],
};
