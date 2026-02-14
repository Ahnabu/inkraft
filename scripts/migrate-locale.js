const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function migrateLocale() {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for migration");

        const postsCollection = mongoose.connection.collection('posts');

        // Update all posts with no locale to have 'en'
        const result = await postsCollection.updateMany(
            { $or: [{ locale: { $exists: false } }, { locale: null }] },
            { $set: { locale: 'en' } }
        );

        console.log(`Matched ${result.matchedCount} documents`);
        console.log(`Modified ${result.modifiedCount} documents`);

    } catch (error) {
        console.error("Migration Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

migrateLocale();
