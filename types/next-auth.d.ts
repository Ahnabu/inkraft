import { DefaultSession } from "next-auth"

declare module "@auth/core/adapters" {
    interface AdapterUser {
        role: "admin" | "author" | "reader"
        banned: boolean
        trustScore: number
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string
            role: "admin" | "author" | "reader"
            banned: boolean
            trustScore: number
        } & DefaultSession["user"]
    }

    interface User {
        role: "admin" | "author" | "reader"
        banned: boolean
        trustScore: number
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        role: "admin" | "author" | "reader"
        banned: boolean
        trustScore: number
    }
}
