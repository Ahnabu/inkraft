"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Category {
    slug: string;
    name: string;
    description: string;
    color: string;
    isDefault?: boolean;
    _id?: string;
}

export function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [image, setImage] = useState(""); // Unused for now, but good to have

    // New category state
    const [newCategory, setNewCategory] = useState({
        name: "",
        description: "",
        color: "#4F46E5"
    });
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        if (!newCategory.name || !newCategory.description) {
            toast.error("Name and description are required");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCategory)
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(JSON.parse(error).error || "Failed to create category");
            }

            toast.success("Category created successfully");
            setIsAdding(false);
            setNewCategory({ name: "", description: "", color: "#4F46E5" });
            fetchCategories(); // Refresh list
            router.refresh(); // Refresh server components if any
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4 text-center"><Loader2 className="animate-spin inline" /></div>;

    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden mt-8">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Categories</h2>
                    <p className="text-sm text-muted-foreground">Manage blog categories</p>
                </div>
                {!isAdding ? (
                    <Button onClick={() => setIsAdding(true)} size="sm" className="gap-2">
                        <Plus size={16} /> Add Category
                    </Button>
                ) : (
                    <Button onClick={() => setIsAdding(false)} variant="ghost" size="sm" className="gap-2">
                        <X size={16} /> Cancel
                    </Button>
                )}
            </div>

            {isAdding && (
                <div className="p-6 border-b border-border bg-muted/20 animate-in slide-in-from-top-4">
                    <div className="grid gap-4 max-w-xl">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Name</label>
                            <input
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                placeholder="e.g. Travel"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Description</label>
                            <textarea
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                placeholder="SEO description for this category..."
                                rows={2}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Color Hex</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={newCategory.color}
                                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                                    className="h-10 w-10 p-1 rounded border border-input bg-background cursor-pointer"
                                />
                                <input
                                    value={newCategory.color}
                                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                                    className="flex-1 px-3 py-2 rounded-md border border-input bg-background uppercase"
                                    placeholder="#000000"
                                />
                            </div>
                        </div>
                        <Button onClick={handleAddCategory} disabled={saving} className="w-fit">
                            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Category
                        </Button>
                    </div>
                </div>
            )}

            <div className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                        <tr>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Slug</th>
                            <th className="px-6 py-3 text-left">Type</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {categories.map((cat) => (
                            <tr key={cat.slug} className="hover:bg-muted/10 transition-colors">
                                <td className="px-6 py-4 font-medium flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                    {cat.name}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{cat.slug}</td>
                                <td className="px-6 py-4">
                                    {cat.isDefault ? (
                                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs">System</span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs">Custom</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
