// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `${name}`);

export const students = createTable("students", {
  id: int("id").primaryKey(),
  fullName: text("full_name").notNull(),
  isDeleted: int("is_deleted", { mode: "boolean" }).notNull().default(false),
});

export const courses = createTable("courses", {
  id: int("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  creditHours: int("credit_hours").notNull(),
  isDeleted: int("is_deleted", { mode: "boolean" }).notNull().default(false),
});

export const coursePrerequisite = createTable("course_prerequisite", {
  id: int("id").primaryKey(),
  courseId: int("course_id").references(() => courses.id),
  prerequisiteCourse: int("prerequisite_course").references(() => courses.id),
  isDeleted: int("is_deleted", { mode: "boolean" }).notNull().default(false),
});
export const semesters = createTable("semesters", {
  id: int("id").primaryKey(),
  year: int("year").notNull(),
  term: int("term").notNull(),
  isDeleted: int("is_deleted", { mode: "boolean" }).notNull().default(false),
});

export const courseOfferings = createTable("course_offerings", {
  id: int("id").primaryKey(),
  courseId: int("course_id")
    .references(() => courses.id)
    .notNull(),
  semesterId: int("semester_id")
    .references(() => semesters.id)
    .notNull(),
  isDeleted: int("is_deleted", { mode: "boolean" }).notNull().default(false),
});

export const enrollments = createTable("enrollments", {
  enrollmentId: int("id").primaryKey(),
  studentId: int("student_id")
    .references(() => students.id)
    .notNull(),
  courseId: int("course_id")
    .references(() => courses.id)
    .notNull(),
  completed: int("completed", { mode: "boolean" }),
  passed: int("passed", { mode: "boolean" }),
  semesterTaken: int("semwester_taken")
    .references(() => semesters.id)
    .notNull(),
  isDeleted: int("is_deleted", { mode: "boolean" }).notNull().default(false),
});
