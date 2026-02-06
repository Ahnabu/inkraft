import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Shield, Users, FileText, AlertTriangle } from "lucide-react";

export default async function AdminDashboardPage() {
    const session = await auth();

    // @ts-ignore
    if (!session?.user || session.user.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-muted-foreground">Total Users</h3>
                            <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground mt-1">Registered users</p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-muted-foreground">Total Content</h3>
                            <FileText className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground mt-1">Posts published</p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-muted-foreground">Reports</h3>
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                        </div>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground mt-1">Pending review</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm p-8 text-center">
                    <p className="text-muted-foreground">Admin features are currently under development.</p>
                </div>
            </div>
        </div>
    );
}
