import { Metadata } from "next";
import dbConnect from "@/lib/mongodb";
import Digest from "@/models/Digest";
import { DigestCard } from "@/components/DigestCard";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
    title: "Weekly Digests - Inkraft",
    description: "Curated weekly highlights, top stories, and editorial picks from Inkraft.",
};

export const dynamic = 'force-dynamic';

async function getDigests() {
    await dbConnect();
    const digests = await Digest.find({ published: true })
        .populate("editorPicks", "title slug coverImage")
        .sort({ publishedAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(digests));
}

export default async function DigestPage() {
    const digests = await getDigests();

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-16">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Weekly Digests</h1>
                        <p className="text-xl text-muted-foreground">
                            Hand-picked stories and highlights from our editors.
                        </p>
                    </header>

                    {digests.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {digests.map((digest: any) => (
                                <DigestCard key={digest._id} digest={digest} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
                            <p className="text-muted-foreground">No digests published yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
