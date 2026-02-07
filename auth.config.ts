import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export default {
    providers: [Google],
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub as string;
                // @ts-expect-error - role property extended in custom type
                session.user.role = token.role as string;
                // @ts-expect-error - banned property extended in custom type
                session.user.banned = token.banned as boolean;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                // @ts-expect-error - role property extended in custom type
                token.role = user.role;
                // @ts-expect-error - banned property extended in custom type
                token.banned = user.banned;
            }
            
            // For OAuth providers, check user ban status from database
            if (account?.provider === "google" && user) {
                // @ts-expect-error - banned property might exist
                if (user.banned) {
                    throw new Error("Account has been banned");
                }
            }
            
            return token;
        },
    },
    pages: {
        signIn: "/auth/signin", // Custom sign in page
    },
} satisfies NextAuthConfig;
