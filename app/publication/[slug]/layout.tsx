import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Publication | Inkraft",
    description: "Read stories from this publication on Inkraft.",
};

export default function PublicationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    );
}
