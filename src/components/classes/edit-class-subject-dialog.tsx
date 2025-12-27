"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { updateClassSubject } from "@/server/class-actions";
import { useRouter } from "next/navigation";

interface EditClassSubjectDialogProps {
    linkId: number;
    subjectName: string;
    currentFullMarks: number;
    currentGroup: string | null;
}

export function EditClassSubjectDialog({
    linkId,
    subjectName,
    currentFullMarks,
    currentGroup,
}: EditClassSubjectDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [fullMarks, setFullMarks] = useState(currentFullMarks?.toString() || "100");
    const [group, setGroup] = useState(currentGroup || "all");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateClassSubject(linkId, {
                fullMarks: parseInt(fullMarks),
                group: group,
            });
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to update subject:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Pencil className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Subject: {subjectName}</DialogTitle>
                    <DialogDescription>
                        Update the full marks and group for this subject.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullMarks">Full Marks</Label>
                            <Input
                                id="fullMarks"
                                type="number"
                                value={fullMarks}
                                onChange={(e) => setFullMarks(e.target.value)}
                                placeholder="100"
                                required
                                min="1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="group">Group</Label>
                            <Select value={group} onValueChange={setGroup}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Common (All Groups)</SelectItem>
                                    <SelectItem value="SCIENCE">Science</SelectItem>
                                    <SelectItem value="COMMERCE">Commerce</SelectItem>
                                    <SelectItem value="ARTS">Arts</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
