"use client";

import { useState } from "react";
import { MoreHorizontal, Flag } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { ReportDialog } from "./ReportDialog";

interface PostMoreMenuProps {
    postId: string;
    contentType: "Post" | "Comment";
}

export function PostMoreMenu({ postId, contentType }: PostMoreMenuProps) {
    const [reportOpen, setReportOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => setReportOpen(true)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                        <Flag className="mr-2 h-4 w-4" />
                        Report
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ReportDialog
                open={reportOpen}
                onOpenChange={setReportOpen}
                targetType={contentType}
                targetId={postId}
            />
        </>
    );
}
