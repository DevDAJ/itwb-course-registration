import { createStudent, getStudents } from "@/services/students";

export function GET() {
  return getStudents();
}

export function POST(request: Request) {
  return createStudent(request);
}
