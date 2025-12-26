import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, User, CreditCard, History, BookOpen } from "lucide-react";
import { getStudentProfile } from "@/server/student-actions";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function StudentProfilePage({ params }: PageProps) {
    const studentId = parseInt(params.id);
    const profile = await getStudentProfile(studentId);

    if (!profile) {
        notFound();
    }

    const { student, currentEnrollment, enrollmentHistory, subjects, payments } = profile;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link href="/students">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold tracking-tight">{student.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-medium text-indigo-600">
                            {currentEnrollment ? `${currentEnrollment.className} (${currentEnrollment.section})` : "Not Enrolled"}
                        </span>
                        {currentEnrollment?.group && (
                            <Badge variant="outline">{currentEnrollment.group}</Badge>
                        )}
                        <span>• Student ID: {student.id}</span>
                    </div>
                </div>
                {/* Actions like Promote/Edit can go here */}
                <Button variant="outline">Edit Details</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sidebar / Personal Info */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Father's Name</span>
                            <p>{student.fatherName}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Mother's Name</span>
                            <p>{student.motherName}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Phone</span>
                            <p>{student.phone}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Address</span>
                            <p>{student.address}</p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">NID / Birth Cert</span>
                            <p>{student.nidDob}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Areas */}
                <div className="md:col-span-2">
                    <Tabs defaultValue="academic" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="academic"><BookOpen className="w-4 h-4 mr-2" /> Academic</TabsTrigger>
                            <TabsTrigger value="financial"><CreditCard className="w-4 h-4 mr-2" /> Financial</TabsTrigger>
                            <TabsTrigger value="history"><History className="w-4 h-4 mr-2" /> History</TabsTrigger>
                        </TabsList>

                        {/* Academic Tab */}
                        <TabsContent value="academic" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Enrolled Subjects</CardTitle>
                                    <CardDescription>Subjects for {currentEnrollment?.year}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {subjects.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {subjects.map(sub => (
                                                <div key={sub.id} className="p-3 border rounded-md flex justify-between items-center bg-slate-50">
                                                    <span className="font-medium">{sub.name}</span>
                                                    <span className="text-xs text-muted-foreground">{sub.code}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground italic">No subjects found or no active enrollment.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Add Marks Summary here later */}
                        </TabsContent>

                        {/* Financial Tab */}
                        <TabsContent value="financial" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Fee History</CardTitle>
                                        <CardDescription>Payments for {currentEnrollment?.year}</CardDescription>
                                    </div>
                                    <Button size="sm">Add Payment</Button>
                                </CardHeader>
                                <CardContent>
                                    {payments.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                                            No transaction history found.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {payments.map(pay => (
                                                <div key={pay.id} className="flex justify-between p-3 border rounded-md">
                                                    <div>
                                                        <p className="font-medium">{pay.term}</p>
                                                        <p className="text-xs text-muted-foreground capitalize">{pay.status}</p>
                                                    </div>
                                                    <div className="font-bold">
                                                        {/* Assuming amount is in cents/agora, dividing by 100 for display or just raw */}
                                                        {pay.amount} BDT
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* History Tab */}
                        <TabsContent value="history" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Enrollment Timeline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative border-l ml-4 space-y-8">
                                        {enrollmentHistory.map((history, idx) => (
                                            <div key={history.id} className="ml-6 relative">
                                                <span className={`absolute -left-[33px] mt-1 h-3 w-3 rounded-full border-2 border-white ${idx === 0 ? "bg-indigo-600" : "bg-slate-300"}`} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-indigo-600">{history.year}</span>
                                                    <span className="font-semibold">{history.className} - {history.section}</span>
                                                    {history.group && <span className="text-xs text-muted-foreground">{history.group} Group</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
