"use server";

import { db } from "@/server/db";
import { classes, subjects, classSubjects } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
    });

    revalidatePath(`/classes/${classId}`);
    return { success: true };
}
