import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AddClassDialog } from "@/components/classes/add-class-dialog";
import { getClasses } from "@/server/class-actions";
import { ChevronRight } from "lucide-react";

export default async function ClassesPage() {
    const classes = await getClasses();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Classes</h2>
                    <p className="text-muted-foreground">
                        Manage academic classes and their assigned subjects.
                    </p>
                </div>
                <AddClassDialog />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((cls) => (
                    <Link href={`/classes/${cls.id}`} key={cls.id}>
                        <Card className="hover:bg-slate-50 transition-colors cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-semibold">{cls.name}</CardTitle>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardDescription className="px-6 pb-4">
                                Manage Subjects & Groups
                            </CardDescription>
                        </Card>
                    </Link>
                ))}

                {classes.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed text-muted-foreground">
                        <p>No classes found. Create one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
