
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Article | Inkraft",
    description: "Create and publish a new article on Inkraft. Share your expertise with the world.",
};

export default function NewPostLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
