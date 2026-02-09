import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-adapter";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production"
                ? "__Secure-authjs.session-token"
                : "authjs.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    ...authConfig,
    providers: [
        ...authConfig.providers,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    await dbConnect();

                    const user = await User.findOne({ email: credentials.email }).select(
                        "+password"
                    );

                    if (!user) {
                        throw new Error("Invalid credentials");
                    }

                    // Check if user is banned
                    if (user.banned) {
                        throw new Error("Account has been banned");
                    }

                    // Check if user has password (might be OAuth-only user)
                    if (!user.password) {
                        throw new Error("Please sign in with Google");
                    }

                    // Verify password
                    const isMatch = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    );

                    if (!isMatch) {
                        throw new Error("Invalid credentials");
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role,
                        banned: user.banned,
                        trustScore: user.trustScore,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
});
