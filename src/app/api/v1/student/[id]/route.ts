import { deleteStudent } from "@/services/students";

export function DELETE(_: Request, { params }: { params: { id: number } }) {
  return deleteStudent(params.id);
}
