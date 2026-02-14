import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function getAllAuthors() {
    try {
        await dbConnect();

        // Find users who have published at least one post or have "author" role/status
        // For now, we'll fetch all users and filter/sort as needed
        // In a real app, you'd want pagination and more specific filtering
        const users = await User.find({})
            .select("name email image bio createdAt")
            .lean();

        // Map _id to string if needed, though .lean() usually keeps it as object
        return users.map((user: any) => ({
            ...user,
            id: user._id.toString(),
            _id: user._id.toString()
        }));
    } catch (error) {
        console.error("Error fetching authors:", error);
        return [];
    }
}

export async function getUserById(id: string) {
    try {
        await dbConnect();
        const user = await User.findById(id).lean();
        if (!user) return null;

        return {
            ...user,
            id: user._id.toString(),
            _id: user._id.toString()
        };
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}
