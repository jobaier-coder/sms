// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text, integer } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `${name}`);

// --- Core Entities ---

export const students = createTable(
  "student",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }).notNull(),
    fatherName: text("father_name", { length: 256 }).notNull(),
    motherName: text("mother_name", { length: 256 }).notNull(),
    phone: text("phone", { length: 20 }).notNull(),
    address: text("address", { length: 512 }).notNull(),
    nidDob: text("nid_dob", { length: 50 }).notNull(), // National ID or Birth Certificate
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
  }
);

export const academicYears = createTable(
  "academic_year",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 50 }).notNull(), // e.g. "2024"
    isActive: int("is_active", { mode: "boolean" }).default(true).notNull(),
  }
);

export const classes = createTable(
  "class",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 50 }).notNull(), // e.g. "Class 9"
  }
);

export const subjects = createTable(
  "subject",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 100 }).notNull(), // e.g. "Physics"
    code: text("code", { length: 20 }).notNull(), // e.g. "PHYS101"
  }
);

// --- Structure & Mapping ---

export const classSubjects = createTable(
  "class_subject",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    classId: int("class_id").references(() => classes.id).notNull(),
    subjectId: int("subject_id").references(() => subjects.id).notNull(),
    // Group is optional. If null, it's a common subject for the class.
    // Values: NULL, "SCIENCE", "COMMERCE", "ARTS"
    group: text("group", { length: 20 }),
    // Full marks for this subject in this class (e.g., 100, 75, 50)
    fullMarks: int("full_marks", { mode: "number" }).default(100),
  },
  (t) => [
    index("class_subject_class_idx").on(t.classId),
  ]
);

// --- Enrollment & Operations ---

export const enrollments = createTable(
  "enrollment",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    studentId: int("student_id").references(() => students.id).notNull(),
    academicYearId: int("academic_year_id").references(() => academicYears.id).notNull(),
    classId: int("class_id").references(() => classes.id).notNull(),
    // Section: "A", "B", etc.
    section: text("section", { length: 10 }).notNull(),
    // Group: "SCIENCE", "COMMERCE", "ARTS" (Nullable for lower classes)
    group: text("group", { length: 20 }),
    // Roll number within the class for this academic year
    roll: int("roll", { mode: "number" }),

    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (t) => [
    index("enrollment_student_idx").on(t.studentId),
    index("enrollment_class_idx").on(t.classId),
  ]
);

export const payments = createTable(
  "payment",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    enrollmentId: int("enrollment_id").references(() => enrollments.id).notNull(),
    term: text("term", { length: 50 }).notNull(), // "Midterm", "Final"
    amount: int("amount", { mode: "number" }).notNull(), // Storing as integer (cents) or simple number
    status: text("status", { length: 20 }).default("PENDING").notNull(), // "PAID", "PENDING"
    paidAt: int("paid_at", { mode: "timestamp" }),
  },
  (t) => [
    index("payment_enrollment_idx").on(t.enrollmentId),
  ]
);

export const exams = createTable(
  "exam",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 100 }).notNull(), // "Midterm Exam"
    academicYearId: int("academic_year_id").references(() => academicYears.id).notNull(),
  }
);

export const studentMarks = createTable(
  "student_mark",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    enrollmentId: int("enrollment_id").references(() => enrollments.id).notNull(),
    examId: int("exam_id").references(() => exams.id).notNull(),
    subjectId: int("subject_id").references(() => subjects.id).notNull(),
    cqMarks: int("cq_marks", { mode: "number" }).default(0),
    mcqMarks: int("mcq_marks", { mode: "number" }).default(0),
    practicalMarks: int("practical_marks", { mode: "number" }).default(0),
    marksObtained: int("marks_obtained", { mode: "number" }).notNull(),
    fullMarks: int("full_marks", { mode: "number" }),
    createdAt: int("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  },
  (t) => [
    index("mark_enrollment_idx").on(t.enrollmentId),
    index("mark_exam_idx").on(t.examId),
    index("mark_subject_idx").on(t.subjectId),
  ]
);
