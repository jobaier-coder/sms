import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStudents } from "@/server/student-actions";
import { getClasses } from "@/server/class-actions";
import { StudentClassFilter } from "@/components/students/class-filter";

interface PageProps {
    searchParams: {
        classId?: string;
    };
}

export default async function StudentListPage({ searchParams }: PageProps) {
    const classId = searchParams.classId ? parseInt(searchParams.classId) : undefined;
    const students = await getStudents(classId);
    const classes = await getClasses();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Students</h2>
                    <p className="text-muted-foreground">
                        Manage student enrollments and profiles.
                    </p>
                </div>
                <Link href="/students/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm md:flex-row md:items-end">
                <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium leading-none">Search</label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by name or roll..."
                            className="pl-8"
                        />
                    </div>
                </div>

                {/* Dynamic Class Filter */}
                <StudentClassFilter classes={classes} />

                <div className="w-full space-y-2 md:w-32">
                    <label className="text-sm font-medium leading-none">Section</label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="outline" className="shrink-0">
                    <Filter className="mr-2 h-4 w-4" /> More Filters
                </Button>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>Roll</TableHead>
                            <TableHead>Group</TableHead>
                            <TableHead>Parent Phone</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.id}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.className}</TableCell>
                                    <TableCell>{student.section}</TableCell>
                                    <TableCell>{student.roll}</TableCell>
                                    <TableCell>
                                        {student.group ? (
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                {student.group}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{student.guardianPhone}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/students/${student.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" /> View Profile
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
