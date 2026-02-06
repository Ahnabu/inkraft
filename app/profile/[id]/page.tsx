import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import { auth } from "@/auth";
import { PostFeed } from "@/components/PostFeed";
import {
    Globe,
    Twitter,
    Linkedin,
    FileText,
    ArrowUp,
    Calendar,
    Settings,
    Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";

async function getUserProfile(userId: string, tab: string = "published") {
    await dbConnect();

    const user = await User.findById(userId).lean();
    if (!user) return null;

    let posts = [];

    if (tab === "saved") {
        // Fetch saved posts if requested (and validated in component)
        // We need to re-fetch user with population to get savedPosts
        const userWithSaved = await User.findById(userId)
            .populate({
                path: "savedPosts",
                match: { published: true }, // Only show published saved posts
                populate: { path: "author", select: "name image" }
            })
            .lean();

        posts = userWithSaved?.savedPosts || [];
    } else {
        // Default: Published posts
        posts = await Post.find({ author: userId, published: true })
            .sort({ publishedAt: -1 })
            .populate("author", "name image")
            .lean();
    }

    // Calculate total upvotes (always from authored posts)
    const authoredPosts = await Post.find({ author: userId }).select("upvotes");
    const totalUpvotes = authoredPosts.reduce((sum: number, post: { upvotes?: number }) => sum + (post.upvotes || 0), 0);
    const totalPostsCount = await Post.countDocuments({ author: userId, published: true });

    return {
        user: JSON.parse(JSON.stringify(user)),
        posts: JSON.parse(JSON.stringify(posts)),
        totalUpvotes,
        totalPostsCount
    };
}

export default async function UserProfilePage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ tab?: string }>;
}) {
    const { id } = await params;
    const { tab } = await searchParams;
    const session = await auth();
    const isOwnProfile = session?.user?.id === id;

    // Only allow "saved" tab if it is own profile, otherwise default to "published"
    const currentTab = (tab === "saved" && isOwnProfile) ? "saved" : "published";

    const profileData = await getUserProfile(id, currentTab);

    if (!profileData) {
        notFound();
    }

    const { user, posts, totalUpvotes, totalPostsCount } = profileData;

    return (
        <div className="min-h-screen">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Avatar */}
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted flex-shrink-0 border-4 border-background shadow-xl">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-5xl font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                                    <p className="text-muted-foreground">{user.email}</p>
                                </div>
                                {isOwnProfile && (
                                    <Link
                                        href="/settings"
                                        className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                                    >
                                        <Settings size={16} />
                                        Edit Profile
                                    </Link>
                                )}
                            </div>

                            {user.bio && (
                                <p className="text-lg mb-4 max-w-2xl">{user.bio}</p>
                            )}

                            {/* Social Links */}
                            {user.socialLinks && (
                                <div className="flex items-center gap-3 mb-4">
                                    {user.socialLinks.website && (
                                        <a
                                            href={user.socialLinks.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <Globe size={20} />
                                        </a>
                                    )}
                                    {user.socialLinks.twitter && (
                                        <a
                                            href={`https://twitter.com/${user.socialLinks.twitter}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <Twitter size={20} />
                                        </a>
                                    )}
                                    {user.socialLinks.linkedin && (
                                        <a
                                            href={user.socialLinks.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <Linkedin size={20} />
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <FileText size={16} className="text-muted-foreground" />
                                    <span className="font-semibold">{totalPostsCount}</span>
                                    <span className="text-muted-foreground">
                                        {totalPostsCount === 1 ? "Post" : "Posts"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ArrowUp size={16} className="text-muted-foreground" />
                                    <span className="font-semibold">{Math.round(totalUpvotes)}</span>
                                    <span className="text-muted-foreground">Upvotes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        Member since{" "}
                                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts Section */}
            <div className="container mx-auto px-4 py-12">
                {/* Tabs */}
                {isOwnProfile && (
                    <div className="flex items-center gap-8 border-b border-border mb-8">
                        <Link
                            href={`/profile/${id}`}
                            className={cn(
                                "flex items-center gap-2 pb-3 mb-[-1px] transition-colors",
                                currentTab === "published"
                                    ? "border-b-2 border-primary text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <FileText size={18} />
                            Published
                        </Link>
                        <Link
                            href={`/profile/${id}?tab=saved`}
                            className={cn(
                                "flex items-center gap-2 pb-3 mb-[-1px] transition-colors",
                                currentTab === "saved"
                                    ? "border-b-2 border-primary text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Bookmark size={18} />
                            Saved
                        </Link>
                    </div>
                )}

                {/* Section Title (only if not using tabs/viewing other profile) */}
                {!isOwnProfile && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">Published Posts</h2>
                    </div>
                )}

                {posts.length > 0 ? (
                    <PostFeed posts={posts} columns={3} variant="standard" />
                ) : (
                    <div className="text-center py-16 bg-muted/30 rounded-lg border border-border">
                        {currentTab === "saved" ? (
                            <>
                                <Bookmark size={48} className="mx-auto text-muted-foreground mb-3" />
                                <p className="text-muted-foreground text-lg mb-4">
                                    You haven&apos;t saved any posts yet
                                </p>
                                <Link
                                    href="/explore"
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
                                >
                                    Explore Articles
                                </Link>
                            </>
                        ) : (
                            <>
                                <FileText size={48} className="mx-auto text-muted-foreground mb-3" />
                                <p className="text-muted-foreground text-lg mb-4">
                                    {isOwnProfile
                                        ? "You haven't published any posts yet"
                                        : "This user hasn't published any posts yet"}
                                </p>
                                {isOwnProfile && (
                                    <Link
                                        href="/new"
                                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
                                    >
                                        Write Your First Post
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
