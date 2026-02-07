export { auth as middleware } from "@/auth";

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
