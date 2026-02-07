import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export default {
    providers: [Google],
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    basePath: "/api/auth",
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub as string;
                // @ts-expect-error - role property extended in custom type
                session.user.role = token.role as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // @ts-expect-error - role property extended in custom type
                token.role = user.role;
            }
            return token;
        },
        authorized({ auth, request }) {
            const { pathname } = request.nextUrl;
            const isLoggedIn = !!auth?.user;
            const protectedPaths = ["/write", "/dashboard", "/admin", "/new", "/settings", "/edit"];
            const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));
            
            if (isProtectedRoute && !isLoggedIn) {
                return false; // Redirect to login
            }
            
            return true;
        },
    },
    pages: {
        signIn: "/auth/signin", // Custom sign in page
    },
} satisfies NextAuthConfig;
