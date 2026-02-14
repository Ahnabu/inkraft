import { Metadata } from "next";
import { getAllAuthors, getUserFollowing } from "@/lib/data/users";
import { Users } from "lucide-react";
import { auth } from "@/auth";
import { AuthorList } from "@/components/AuthorList";

export const metadata: Metadata = {
    title: "Discover Authors | Inkraft",
    description: "Find and follow the best writers on Inkraft.",
};

export default async function AuthorsPage() {
    const session = await auth();
    const authors = await getAllAuthors();

    let followingIds: string[] = [];
    if (session?.user?.id) {
        followingIds = await getUserFollowing(session.user.id);
    }

    // Sort authors: those with most followers first, then by name
    const sortedAuthors = [...authors].sort((a, b) => {
        // Mock sort logic as we might not have follower counts in the user object yet
        // In a real app, we would sort by follower count
        return (a.name || "").localeCompare(b.name || "");
    });

    return (
        <main className="min-h-screen py-12 container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                        <Users className="w-10 h-10 text-primary" />
                        Discover Authors
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Connect with the voices that matter to you.
                    </p>
                </div>

                <AuthorList
                    initialAuthors={sortedAuthors}
                    currentUserId={session?.user?.id}
                    followingIds={followingIds}
                />
            </div>
        </main>
    );
}
