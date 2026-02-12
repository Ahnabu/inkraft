export default function BanglaDemo() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">Bangla Typography Support Demo</h1>

            <div className="space-y-8 max-w-3xl">
                {/* English Text */}
                <section className="p-6 bg-card rounded-lg border">
                    <h2 className="text-2xl font-semibold mb-4">English Typography</h2>
                    <p className="text-lg leading-relaxed">
                        This is a demonstration of English text using DM Sans font family.
                        The quick brown fox jumps over the lazy dog. This sentence contains
                        all letters of the English alphabet.
                    </p>
                </section>

                {/* Bangla Text */}
                <section className="p-6 bg-card rounded-lg border">
                    <h2 className="text-2xl font-semibold mb-4">বাংলা টাইপোগ্রাফি (Bangla Typography)</h2>
                    <p className="text-lg leading-relaxed">
                        এটি Noto Sans Bengali ফন্ট ব্যবহার করে বাংলা টেক্সটের একটি নমুনা।
                        আমাদের প্ল্যাটফর্ম এখন বাংলা ভাষায় সম্পূর্ণ টাইপোগ্রাফি সমর্থন করে।
                        এটি নিশ্চিত করে যে বাংলা পাঠ্য সুন্দরভাবে প্রদর্শিত হয় এবং পড়তে সহজ।
                    </p>
                </section>

                {/* Mixed Content */}
                <section className="p-6 bg-card rounded-lg border">
                    <h2 className="text-2xl font-semibold mb-4">Mixed Content (মিশ্র বিষয়বস্তু)</h2>
                    <p className="text-lg leading-relaxed">
                        You can seamlessly mix English and বাংলা text in the same paragraph.
                        Our font stack ensures যেকোনো ভাষা properly displayed হবে with
                        optimal readability and beautiful typography.
                    </p>
                </section>

                {/* Code Snippet */}
                <section className="p-6 bg-card rounded-lg border">
                    <h2 className="text-2xl font-semibold mb-4">Technical Details</h2>
                    <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                        {`Font Stack:
- Primary: DM Sans (Latin)
- Bangla: Noto Sans Bengali
- Fallback: sans-serif

CSS Variable:
--font-bangla: var(--font-bangla)

Body Font:
font-family: var(--font-body), var(--font-bangla), sans-serif;`}
                    </pre>
                </section>
            </div>
        </div>
    );
}
