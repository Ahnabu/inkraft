import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Newspaper, Plus, Users, FileText, Settings, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import dbConnect from "@/lib/mongodb";
import PublicationMember from "@/models/PublicationMember";
import Image from "next/image";

async function getUserPublications(userId: string) {
    await dbConnect();

    // Find memberships and populate publication details
    const memberships = await PublicationMember.find({
        user: userId,
        status: "active"
    })
        .populate({
            path: "publication",
            select: "name slug description logo coverImage stats role branding"
        })
        .sort({ joinedAt: -1 })
        .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return memberships.map((m: any) => ({
        ...m.publication,
        role: m.role // Attach role from membership to publication object for easy access
    }));
}

export default async function PublicationsDashboard() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    const publications = await getUserPublications(session.user.id);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Publications</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your multi-author blogs and newsletters
                    </p>
                </div>
                <Link
                    href="/publications/create"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    New Publication
                </Link>
            </div>

            {publications.length === 0 ? (
                <GlassCard className="p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Newspaper size={32} className="text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No publications yet</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Create a publication to start a team blog, newsletter, or themed collection of stories.
                    </p>
                    <Link
                        href="/publications/create"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Get Started
                    </Link>
                </GlassCard>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {publications.map((pub: any) => (
                        <GlassCard key={pub._id} className="overflow-hidden flex flex-col h-full group">
                            {/* Cover Image or Gradient */}
                            <div className="h-32 bg-muted relative">
                                {pub.coverImage ? (
                                    <Image
                                        src={pub.coverImage}
                                        alt={pub.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-linear-to-r from-primary/20 to-secondary/20" />
                                )}

                                {/* Logo Overlay */}
                                <div className="absolute -bottom-6 left-6 w-12 h-12 rounded-lg border-4 border-background bg-card shadow-xs flex items-center justify-center overflow-hidden">
                                    {pub.logo ? (
                                        <Image src={pub.logo} alt={pub.name} width={48} height={48} className="object-cover" />
                                    ) : (
                                        <span className="text-lg font-bold text-primary">{pub.name.charAt(0)}</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 pt-8 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                        <Link href={`/publication/${pub.slug}`}>{pub.name}</Link>
                                    </h3>
                                    <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full capitalize">
                                        {pub.role}
                                    </span>
                                </div>

                                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                                    {pub.description || "No description provided."}
                                </p>

                                <div className="grid grid-cols-3 gap-2 py-4 border-y border-border mb-4">
                                    <div className="text-center">
                                        <div className="text-lg font-bold">{pub.stats?.totalPosts || 0}</div>
                                        <div className="text-xs text-muted-foreground">Posts</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold">{pub.stats?.totalViews || 0}</div>
                                        <div className="text-xs text-muted-foreground">Views</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold">{pub.stats?.totalFollowers || 0}</div>
                                        <div className="text-xs text-muted-foreground">Followers</div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <Link
                                        href={`/dashboard/publications/${pub._id}`}
                                        className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-md text-sm font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <Settings size={14} />
                                        Manage
                                    </Link>
                                    <Link
                                        href={`/publication/${pub.slug}`}
                                        target="_blank"
                                        className="px-3 py-2 bg-muted text-muted-foreground rounded-md hover:text-foreground transition-colors"
                                        title="View Public Page"
                                    >
                                        <ExternalLink size={18} />
                                    </Link>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}
