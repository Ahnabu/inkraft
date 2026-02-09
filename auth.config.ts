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
                session.user.role = token.role;
                session.user.banned = token.banned;
                session.user.trustScore = token.trustScore;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.role = user.role;
                token.banned = user.banned;
                token.trustScore = user.trustScore;
            }

            // For OAuth providers, check user ban status from database
            if (account?.provider === "google" && user) {
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
