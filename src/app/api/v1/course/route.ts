import { db } from "@/server/db";
import { courses } from "@/server/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import { coursePrerequisite } from "../../../../server/db/schema";
import { and, eq } from "drizzle-orm";

const selectBody = {
  id: courses.id,
  name: courses.name,
  creditHours: courses.creditHours,
  coursePrerequisite: coursePrerequisite.prerequisiteCourse,
};

export async function GET() {
  const c = await db
    .select(selectBody)
    .from(courses)
    .where(eq(courses.isDeleted, false))
    .leftJoin(coursePrerequisite, eq(courses.id, coursePrerequisite.courseId))
    .execute();
  return NextResponse.json(c);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    creditHours: number;
    coursePrerequisite: number;
  };
  if (!body.name || !body.creditHours) {
    return NextResponse.json(
      { error: "Missing name and credit hour fields" },
      { status: 400 },
    );
  }
  if (typeof body.creditHours !== "number") {
    return NextResponse.json(
      { error: "Credit hours must be a number" },
      { status: 400 },
    );
  }
  if (body.creditHours < 1) {
    return NextResponse.json(
      { error: "Credit hours must be greater than 0" },
      { status: 400 },
    );
  }
  if (body.name.length < 3) {
    return NextResponse.json(
      { error: "Name must be at least 3 characters" },
      { status: 400 },
    );
  }
  if (body.name.length > 100) {
    return NextResponse.json(
      { error: "Name must be less than 100 characters" },
      { status: 400 },
    );
  }
  if (body.coursePrerequisite) {
    const course = await db
      .select()
      .from(courses)
      .where(
        and(
          eq(courses.id, body.coursePrerequisite),
          eq(courses.isDeleted, false),
        ),
      )

      .execute();
    if (!course) {
      return NextResponse.json(
        { error: "Course prerequisite does not exist" },
        { status: 400 },
      );
    }
  }
  const c = await db
    .insert(courses)
    .values(body)
    .returning({ id: courses.id })
    .execute();
  if (body.coursePrerequisite) {
    await db
      .insert(coursePrerequisite)
      .values({
        courseId: c[0]?.id,
        prerequisiteCourse: body.coursePrerequisite,
      })
      .execute();
  }

  const returnCourse = await db
    .select(selectBody)
    .from(courses)
    .where(eq(courses.id, c[0]!.id))
    .leftJoin(coursePrerequisite, eq(courses.id, coursePrerequisite.courseId))
    .execute();

  return NextResponse.json(returnCourse[0]);
}
