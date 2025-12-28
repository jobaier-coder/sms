import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddSubjectDialog } from "@/components/classes/add-subject-dialog";
import { StudentsTable } from "@/components/classes/students-table";
import { EditClassSubjectDialog } from "@/components/classes/edit-class-subject-dialog";
import { DeleteClassSubjectButton } from "@/components/classes/delete-class-subject-button";
import { getClassDetailsWithStudents } from "@/server/class-actions";
import { ChevronLeft, Users, BookOpen, GraduationCap, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ClassDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const classId = parseInt(id);
    
    const data = await getClassDetailsWithStudents(classId);

    if (!data) {
        notFound();
    }

    const { class: classData, subjects: allSubjects, students, stats, academicYears, selectedYearId } = data;

    // Organize subjects by group
    const commonSubjects = allSubjects.filter((s) => !s.group);
    const scienceSubjects = allSubjects.filter((s) => s.group === "SCIENCE");
    const commerceSubjects = allSubjects.filter((s) => s.group === "COMMERCE");
    const artsSubjects = allSubjects.filter((s) => s.group === "ARTS");

    const selectedYear = academicYears.find(y => y.id === selectedYearId);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link href="/classes">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold tracking-tight">{classData.name}</h2>
                    <p className="text-muted-foreground">
                        Academic Year: {selectedYear?.name || "N/A"}
                    </p>
                </div>
                <AddSubjectDialog classId={classId} />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.sections.length} section(s)
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{allSubjects.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {commonSubjects.length} common
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Groups</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.groups.length || 'None'}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.groups.join(", ") || "No groups"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fee Status</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.paidCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.pendingCount} pending
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="students" className="w-full">
                <TabsList>
                    <TabsTrigger value="students">
                        <Users className="h-4 w-4 mr-2" />
                        Students
                    </TabsTrigger>
                    <TabsTrigger value="subjects">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Subjects
                    </TabsTrigger>
                </TabsList>

                {/* Students Tab */}
                <TabsContent value="students" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Class Students</CardTitle>
                            <CardDescription>
                                Students enrolled in {classData.name} for academic year {selectedYear?.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StudentsTable
                                students={students}
                                sections={stats.sections}
                                groups={stats.groups}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Subjects Tab */}
                <TabsContent value="subjects" className="space-y-4 mt-4">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Common Subjects */}
                        <Card className="md:col-span-2 border-l-4 border-l-slate-500">
                            <CardHeader>
                                <CardTitle>Common Subjects</CardTitle>
                                <CardDescription>Taken by all students in this class.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {commonSubjects.length > 0 ? (
                                    <div className="space-y-2">
                                        {commonSubjects.map(sub => (
                                            <div key={sub.linkId} className="flex items-center justify-between p-3 border rounded-md bg-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-medium">{sub.name}</span>
                                                    <span className="text-xs text-muted-foreground">({sub.code})</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {sub.fullMarks || 100} marks
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-1">
                                                    <EditClassSubjectDialog
                                                        linkId={sub.linkId}
                                                        subjectName={sub.name}
                                                        currentFullMarks={sub.fullMarks || 100}
                                                        currentGroup={sub.group}
                                                    />
                                                    <DeleteClassSubjectButton
                                                        linkId={sub.linkId}
                                                        subjectName={sub.name}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No common subjects assigned.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Science Group */}
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader>
                                <CardTitle className="text-blue-700">Science Group</CardTitle>
                                <CardDescription>Specific to Science students.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {scienceSubjects.length > 0 ? (
                                    <div className="space-y-2">
                                        {scienceSubjects.map(sub => (
                                            <div key={sub.linkId} className="flex items-center justify-between p-2 border rounded-md border-blue-200 bg-blue-50">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-blue-700 text-sm">{sub.name}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {sub.fullMarks || 100} marks
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-1">
                                                    <EditClassSubjectDialog
                                                        linkId={sub.linkId}
                                                        subjectName={sub.name}
                                                        currentFullMarks={sub.fullMarks || 100}
                                                        currentGroup={sub.group}
                                                    />
                                                    <DeleteClassSubjectButton linkId={sub.linkId} subjectName={sub.name} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No science subjects.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Commerce Group */}
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader>
                                <CardTitle className="text-green-700">Commerce Group</CardTitle>
                                <CardDescription>Specific to Commerce students.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {commerceSubjects.length > 0 ? (
                                    <div className="space-y-2">
                                        {commerceSubjects.map(sub => (
                                            <div key={sub.linkId} className="flex items-center justify-between p-2 border rounded-md border-green-200 bg-green-50">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-green-700 text-sm">{sub.name}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {sub.fullMarks || 100} marks
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-1">
                                                    <EditClassSubjectDialog
                                                        linkId={sub.linkId}
                                                        subjectName={sub.name}
                                                        currentFullMarks={sub.fullMarks || 100}
                                                        currentGroup={sub.group}
                                                    />
                                                    <DeleteClassSubjectButton linkId={sub.linkId} subjectName={sub.name} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No commerce subjects.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Arts Group */}
                        <Card className="border-l-4 border-l-orange-500">
                            <CardHeader>
                                <CardTitle className="text-orange-700">Arts Group</CardTitle>
                                <CardDescription>Specific to Arts students.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {artsSubjects.length > 0 ? (
                                    <div className="space-y-2">
                                        {artsSubjects.map(sub => (
                                            <div key={sub.linkId} className="flex items-center justify-between p-2 border rounded-md border-orange-200 bg-orange-50">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-orange-700 text-sm">{sub.name}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {sub.fullMarks || 100} marks
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-1">
                                                    <EditClassSubjectDialog
                                                        linkId={sub.linkId}
                                                        subjectName={sub.name}
                                                        currentFullMarks={sub.fullMarks || 100}
                                                        currentGroup={sub.group}
                                                    />
                                                    <DeleteClassSubjectButton linkId={sub.linkId} subjectName={sub.name} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No arts subjects.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
