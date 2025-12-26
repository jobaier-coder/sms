"use server";

export async function getMarksSheetData(classId: string, section: string, subjectId: string) {
    // Mock data: List of students in that class/section with their current marks for the subject
    // Real impl would join Enrollments, Students, and StudentMarks
    return [
        {
            studentId: 1,
            name: "John Doe",
            roll: 101,
            currentMarks: 85,
        },
        {
            studentId: 2,
            name: "Jane Smith",
            roll: 205,
            currentMarks: null, // Not entered yet
        },
        {
            studentId: 3,
            name: "Sam Wilson",
            roll: 12,
            currentMarks: 92,
        },
    ];
}

export async function saveMarks(examId: string, subjectId: string, marksData: { studentId: number; marks: number }[]) {
    // Mock save
    console.log(`Saving marks for Exam ${examId}, Subject ${subjectId}`, marksData);
    return { success: true };
}
