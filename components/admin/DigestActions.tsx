"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DigestActionsProps {
    digest: {
        _id: string;
        slug: string;
    };
}

export function DigestActions({ digest }: DigestActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this digest? This action cannot be undone.")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/digest/${digest._id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Digest deleted");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete digest");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Link href={`/digest/${digest.slug}`} target="_blank">
                <Button variant="ghost" size="icon" title="View Public Page">
                    <Eye className="h-4 w-4" />
                </Button>
            </Link>

            <Link href={`/admin/digest/${digest._id}/edit`}>
                <Button variant="ghost" size="icon" title="Edit Digest">
                    <Edit className="h-4 w-4" />
                </Button>
            </Link>

            <Button
                variant="ghost"
                size="icon"
                title="Delete Digest"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-muted-foreground hover:text-destructive"
            >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
        </div>
    );
}
