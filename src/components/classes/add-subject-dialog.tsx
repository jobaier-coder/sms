"use client";

import { useState, useEffect } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { assignSubjectToClass, createSubject, getSubjects } from "@/server/class-actions";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddSubjectDialog({ classId }: { classId: number }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState<any[]>([]);
    const router = useRouter();

    // Form States
    const [activeTab, setActiveTab] = useState("existing");
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [newSubjectName, setNewSubjectName] = useState("");
    const [newSubjectCode, setNewSubjectCode] = useState("");
    const [group, setGroup] = useState("all");

    useEffect(() => {
        if (open) {
            loadSubjects();
        }
    }, [open]);

    const loadSubjects = async () => {
        const res = await getSubjects();
        setSubjects(res);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let subjectIdToAssign = selectedSubjectId ? parseInt(selectedSubjectId) : 0;

            if (activeTab === "new") {
                const newSub = await createSubject(newSubjectName, newSubjectCode);
                subjectIdToAssign = newSub.id;
            }

            const res = await assignSubjectToClass(classId, subjectIdToAssign, group);
            if (res?.error) {
                alert(res.error); // Simple feedback for errors
            } else {
                setOpen(false);
                // Reset form
                setSelectedSubjectId("");
                setNewSubjectName("");
                setNewSubjectCode("");
                setGroup("all");
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Subject
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Subject to Class</DialogTitle>
                        <DialogDescription>
                            Assign a subject to this class. You can choose a group (Science, Commerce) if applicable.
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="existing" value={activeTab} onValueChange={setActiveTab} className="mt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="existing">Select Existing</TabsTrigger>
                            <TabsTrigger value="new">Create New</TabsTrigger>
                        </TabsList>

                        <div className="py-4 space-y-4">
                            <TabsContent value="existing" className="space-y-4 mt-0">
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId} required={activeTab === "existing"}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a subject..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map((sub) => (
                                                <SelectItem key={sub.id} value={sub.id.toString()}>
                                                    {sub.name} ({sub.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>

                            <TabsContent value="new" className="space-y-4 mt-0">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="subName">Subject Name</Label>
                                        <Input
                                            id="subName"
                                            value={newSubjectName}
                                            onChange={e => setNewSubjectName(e.target.value)}
                                            placeholder="e.g. Biology"
                                            required={activeTab === "new"}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subCode">Code</Label>
                                        <Input
                                            id="subCode"
                                            value={newSubjectCode}
                                            onChange={e => setNewSubjectCode(e.target.value)}
                                            placeholder="BIO101"
                                            required={activeTab === "new"}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Common Group Selection */}
                            <div className="space-y-2">
                                <Label>Group Assignment</Label>
                                <Select value={group} onValueChange={setGroup}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Common (All Students)</SelectItem>
                                        <SelectItem value="SCIENCE">Science Group Only</SelectItem>
                                        <SelectItem value="COMMERCE">Commerce Group Only</SelectItem>
                                        <SelectItem value="ARTS">Arts Group Only</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[0.8rem] text-muted-foreground">
                                    "Common" means all students in this class take this subject.
                                </p>
                            </div>
                        </div>
                    </Tabs>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {activeTab === "new" ? "Create & Assign" : "Assign Subject"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
