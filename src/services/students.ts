import { db } from "@/server/db";
import { courses, enrollments, semesters, students } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const getStudents = async () => {
  const rows = await db
    .select({
      students,
      enrollments,
      courses,
      semesters,
    })
    .from(students)
    .where(eq(students.isDeleted, false))
    .leftJoin(enrollments, eq(students.id, enrollments.studentId))
    .leftJoin(courses, eq(enrollments.courseId, courses.id))
    .leftJoin(semesters, eq(enrollments.semesterTaken, semesters.id))
    .execute();
  const c = [...new Set(rows.map((r) => r.students))];
  const returnStudents = c.map((student) => ({
    ...student,
    enrollments: rows
      .map((r) => r.enrollments!)
      .filter((e) => e.studentId === student.id)
      .map((e) => ({
        ...e,
        ...rows.map((r) => r.courses!).find((c) => c.id === e.courseId),
        ...rows.map((r) => r.semesters!).find((s) => s.id === e.semesterTaken),
      })),
  }));
  return NextResponse.json(returnStudents);
};

export const createStudent = async (request: Request) => {
  const body = (await request.json()) as {
    firstName: string;
    lastName: string;
    email: string;
  };

  if (!body.firstName || !body.lastName || !body.email) {
    return NextResponse.json(
      { error: "Missing first name, last name, and email fields" },
      { status: 400 },
    );
  }

  if (body.firstName.length < 3) {
    return NextResponse.json(
      { error: "First name must be at least 3 characters" },
      { status: 400 },
    );
  }

  if (body.lastName.length < 3) {
    return NextResponse.json(
      { error: "Last name must be at least 3 characters" },
      { status: 400 },
    );
  }

  if (body.email.length < 3) {
    return NextResponse.json(
      { error: "Email must be at least 3 characters" },
      { status: 400 },
    );
  }

  if (body.email.length > 100) {
    return NextResponse.json(
      { error: "Email must be less than 100 characters" },
      { status: 400 },
    );
  }
  const student = await db
    .insert(students)
    .values({
      fullName: body.firstName + " " + body.lastName,
    })
    .returning();
  return NextResponse.json(student);
};

export const updateStudent = async (request: Request, id?: number) => {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
};

export const deleteStudent = async (id?: number) => {
  const getStudent = await db
    .select()
    .from(students)
    .where(and(eq(students.id, id!), eq(students.isDeleted, false)))
    .execute();

  if (getStudent.length === 0) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const student = await db
    .update(students)
    .set({ isDeleted: true })
    .where(eq(students.id, id!))
    .returning();
  return NextResponse.json(student);
};

export const addEnrollment = async (request: Request, id?: number) => {
  const body = (await request.json()) as {
    courseId: number;
    semesterId: number;
    completed: boolean;
    passed: boolean;
  };

  if (
    !body.courseId ||
    !body.semesterId ||
    body.completed === undefined ||
    body.passed === undefined
  ) {
    return NextResponse.json(
      { error: "Missing course id, semester id, completed, or passed fields" },
      { status: 400 },
    );
  }

  const student = await db
    .select()
    .from(students)
    .where(and(eq(students.id, id!), eq(students.isDeleted, false)))
    .execute();

  if (student.length === 0) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const course = await db
    .select()
    .from(courses)
    .where(and(eq(courses.id, body.courseId), eq(courses.isDeleted, false)))
    .execute();

  if (course.length === 0) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const semester = await db
    .select()
    .from(semesters)
    .where(
      and(eq(semesters.id, body.semesterId), eq(semesters.isDeleted, false)),
    )
    .execute();

  if (semester.length === 0) {
    return NextResponse.json({ error: "Semester not found" }, { status: 404 });
  }

  const enrollment = await db
    .insert(enrollments)
    .values({
      studentId: id!,
      courseId: body.courseId,
      semesterTaken: body.semesterId,
      completed: body.completed,
    })
    .returning();
  return NextResponse.json(enrollment);
};
