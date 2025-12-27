"use server";

import { db } from "@/server/db";
import { classes, subjects, classSubjects, enrollments, students, academicYears, payments } from "@/server/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getActiveYearId } from "./year-actions";

export async function getClasses() {
    return await db.select().from(classes);
}

export async function createClass(name: string) {
    if (!name || name.trim() === "") throw new Error("Invalid name");

    await db.insert(classes).values({ name });
    revalidatePath("/classes");
}

export async function getClassDetails(classId: number) {
    const classData = await db.query.classes.findFirst({
        where: eq(classes.id, classId),
    });

    if (!classData) return null;

    // We need to fetch subjects linked to this class
    // Since we haven't defined relations in schema (yet) using one-to-many helpers, 
    // we do a manual join or separate query.
    // A raw join is often cleanest for many-to-many or specific linkage tables.

    const subjectsData = await db
        .select({
            id: subjects.id,
            name: subjects.name,
            code: subjects.code,
            group: classSubjects.group,
            fullMarks: classSubjects.fullMarks,
            linkId: classSubjects.id,
        })
        .from(classSubjects)
        .innerJoin(subjects, eq(classSubjects.subjectId, subjects.id))
        .where(eq(classSubjects.classId, classId));

    return { ...classData, subjects: subjectsData };
}

export async function getSubjects() {
    return await db.select().from(subjects);
}

export async function createSubject(name: string, code: string) {
    // Check if exists
    const existing = await db.select().from(subjects).where(eq(subjects.code, code)).limit(1);
    if (existing.length > 0) return existing[0];

    const res = await db.insert(subjects).values({ name, code }).returning();
    return res[0];
}

export async function assignSubjectToClass(
    classId: number,
    subjectId: number,
    group: string | null
) {
    // Check if already assigned
    const existing = await db
        .select()
        .from(classSubjects)
        .where(
            and(
                eq(classSubjects.classId, classId),
                eq(classSubjects.subjectId, subjectId)
            )
        );

    if (existing.length > 0) {
        // If it exists, maybe update the group? simpler to just return for now or throw
        // For now, let's assume we allow multiple same-subject assignments if groups differ? 
        // Actually usually unique per class+subject is safer unless we strictly split groups.
        // Let's enforce unique (class, subject) for simplicity in this version.
        return { error: "Subject already assigned to this class" };
    }

    await db.insert(classSubjects).values({
        classId,
        subjectId,
        group: group === "all" ? null : group, // UI might send "all" for common
        fullMarks: 100, // Default full marks
    });

    revalidatePath(`/classes/${classId}`);
    return { success: true };
}

export async function updateClassSubject(
    linkId: number,
    data: { fullMarks?: number; group?: string }
) {
    await db
        .update(classSubjects)
        .set({
            fullMarks: data.fullMarks,
            group: data.group === "all" ? null : data.group,
        })
        .where(eq(classSubjects.id, linkId));

    revalidatePath("/classes");
    return { success: true };
}

export async function deleteClassSubject(linkId: number) {
    await db.delete(classSubjects).where(eq(classSubjects.id, linkId));
    revalidatePath("/classes");
    return { success: true };
}

export async function getClassDetailsWithStudents(classId: number) {
    // Get class info
    const classData = await db.query.classes.findFirst({
        where: eq(classes.id, classId),
    });

    if (!classData) return null;

    // Get active academic year from global context
    const selectedYearId = await getActiveYearId();

    // Get academic years for reference
    const allYears = await db.select().from(academicYears).orderBy(desc(academicYears.name));

    // Get subjects for this class
    const subjectsData = await db
        .select({
            id: subjects.id,
            name: subjects.name,
            code: subjects.code,
            group: classSubjects.group,
            fullMarks: classSubjects.fullMarks,
            linkId: classSubjects.id,
        })
        .from(classSubjects)
        .innerJoin(subjects, eq(classSubjects.subjectId, subjects.id))
        .where(eq(classSubjects.classId, classId));

    // Get students enrolled in this class for the selected year
    let studentsData: any[] = [];
    let stats = {
        totalStudents: 0,
        sections: [] as string[],
        groups: [] as string[],
        paidCount: 0,
        pendingCount: 0,
    };

    if (selectedYearId) {
        const enrollmentsData = await db
            .select({
                enrollmentId: enrollments.id,
                studentId: students.id,
                studentName: students.name,
                section: enrollments.section,
                group: enrollments.group,
                roll: enrollments.roll,
                phone: students.phone,
                createdAt: students.createdAt,
            })
            .from(enrollments)
            .innerJoin(students, eq(enrollments.studentId, students.id))
            .where(
                and(
                    eq(enrollments.classId, classId),
                    eq(enrollments.academicYearId, selectedYearId)
                )
            )
            .orderBy(enrollments.section, enrollments.roll);

        // Get payment status for each enrollment
        const enrollmentIds = enrollmentsData.map(e => e.enrollmentId);
        const paymentsData = enrollmentIds.length > 0
            ? await db
                .select({
                    enrollmentId: payments.enrollmentId,
                    status: payments.status,
                })
                .from(payments)
                .where(sql`${payments.enrollmentId} IN ${enrollmentIds}`)
            : [];

        // Create payment map
        const paymentMap = paymentsData.reduce((acc, p) => {
            if (!acc[p.enrollmentId]) acc[p.enrollmentId] = [];
            acc[p.enrollmentId].push(p.status);
            return acc;
        }, {} as Record<number, string[]>);

        // Combine data
        studentsData = enrollmentsData.map(e => ({
            ...e,
            feeStatus: paymentMap[e.enrollmentId]?.includes("PENDING") ? "PENDING" : "PAID",
        }));

        // Calculate stats
        stats.totalStudents = studentsData.length;
        stats.sections = [...new Set(studentsData.map(s => s.section).filter(Boolean))];
        stats.groups = [...new Set(studentsData.map(s => s.group).filter(Boolean))];
        stats.paidCount = studentsData.filter(s => s.feeStatus === "PAID").length;
        stats.pendingCount = studentsData.filter(s => s.feeStatus === "PENDING").length;
    }

    return {
        class: classData,
        subjects: subjectsData,
        students: studentsData,
        stats,
        academicYears: allYears,
        selectedYearId,
    };
}
