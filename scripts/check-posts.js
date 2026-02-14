const mongoose = require('mongoose');

// Load env vars
require('dotenv').config({ path: '.env.local' });

async function checkPosts() {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const postsCollection = mongoose.connection.collection('posts');
        const posts = await postsCollection.find({}).toArray();

        console.log(`Found ${posts.length} posts.`);

        if (posts.length > 0) {
            console.log("Sample Post Fields:", Object.keys(posts[0]));
            console.log("First Post Local/Published:", {
                title: posts[0].title,
                locale: posts[0].locale,
                published: posts[0].published,
                publishedAt: posts[0].publishedAt
            });

            const publishedCount = posts.filter((p) => p.published).length;
            const withLocaleCount = posts.filter((p) => p.locale).length;
            const enLocaleCount = posts.filter((p) => p.locale === 'en').length;

            console.log(`Published: ${publishedCount}`);
            console.log(`With Locale: ${withLocaleCount}`);
            console.log(`Locale 'en': ${enLocaleCount}`);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

checkPosts();
