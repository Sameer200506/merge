import { auth } from "@/lib/auth";
import { mockTasks } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const tasks = mockTasks[id] || [];
  return NextResponse.json(tasks);
}
