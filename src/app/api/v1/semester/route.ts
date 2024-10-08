import { db } from "@/server/db";
import { courseOfferings, courses, semesters } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await db
    .select({
      courseOfferings: courseOfferings,
      courses: courses,
      semesters: semesters,
    })
    .from(semesters)
    .where(eq(semesters.isDeleted, false))
    .leftJoin(courseOfferings, eq(semesters.id, courseOfferings.semesterId))
    .leftJoin(courses, eq(courseOfferings.courseId, courses.id))
    .execute();

  const c = rows.map((r) => ({
    ...r.semesters,
    courseOfferings: rows
      .filter((row) => row.semesters.id === r.semesters.id)
      .map((row) => row.courseOfferings),
  }));

  return NextResponse.json(c);
}

export async function POST() {
  const years = [2021, 2022, 2023, 2024, 2025];
  const terms = [1, 2, 3];

  const semester = years.flatMap((year) =>
    terms.map((term) => ({
      year,
      term,
    })),
  );
  const body = await db.insert(semesters).values(semester).returning();
  return NextResponse.json(body);
}
