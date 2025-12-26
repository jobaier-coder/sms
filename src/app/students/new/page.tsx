import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { StudentForm } from "@/components/students/student-form";
import { getClasses } from "@/server/class-actions";
import { getAcademicYears, getActiveYearId } from "@/server/year-actions";

export default async function NewStudentPage() {
    const classes = await getClasses();
    const years = await getAcademicYears();
    const activeYearId = await getActiveYearId();

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center space-x-4">
                <Link href="/students">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">New Student Enrollment</h2>
                    <p className="text-muted-foreground">
                        Register a new student for the academic year.
                    </p>
                </div>
            </div>

            <StudentForm
                classes={classes}
                years={years}
                activeYearId={activeYearId}
            />
        </div>
    );
}
