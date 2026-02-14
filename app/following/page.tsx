
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { UserCard } from "@/components/user/UserCard";
import { Users, UserPlus } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Following | Inkraft",
    description: "Authors you follow on Inkraft",
};

export default async function FollowingPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    await dbConnect();

    // Fetch user with populated following list
    const user = await User.findById(session.user.id)
        .populate({
            path: "following",
            select: "name image bio followers",
            model: User
        })
        .lean();

    if (!user) {
        redirect("/auth/signin");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const following = (user.following || []) as any[];

    // Calculate follower counts for display if needed involves more queries or storage
    // For now, we'll just use the length of the followers array if available on the populated user object
    // Note: The 'followers' field on User is an array of IDs. Populating it just for count might be heavy if large.
    // Ideally, we'd have a 'followerCount' field. We can map it if it's there.

    // Transform data for UserCard
    const formattedFollowing = following.map(author => ({
        _id: author._id.toString(),
        name: author.name,
        image: author.image,
        bio: author.bio,
        followersCount: author.followers?.length || 0
    }));

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Users className="text-primary" />
                        Following
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Authors you are following ({formattedFollowing.length})
                    </p>
                </div>

                <Link href="/authors">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors font-medium">
                        <UserPlus size={18} />
                        Find writers
                    </button>
                </Link>
            </div>

            {formattedFollowing.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {formattedFollowing.map((author) => (
                        <UserCard
                            key={author._id}
                            user={author}
                            isFollowing={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border/50">
                    <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">You aren't following anyone yet</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Follow authors to see their latest posts in your specialized feed and get notified when they publish.
                    </p>
                    <Link href="/explore">
                        <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium">
                            Explore Authors
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
