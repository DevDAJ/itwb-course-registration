import { db } from "@/server/db";
import { courses } from "@/server/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import { coursePrerequisite } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const selectBody = {
  id: courses.id,
  name: courses.name,
  creditHours: courses.creditHours,
  coursePrerequisite: coursePrerequisite.prerequisiteCourse,
};

export async function POST() {
  const c = await db
    .select(selectBody)
    .from(courses)
    .leftJoin(coursePrerequisite, eq(courses.id, coursePrerequisite.courseId))
    .execute();
  return NextResponse.json(c);
}
