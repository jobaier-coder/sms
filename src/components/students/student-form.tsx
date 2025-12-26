"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createStudent } from "@/server/student-actions";
import { Loader2 } from "lucide-react";

interface Props {
    classes: { id: number; name: string }[];
    years: { id: number; name: string }[];
    activeYearId: number | null;
}

export function StudentForm({ classes, years, activeYearId }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        fatherName: "",
        motherName: "",
        dob: "",
        phone: "",
        address: "",
        nid: "",
        academicYearId: activeYearId ? activeYearId.toString() : "",
        classId: "",
        section: "",
        group: "", // Optional
    });

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createStudent({
                ...formData,
                academicYearId: parseInt(formData.academicYearId),
                classId: parseInt(formData.classId),
                // Group is optional, send undefined if empty string
                group: formData.group || undefined,
            });

            router.push("/students");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to enroll student. Please check inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Basic details about the student.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                                id="dob"
                                type="date"
                                value={formData.dob}
                                onChange={(e) => handleChange("dob", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="father">Father's Name</Label>
                            <Input
                                id="father"
                                value={formData.fatherName}
                                onChange={(e) => handleChange("fatherName", e.target.value)}
                                placeholder="Father Name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mother">Mother's Name</Label>
                            <Input
                                id="mother"
                                value={formData.motherName}
                                onChange={(e) => handleChange("motherName", e.target.value)}
                                placeholder="Mother Name"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            placeholder="123 Main St, City"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Guardian Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                placeholder="017..."
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nid">NID / Birth Cert No</Label>
                            <Input
                                id="nid"
                                value={formData.nid}
                                onChange={(e) => handleChange("nid", e.target.value)}
                                placeholder="Number"
                                required
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Step 2: Academic Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Academic Enrollment</CardTitle>
                    <CardDescription>
                        Assign class, section and group for the current year.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Academic Year</Label>
                            <Select
                                value={formData.academicYearId}
                                onValueChange={(val) => handleChange("academicYearId", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((y) => (
                                        <SelectItem key={y.id} value={y.id.toString()}>
                                            {y.name} {y.id === activeYearId && "(Active)"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Class</Label>
                            <Select
                                value={formData.classId}
                                onValueChange={(val) => handleChange("classId", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id.toString()}>
                                            {cls.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Section</Label>
                            <Select
                                value={formData.section}
                                onValueChange={(val) => handleChange("section", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Section" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">Section A</SelectItem>
                                    <SelectItem value="B">Section B</SelectItem>
                                    <SelectItem value="C">Section C</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Group (Class 9-10)</Label>
                            <Select
                                value={formData.group}
                                onValueChange={(val) => handleChange("group", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Group (Optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SCIENCE">Science</SelectItem>
                                    <SelectItem value="COMMERCE">Commerce</SelectItem>
                                    <SelectItem value="ARTS">Arts</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-[0.8rem] text-muted-foreground">
                                Leave empty for Classes 6-8.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enroll Student
                </Button>
            </div>
        </form>
    );
}
