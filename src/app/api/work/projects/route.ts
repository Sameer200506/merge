import { auth } from "@/lib/auth";
import { mockProjects } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(mockProjects);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const newProject = { id: `p${Date.now()}`, identifier: body.name?.slice(0, 4).toUpperCase() || "PROJ", totalIssues: 0, completedIssues: 0, status: "backlog", ...body };
  return NextResponse.json(newProject, { status: 201 });
}
