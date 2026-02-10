import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Publication from "@/models/Publication";
import Post from "@/models/Post";
import { PostFeed } from "@/components/PostFeed";
import { Globe, Twitter, Linkedin, Users, FileText, Eye } from "lucide-react";
import FollowButton from "@/components/FollowButton";
import { auth } from "@/auth";
import PublicationMember from "@/models/PublicationMember";

async function getPublication(slug: string) {
    await dbConnect();

    const publication = await Publication.findOne({ slug }).populate("owner", "name image").lean();
    if (!publication) return null;

    // Fetch posts for this publication
    const posts = await Post.find({
        publication: publication._id,
        published: true
    })
        .sort({ publishedAt: -1 })
        .populate("author", "name image")
        .lean();

    // Fetch editors/writers
    const members = await PublicationMember.find({
        publication: publication._id,
        status: "active",
        role: { $ne: "owner" } // Owner is already in publication.owner
    })
        .populate("user", "name image")
        .limit(5)
        .lean();

    return {
        publication: JSON.parse(JSON.stringify(publication)),
        posts: JSON.parse(JSON.stringify(posts)),
        members: JSON.parse(JSON.stringify(members))
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await dbConnect();
    const publication = await Publication.findOne({ slug }).select("name description").lean();

    if (!publication) return { title: "Publication Not Found" };

    return {
        title: `${publication.name} | Inkraft Publication`,
        description: publication.description || `Read stories from ${publication.name} on Inkraft.`,
    };
}

export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const session = await auth();
    const data = await getPublication(slug);

    if (!data) {
        notFound();
    }

    const { publication, posts, members } = data;

    // Check if current user is following (mock logic for now as FollowButton works on Users)
    // We need to implement generic Follow system or Publication Follow
    // For now, we'll hide follow button or reuse if adapted. 
    // Let's assume FollowButton is userid based for now.

    return (
        <div className="min-h-screen">
            {/* Hero / Branding Section */}
            <div className="bg-muted/30 border-b border-border">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                        {/* Logo */}
                        <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-xl overflow-hidden bg-background border-4 border-background shadow-xl">
                            {publication.logo ? (
                                <Image
                                    src={publication.logo}
                                    alt={publication.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-5xl font-bold">
                                    {publication.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 max-w-3xl">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                                {publication.name}
                            </h1>
                            {publication.description && (
                                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                                    {publication.description}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <FileText size={18} />
                                    <span className="font-semibold text-foreground">{publication.stats?.totalPosts || posts.length}</span> Posts
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={18} />
                                    <span className="font-semibold text-foreground">{publication.stats?.totalFollowers || 0}</span> Followers
                                </div>
                                {publication.socialLinks?.website && (
                                    <a href={publication.socialLinks.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                                        <Globe size={18} /> Website
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 min-w-[140px]">
                            {/* Placeholder for specific Publication Follow Button */}
                            <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors">
                                Follow
                            </button>
                            {session?.user?.id === publication.owner._id && (
                                <Link
                                    href={`/dashboard/publications/${publication._id}`}
                                    className="px-6 py-2.5 border border-border rounded-full font-semibold hover:bg-muted transition-colors text-center"
                                >
                                    Manage
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Main Content: Stories */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <FileText className="text-primary" />
                                Latest Stories
                            </h2>
                        </div>

                        {posts.length > 0 ? (
                            <PostFeed posts={posts} layout="list" />
                        ) : (
                            <div className="text-center py-20 border rounded-xl bg-muted/10">
                                <FileText size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-xl font-semibold mb-2">No stories yet</h3>
                                <p className="text-muted-foreground">
                                    This publication hasn't published any stories yet.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Editors & Info */}
                    <div className="space-y-8">
                        {/* Owner/Editors */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Users size={18} />
                                Team
                            </h3>
                            <div className="space-y-4">
                                {/* Owner */}
                                <div className="flex items-center gap-3">
                                    <Link href={`/profile/${publication.owner._id}`} className="shrink-0">
                                        {publication.owner.image ? (
                                            <Image
                                                src={publication.owner.image}
                                                alt={publication.owner.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                                {publication.owner.name.charAt(0)}
                                            </div>
                                        )}
                                    </Link>
                                    <div>
                                        <Link href={`/profile/${publication.owner._id}`} className="font-medium hover:text-primary block leading-tight">
                                            {publication.owner.name}
                                        </Link>
                                        <span className="text-xs text-muted-foreground">Owner</span>
                                    </div>
                                </div>

                                {/* Other Members */}
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {members.map((member: any) => (
                                    <div key={member._id} className="flex items-center gap-3">
                                        <Link href={`/profile/${member.user._id}`} className="shrink-0">
                                            {member.user.image ? (
                                                <Image
                                                    src={member.user.image}
                                                    alt={member.user.name}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-bold">
                                                    {member.user.name.charAt(0)}
                                                </div>
                                            )}
                                        </Link>
                                        <div>
                                            <Link href={`/profile/${member.user._id}`} className="text-sm font-medium hover:text-primary block leading-tight">
                                                {member.user.name}
                                            </Link>
                                            <span className="text-xs text-muted-foreground capitalize">{member.role}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* About Card */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="font-semibold mb-2">About</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {publication.description || `Read more from ${publication.name}.`}
                            </p>
                            <div className="text-xs text-muted-foreground">
                                Created {new Date(publication.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
