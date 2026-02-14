"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Flag, Loader2 } from "lucide-react";

interface ReportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    targetType: "Post" | "Comment";
    targetId: string;
}

const REPORT_REASONS = [
    { value: "", label: "Select a reason" },
    { value: "spam", label: "Spam" },
    { value: "harassment", label: "Harassment or Hate Speech" },
    { value: "violence", label: "Violence or Threats" },
    { value: "misinformation", label: "Misinformation" },
    { value: "other", label: "Other" },
];

export function ReportDialog({ open, onOpenChange, targetType, targetId }: ReportDialogProps) {
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reason) {
            toast.error("Please select a reason");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetType,
                    targetId,
                    reason,
                    details,
                }),
            });

            if (!res.ok) throw new Error("Failed to submit report");

            toast.success("Report submitted. Thank you for making our community safer.");
            onOpenChange(false);
            setReason("");
            setDetails("");
        } catch (error) {
            toast.error("Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Flag className="h-5 w-5 text-red-500" />
                        Report {targetType}
                    </DialogTitle>
                    <DialogDescription>
                        Please provide details about why you are reporting this content.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="reason" className="text-sm font-medium">
                            Reason
                        </label>
                        <select
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {REPORT_REASONS.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="details" className="text-sm font-medium">
                            Additional Details (Optional)
                        </label>
                        <textarea
                            id="details"
                            placeholder="Please provide specific details to help us investigate..."
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !reason} className="bg-red-600 hover:bg-red-700 text-white">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Report"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
