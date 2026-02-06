import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-adapter";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import authConfig from "./auth.config";

// Vercel deployment fix: Ensure NEXTAUTH_URL has protocol
if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
} else if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith("http")) {
    process.env.NEXTAUTH_URL = `https://${process.env.NEXTAUTH_URL}`;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        ...authConfig.providers,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
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
                };
            },
        }),
    ],
});
