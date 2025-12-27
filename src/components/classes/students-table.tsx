"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, Search } from "lucide-react";

interface Student {
    enrollmentId: number;
    studentId: number;
    studentName: string;
    section: string;
    group: string | null;
    roll: number | null;
    phone: string;
    feeStatus: string;
}

interface StudentsTableProps {
    students: Student[];
    sections: string[];
    groups: string[];
}

export function StudentsTable({ students, sections, groups }: StudentsTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sectionFilter, setSectionFilter] = useState<string>("all");
    const [groupFilter, setGroupFilter] = useState<string>("all");

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            // Search filter
            const matchesSearch = student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.studentId.toString().includes(searchQuery);

            // Section filter
            const matchesSection = sectionFilter === "all" || student.section === sectionFilter;

            // Group filter
            const matchesGroup = groupFilter === "all" ||
                (groupFilter === "none" && !student.group) ||
                student.group === groupFilter;

            return matchesSearch && matchesSection && matchesGroup;
        });
    }, [students, searchQuery, sectionFilter, groupFilter]);

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={sectionFilter} onValueChange={setSectionFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                        <SelectValue placeholder="All Sections" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        {sections.map(section => (
                            <SelectItem key={section} value={section}>
                                Section {section}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={groupFilter} onValueChange={setGroupFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                        <SelectValue placeholder="All Groups" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Groups</SelectItem>
                        <SelectItem value="none">No Group</SelectItem>
                        {groups.map(group => (
                            <SelectItem key={group} value={group}>
                                {group}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
                Showing {filteredStudents.length} of {students.length} students
            </div>

            {/* Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Roll</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>Group</TableHead>
                            <TableHead>Guardian Phone</TableHead>
                            <TableHead>Fee Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    No students found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => (
                                <TableRow key={student.enrollmentId}>
                                    <TableCell className="font-semibold">
                                        {student.roll || "-"}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {student.studentId}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {student.studentName}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{student.section}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {student.group ? (
                                            <Badge variant="secondary">{student.group}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {student.phone}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={student.feeStatus === "PAID" ? "default" : "destructive"}
                                        >
                                            {student.feeStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/students/${student.studentId}`}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
