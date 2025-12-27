"use server";

import { db } from "@/server/db";
import { students, enrollments, classes, academicYears, classSubjects, subjects, payments, exams, studentMarks } from "@/server/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getActiveYearId } from "./year-actions";

export async function getStudentProfile(studentId: number) {
    // 1. Get Student Basic Info
    const student = await db.query.students.findFirst({
        where: eq(students.id, studentId),
    });

    if (!student) return null;

    // Get active academic year from global context
    const activeYearId = await getActiveYearId();

    // 2. Get Enrollments (History)
    const enrollmentHistory = await db
        .select({
            id: enrollments.id,
            year: academicYears.name,
            yearId: academicYears.id,
            academicYearId: enrollments.academicYearId,
            className: classes.name,
            section: enrollments.section,
            group: enrollments.group,
            classId: enrollments.classId,
        })
        .from(enrollments)
        .innerJoin(academicYears, eq(enrollments.academicYearId, academicYears.id))
        .innerJoin(classes, eq(enrollments.classId, classes.id))
        .where(eq(enrollments.studentId, studentId))
        .orderBy(desc(academicYears.name));

    // Find enrollment for active year, or use most recent
    const currentEnrollment = activeYearId 
        ? enrollmentHistory.find(e => e.academicYearId === activeYearId) || enrollmentHistory[0]
        : enrollmentHistory[0];

    // 3. Get Subjects for Current Enrollment
    let subjectsList: any[] = [];
    if (currentEnrollment) {
        // Logic: Fetch subjects for this class where group is NULL (Common) OR group matches student's group
        const allClassSubjects = await db
            .select({
                id: subjects.id,
                name: subjects.name,
                code: subjects.code,
                group: classSubjects.group,
            })
            .from(classSubjects)
            .innerJoin(subjects, eq(classSubjects.subjectId, subjects.id))
            .where(eq(classSubjects.classId, currentEnrollment.classId));

        subjectsList = allClassSubjects.filter(
            (s) => !s.group || s.group === currentEnrollment.group
        );
    }

    // 4. Get Payments (Simple fetch)
    const paymentHistory = currentEnrollment
        ? await db.select().from(payments).where(eq(payments.enrollmentId, currentEnrollment.id))
        : [];

    // 5. Get Exam Marks for Current Enrollment
    let examMarks: any[] = [];
    if (currentEnrollment) {
        const rawMarks = await db
            .select({
                examId: exams.id,
                examName: exams.name,
                subjectId: subjects.id,
                subjectName: subjects.name,
                subjectCode: subjects.code,
                cqMarks: studentMarks.cqMarks,
                mcqMarks: studentMarks.mcqMarks,
                practicalMarks: studentMarks.practicalMarks,
                marksObtained: studentMarks.marksObtained,
                fullMarks: classSubjects.fullMarks, // Use full marks from class_subject
            })
            .from(studentMarks)
            .leftJoin(exams, eq(studentMarks.examId, exams.id))
            .leftJoin(subjects, eq(studentMarks.subjectId, subjects.id))
            .leftJoin(classSubjects, and(
                eq(classSubjects.subjectId, studentMarks.subjectId),
                eq(classSubjects.classId, currentEnrollment.classId)
            ))
            .where(eq(studentMarks.enrollmentId, currentEnrollment.id))
            .orderBy(exams.name, subjects.name);
        
        // Filter out marks with missing exam or subject data and calculate correct totals
        examMarks = rawMarks
            .filter(mark => mark.examName && mark.subjectName)
            .map(mark => ({
                ...mark,
                // Calculate total from components instead of using potentially incorrect marksObtained
                marksObtained: (mark.cqMarks || 0) + (mark.mcqMarks || 0) + (mark.practicalMarks || 0),
            }));
    }

    // Group marks by exam
    const examResults = examMarks.reduce((acc, mark) => {
        const examName = mark.examName;
        if (!acc[examName]) {
            acc[examName] = [];
        }
        acc[examName].push(mark);
        return acc;
    }, {} as Record<string, typeof examMarks>);

    return {
        student,
        currentEnrollment,
        enrollmentHistory,
        subjects: subjectsList,
        payments: paymentHistory,
        examResults,
    };
}

export async function getStudents(classId?: number) {
    // Fetch students with their *latest* enrollment
    // Note: For a real app with many years, we'd filter by "Active Year" or most recent.
    // Here we just join to get class info.

    // Build conditions
    const conditions = [];
    if (classId) {
        conditions.push(eq(enrollments.classId, classId));
    }

    const results = await db
        .select({
            id: students.id,
            name: students.name,
            guardianPhone: students.phone,
            className: classes.name,
            section: enrollments.section,
            group: enrollments.group,
            roll: students.id, // Using ID as roll for now, or add roll column later
            classId: enrollments.classId,
        })
        .from(students)
        .leftJoin(enrollments, eq(enrollments.studentId, students.id))
        .leftJoin(classes, eq(enrollments.classId, classes.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(students.createdAt));

    // Deduplicate if multiple enrollments? 
    // For simplicity, this query might return duplicates if a student has multiple enrollments.
    // Ideally we should filter by the ACTIVE academic year.

    // Let's improve to filter by active year if possible, but for now we'll take top 1 per student or unique.
    // Actually, let's just return all for the UI to see, maybe sorted by year.

    return results;
}

export type CreateStudentParams = {
    name: string;
    fatherName: string;
    motherName: string;
    dob: string;
    phone: string;
    address: string;
    nid: string;
    academicYearId: number;
    classId: number;
    section: string;
    group?: string;
};

export async function createStudent(data: CreateStudentParams) {
    // Transaction: Create Student -> Create Enrollment
    return await db.transaction(async (tx) => {
        // 1. Insert Student
        const [newStudent] = await tx
            .insert(students)
            .values({
                name: data.name,
                fatherName: data.fatherName,
                motherName: data.motherName,
                phone: data.phone,
                address: data.address,
                nidDob: data.nid,
            })
            .returning();

        // 2. Insert Enrollment
        await tx.insert(enrollments).values({
            studentId: newStudent.id,
            academicYearId: data.academicYearId,
            classId: data.classId,
            section: data.section,
            group: data.group || null,
        });

        return newStudent;
    });
}

export async function addPayment(data: {
    enrollmentId: number;
    term: string;
    amount: number;
    status: "PAID" | "PENDING";
    paidAt?: Date;
}) {
    await db.insert(payments).values({
        enrollmentId: data.enrollmentId,
        term: data.term,
        amount: data.amount,
        status: data.status,
        paidAt: data.paidAt || (data.status === "PAID" ? new Date() : null),
    });

    revalidatePath("/students/[id]");
}

