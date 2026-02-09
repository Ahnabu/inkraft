import { redirect } from "next/navigation";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import AdminDashboardClient from "./AdminClient";

export default async function AdminDashboardPage() {
    const session = await auth();


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
        <AdminDashboardClient
            initialStats={{
                userCount,
                postCount,
                pendingComments,
            }}
        />
    );
}
