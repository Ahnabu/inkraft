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
        // Check for session cookies first (faster check)
        const cookieNames = [
            "authjs.session-token",
            "__Secure-authjs.session-token",
            "next-auth.session-token",
            "__Secure-next-auth.session-token"
        ];
        
        const hasSessionCookie = cookieNames.some(name => request.cookies.get(name));
        
        if (!hasSessionCookie) {
            console.log("No session cookie found, redirecting to sign in");
            const signInUrl = new URL("/auth/signin", request.nextUrl.origin);
            signInUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(signInUrl);
        }

        // Validate the JWT token
        const token = await getToken({ 
            req: request,
            secret: process.env.AUTH_SECRET,
            secureCookie: process.env.NODE_ENV === "production",
            cookieName: process.env.NODE_ENV === "production" 
                ? "__Secure-authjs.session-token" 
                : "authjs.session-token"
        });

        if (!token) {
            console.log("Token validation failed, redirecting to sign in");
            const signInUrl = new URL("/auth/signin", request.nextUrl.origin);
            signInUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(signInUrl);
        }

        // Check if user is banned
        if (token.banned) {
            console.log("User is banned, redirecting to home");
            return NextResponse.redirect(new URL("/", request.nextUrl.origin));
        }

        console.log("Token valid, allowing access to:", pathname);
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware auth error:", error);
        
        // On error, be permissive and let through if any session cookie exists
        const cookieNames = [
            "authjs.session-token",
            "__Secure-authjs.session-token",
            "next-auth.session-token",
            "__Secure-next-auth.session-token"
        ];
        
        const hasSessionCookie = cookieNames.some(name => request.cookies.get(name));
        
        if (hasSessionCookie) {
            console.log("Error during token validation, but session cookie exists - allowing through");
            return NextResponse.next();
        }

        console.log("Error and no session cookie, redirecting to sign in");
        const signInUrl = new URL("/auth/signin", request.nextUrl.origin);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
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
