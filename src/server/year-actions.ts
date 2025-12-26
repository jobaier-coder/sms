"use server";

import { db } from "@/server/db";
import { academicYears } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const YEAR_COOKIE_NAME = "active_academic_year";

export async function getAcademicYears() {
    return await db.select().from(academicYears).orderBy(desc(academicYears.name));
}

export async function createAcademicYear(name: string) {
    if (!name || name.trim() === "") throw new Error("Invalid name");

    const [newYear] = await db.insert(academicYears).values({ name, isActive: true }).returning();

    // Set as active immediately? Optional.
    // For now just revalidate.
    revalidatePath("/");
    return newYear;
}

export async function getActiveYearId() {
    const cookieStore = await cookies();
    const yearId = cookieStore.get(YEAR_COOKIE_NAME)?.value;

    if (yearId) return parseInt(yearId);

    // Fallback: Get most recent year from DB
    const recent = await db.query.academicYears.findFirst({
        orderBy: [desc(academicYears.name)],
    });

    return recent?.id || null;
}

export async function setActiveYearAction(yearId: number) {
    const cookieStore = await cookies();
    cookieStore.set(YEAR_COOKIE_NAME, yearId.toString());
    revalidatePath("/");
}
