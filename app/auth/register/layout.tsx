
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Account | Inkraft",
    description: "Join Inkraft today. Create an account to start writing, following authors, and building your personalized reading list.",
};

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
