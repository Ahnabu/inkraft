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
    Settings
} from "lucide-react";

async function getUserProfile(userId: string) {
    await dbConnect();

    const user = await User.findById(userId).lean();
    if (!user) return null;

    const posts = await Post.find({ author: userId, published: true })
        .sort({ publishedAt: -1 })
        .populate("author", "name image")
        .lean();

    // Calculate total upvotes across all posts
    const totalUpvotes = posts.reduce((sum, post) => sum + (post.upvotes || 0), 0);

    return {
        user: JSON.parse(JSON.stringify(user)),
        posts: JSON.parse(JSON.stringify(posts)),
        totalUpvotes,
    };
}

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await auth();
    const profileData = await getUserProfile(id);

    if (!profileData) {
        notFound();
    }

    const { user, posts, totalUpvotes } = profileData;
    const isOwnProfile = session?.user?.id === id;

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
                                    <span className="font-semibold">{posts.length}</span>
                                    <span className="text-muted-foreground">
                                        {posts.length === 1 ? "Post" : "Posts"}
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
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Published Posts</h2>
                </div>

                {posts.length > 0 ? (
                    <PostFeed posts={posts} columns={3} variant="standard" />
                ) : (
                    <div className="text-center py-16 bg-muted/30 rounded-lg border border-border">
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
                    </div>
                )}
            </div>
        </div>
    );
}
