// Bun automatically loads .env file
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/server/db/schema";
import { env } from "../src/env";

// Local SQLite database
const localClient = createClient({
  url: "file:./db.sqlite",
});
const localDb = drizzle(localClient, { schema });

// Turso database
const tursoClient = createClient({
  url: env.DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});
const tursoDb = drizzle(tursoClient, { schema });

async function migrate() {
  console.log("Starting migration from local SQLite to Turso...\n");

  try {
    // Clear existing data from Turso (in reverse order to respect foreign keys)
    console.log("Clearing existing data from Turso...");
    await tursoDb.delete(schema.studentMarks);
    await tursoDb.delete(schema.exams);
    await tursoDb.delete(schema.payments);
    await tursoDb.delete(schema.enrollments);
    await tursoDb.delete(schema.classSubjects);
    await tursoDb.delete(schema.students);
    await tursoDb.delete(schema.subjects);
    await tursoDb.delete(schema.classes);
    await tursoDb.delete(schema.academicYears);
    console.log("✓ Cleared existing data\n");

    // 1. Migrate Academic Years
    console.log("Migrating academic years...");
    const academicYearsData = await localDb.select().from(schema.academicYears);
    if (academicYearsData.length > 0) {
      await tursoDb.insert(schema.academicYears).values(academicYearsData);
      console.log(`✓ Migrated ${academicYearsData.length} academic years`);
    } else {
      console.log("⚠ No academic years to migrate");
    }

    // 2. Migrate Classes
    console.log("\nMigrating classes...");
    const classesData = await localDb.select().from(schema.classes);
    if (classesData.length > 0) {
      await tursoDb.insert(schema.classes).values(classesData);
      console.log(`✓ Migrated ${classesData.length} classes`);
    } else {
      console.log("⚠ No classes to migrate");
    }

    // 3. Migrate Subjects
    console.log("\nMigrating subjects...");
    const subjectsData = await localDb.select().from(schema.subjects);
    if (subjectsData.length > 0) {
      await tursoDb.insert(schema.subjects).values(subjectsData);
      console.log(`✓ Migrated ${subjectsData.length} subjects`);
    } else {
      console.log("⚠ No subjects to migrate");
    }

    // 4. Migrate Class Subjects
    console.log("\nMigrating class subjects...");
    const classSubjectsData = await localDb.select().from(schema.classSubjects);
    if (classSubjectsData.length > 0) {
      await tursoDb.insert(schema.classSubjects).values(classSubjectsData);
      console.log(`✓ Migrated ${classSubjectsData.length} class subjects`);
    } else {
      console.log("⚠ No class subjects to migrate");
    }

    // 5. Migrate Students
    console.log("\nMigrating students...");
    const studentsData = await localDb.select().from(schema.students);
    if (studentsData.length > 0) {
      await batchInsert(schema.students, studentsData, 100);
      console.log(`✓ Migrated ${studentsData.length} students`);
    } else {
      console.log("⚠ No students to migrate");
    }

    // 6. Migrate Enrollments
    console.log("\nMigrating enrollments...");
    const enrollmentsData = await localDb.select().from(schema.enrollments);
    if (enrollmentsData.length > 0) {
      await batchInsert(schema.enrollments, enrollmentsData, 100);
      console.log(`✓ Migrated ${enrollmentsData.length} enrollments`);
    } else {
      console.log("⚠ No enrollments to migrate");
    }

    // 7. Migrate Payments
    console.log("\nMigrating payments...");
    const paymentsData = await localDb.select().from(schema.payments);
    if (paymentsData.length > 0) {
      await tursoDb.insert(schema.payments).values(paymentsData);
      console.log(`✓ Migrated ${paymentsData.length} payments`);
    } else {
      console.log("⚠ No payments to migrate");
    }

    // 8. Migrate Exams
    console.log("\nMigrating exams...");
    const examsData = await localDb.select().from(schema.exams);
    if (examsData.length > 0) {
      await tursoDb.insert(schema.exams).values(examsData);
      console.log(`✓ Migrated ${examsData.length} exams`);
    } else {
      console.log("⚠ No exams to migrate");
    }

    // 9. Migrate Student Marks
    console.log("\nMigrating student marks...");
    const studentMarksData = await localDb.select().from(schema.studentMarks);
    if (studentMarksData.length > 0) {
      await batchInsert(schema.studentMarks, studentMarksData, 100);
      console.log(`✓ Migrated ${studentMarksData.length} student marks`);
    } else {
      console.log("⚠ No student marks to migrate");
    }

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    localClient.close();
    tursoClient.close();
  }
}

// Helper function to batch insert large datasets
async function batchInsert(table: any, data: any[], batchSize: number) {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await tursoDb.insert(table).values(batch);
    if (data.length > batchSize) {
      console.log(`  Progress: ${Math.min(i + batchSize, data.length)}/${data.length}`);
    }
  }
}

migrate();
