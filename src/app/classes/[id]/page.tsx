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
import { AddSubjectDialog } from "@/components/classes/add-subject-dialog";
import { getClassDetails } from "@/server/class-actions";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function ClassDetailsPage({ params }: PageProps) {
    const classId = parseInt(params.id);
    const data = await getClassDetails(classId);

    if (!data) {
        notFound();
    }

    // Organize subjects by group
    const commonSubjects = data.subjects.filter((s) => !s.group);
    const scienceSubjects = data.subjects.filter((s) => s.group === "SCIENCE");
    const commerceSubjects = data.subjects.filter((s) => s.group === "COMMERCE");
    const artsSubjects = data.subjects.filter((s) => s.group === "ARTS");

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/classes">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold tracking-tight">{data.name}</h2>
                    <p className="text-muted-foreground">
                        Manage subjects structure for this class.
                    </p>
                </div>
                <AddSubjectDialog classId={classId} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Common Subjects */}
                <Card className="md:col-span-2 border-l-4 border-l-slate-500">
                    <CardHeader>
                        <CardTitle>Common Subjects</CardTitle>
                        <CardDescription>Taken by all students in this class.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {commonSubjects.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {commonSubjects.map(sub => (
                                    <Badge key={sub.linkId} variant="secondary" className="px-3 py-1 text-sm">
                                        {sub.name} <span className="ml-1 opacity-50 text-xs">({sub.code})</span>
                                    </Badge>
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
                            <div className="flex flex-wrap gap-2">
                                {scienceSubjects.map(sub => (
                                    <Badge key={sub.linkId} variant="outline" className="px-3 py-1 text-sm border-blue-200 bg-blue-50 text-blue-700">
                                        {sub.name}
                                    </Badge>
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
                            <div className="flex flex-wrap gap-2">
                                {commerceSubjects.map(sub => (
                                    <Badge key={sub.linkId} variant="outline" className="px-3 py-1 text-sm border-green-200 bg-green-50 text-green-700">
                                        {sub.name}
                                    </Badge>
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
                            <div className="flex flex-wrap gap-2">
                                {artsSubjects.map(sub => (
                                    <Badge key={sub.linkId} variant="outline" className="px-3 py-1 text-sm border-orange-200 bg-orange-50 text-orange-700">
                                        {sub.name}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No arts subjects.</p>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
