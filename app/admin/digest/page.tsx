import Link from "next/link";
import { format } from "date-fns";
import { Plus, Edit, Eye, Trash2, FileText, CheckCircle, XCircle } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Digest from "@/models/Digest";
import { Button } from "@/components/ui/Button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getDigests() {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
        redirect("/");
    }

    await dbConnect();
    const digests = await Digest.find({})
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(digests));
}

export default async function AdminDigestPage() {
    const digests = await getDigests();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Weekly Digests</h1>
                    <p className="text-muted-foreground">Manage and curate weekly content digests.</p>
                </div>
                <Link href="/admin/digest/new">
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Create Digest
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Items</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Published Date</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {digests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        No digests found. Create your first one!
                                    </td>
                                </tr>
                            ) : (
                                digests.map((digest: any) => (
                                    <tr key={digest._id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">{digest.title}</td>
                                        <td className="p-4 align-middle">
                                            {digest.published ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                    <CheckCircle className="h-3 w-3" /> Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                                    <FileText className="h-3 w-3" /> Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {digest.posts.length} posts
                                            {digest.editorPicks.length > 0 && (
                                                <span className="ml-1 text-muted-foreground">
                                                    ({digest.editorPicks.length} picks)
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {digest.publishedAt ? format(new Date(digest.publishedAt), "PP") : "-"}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/digest/${digest.slug}`} target="_blank">
                                                    <Button variant="ghost" size="icon" title="View">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {/* Edit Link - To be implemented */}
                                                {/* <Link href={`/admin/digest/${digest._id}/edit`}> */}
                                                <Button variant="ghost" size="icon" title="Edit" disabled>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                {/* </Link> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
