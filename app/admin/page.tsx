import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Shield, Users, FileText, AlertTriangle } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";

export default async function AdminDashboardPage() {
    const session = await auth();

    // @ts-expect-error - role property not in default session type
    if (!session?.user || session.user.role !== "admin") {
        redirect("/");
    }

    await dbConnect();

    const [userCount, postCount, pendingComments] = await Promise.all([
        User.countDocuments(),
        Post.countDocuments(),
        Comment.countDocuments({ moderationStatus: "pending" })
    ]);

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Users Card */}
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-muted-foreground">Total Users</h3>
                            <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold">{userCount}</p>
                        <p className="text-sm text-muted-foreground mt-1">Registered users</p>
                    </div>

                    {/* Posts Card */}
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-muted-foreground">Total Content</h3>
                            <FileText className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold">{postCount}</p>
                        <p className="text-sm text-muted-foreground mt-1">Posts published</p>
                    </div>

                    {/* Reports/Pending Card */}
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-muted-foreground">Pending Comments</h3>
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                        </div>
                        <p className="text-3xl font-bold">{pendingComments}</p>
                        <p className="text-sm text-muted-foreground mt-1">Requiring moderation</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm p-8 text-center">
                    <p className="text-muted-foreground">More admin features (User Management, Content Moderation) coming soon.</p>
                </div>
            </div>
        </div>
    );
}
