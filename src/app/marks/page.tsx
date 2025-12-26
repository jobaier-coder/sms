"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Loader2, CheckCircle } from "lucide-react";
import { getMarksSheetData, saveMarks } from "@/server/marks-actions";

export default function MarksEntryPage() {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [marks, setMarks] = useState<Record<number, string>>({});
    const [isSaved, setIsSaved] = useState(false);

    // Filters
    const [exam, setExam] = useState("midterm_2024");
    const [selectedClass, setSelectedClass] = useState("");
    const [section, setSection] = useState("");
    const [subject, setSubject] = useState("");

    const handleLoadSheet = async () => {
        if (!selectedClass || !section || !subject) return;

        setLoading(true);
        setIsSaved(false);
        // Simulate network delay
        await new Promise(r => setTimeout(r, 500));

        const data = await getMarksSheetData(selectedClass, section, subject);
        setStudents(data);

        // Initialize marks state
        const initialMarks: Record<number, string> = {};
        data.forEach(s => {
            if (s.currentMarks !== null) {
                initialMarks[s.studentId] = s.currentMarks.toString();
            }
        });
        setMarks(initialMarks);

        setLoading(false);
    };

    const handleMarkChange = (studentId: number, value: string) => {
        setMarks(prev => ({ ...prev, [studentId]: value }));
        setIsSaved(false);
    };

    const handleSave = async () => {
        setLoading(true);
        // Prepare data
        const marksToSave = Object.entries(marks).map(([sid, val]) => ({
            studentId: parseInt(sid),
            marks: parseInt(val) || 0,
        }));

        await saveMarks(exam, subject, marksToSave);
        await new Promise(r => setTimeout(r, 800)); // Fake saving time

        setLoading(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Marks Entry</h2>
                <p className="text-muted-foreground">
                    Enter marks for exams by class and subject.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Selection Filters</CardTitle>
                    <CardDescription>Select the exam details to load the student list.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-4 items-end">
                    <div className="space-y-2">
                        <Label>Exam</Label>
                        <Select value={exam} onValueChange={setExam}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Exam" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="midterm_2024">Midterm Exam 2024</SelectItem>
                                <SelectItem value="final_2024">Final Exam 2024</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Class</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="9">Class 9</SelectItem>
                                <SelectItem value="10">Class 10</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Section</Label>
                        <Select value={section} onValueChange={setSection}>
                            <SelectTrigger>
                                <SelectValue placeholder="Section" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A">Section A</SelectItem>
                                <SelectItem value="B">Section B</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select value={subject} onValueChange={setSubject}>
                            <SelectTrigger>
                                <SelectValue placeholder="Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="math">Mathematics</SelectItem>
                                <SelectItem value="eng">English</SelectItem>
                                <SelectItem value="phy">Physics</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <div className="px-6 pb-6">
                    <Button
                        onClick={handleLoadSheet}
                        disabled={!selectedClass || !section || !subject || loading}
                        className="w-full md:w-auto"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Load Marksheet
                    </Button>
                </div>
            </Card>

            {students.length > 0 && (
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-slate-50 border-b">
                        <div>
                            <CardTitle>Marksheet</CardTitle>
                            <CardDescription>
                                Entering marks for <strong>Class {selectedClass} - {section}</strong> ({subject})
                            </CardDescription>
                        </div>
                        <Button onClick={handleSave} disabled={loading} className={isSaved ? "bg-green-600 hover:bg-green-700" : ""}>
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : isSaved ? (
                                <CheckCircle className="mr-2 h-4 w-4" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            {isSaved ? "Saved!" : "Save All Changes"}
                        </Button>
                    </CardHeader>
                    <div className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Roll No</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="w-[200px]">Marks Obtained</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student.studentId}>
                                        <TableCell className="font-medium">{student.roll}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                className="w-32"
                                                value={marks[student.studentId] || ""}
                                                onChange={(e) => handleMarkChange(student.studentId, e.target.value)}
                                                placeholder="0-100"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}
        </div>
    );
}
