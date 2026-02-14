const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function createBanglaPost() {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const Post = mongoose.model('Post', new mongoose.Schema({
            title: String,
            slug: String,
            subtitle: String,
            content: String,
            excerpt: String,
            coverImage: String,
            author: mongoose.Schema.Types.ObjectId,
            category: String,
            published: Boolean,
            publishedAt: Date,
            locale: String,
            readingTime: Number,
            tags: [String]
        }));

        const User = mongoose.model('User', new mongoose.Schema({ name: String, email: String }));

        // Find a user to assign as author
        const author = await User.findOne({});
        if (!author) {
            console.error("No user found to assign as author");
            return;
        }

        const banglaPost = {
            title: "এআই এবং আমাদের ভবিষ্যৎ",
            slug: "ai-and-our-future-bn",
            subtitle: "কিভাবে কৃত্রিম বুদ্ধিমত্তা আমাদের জীবন পরিবর্তন করছে",
            content: "<h2>ভূমিকা</h2><p>কৃত্রিম বুদ্ধিমত্তা বা এআই বর্তমানে প্রযুক্তির জগতের সবচেয়ে আলোচিত বিষয়...</p>",
            excerpt: "কৃত্রিম বুদ্ধিমত্তা বা এআই বর্তমানে প্রযুক্তির জগতের সবচেয়ে আলোচিত বিষয়। এটি আমাদের জীবনযাত্রায় আমূল পরিবর্তন নিয়ে আসছে।",
            coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
            author: author._id,
            category: "technology",
            published: true,
            publishedAt: new Date(),
            locale: "bn",
            readingTime: 5,
            tags: ["AI", "Technology", "Future"]
        };

        // Check if exists
        const exists = await Post.findOne({ slug: banglaPost.slug });
        if (exists) {
            console.log("Bangla post already exists.");
        } else {
            await Post.create(banglaPost);
            console.log("Created sample Bangla post.");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

createBanglaPost();
