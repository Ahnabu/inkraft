
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In | Inkraft",
    description: "Sign in to your Inkraft account to manage your blog, follow authors, and engage with the community.",
};

export default function SignInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
