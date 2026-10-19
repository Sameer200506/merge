import { auth } from "@/lib/auth";
import { mockCompanies } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(mockCompanies);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const newCompany = { id: `co${Date.now()}`, ...body, createdAt: new Date().toISOString() };
  return NextResponse.json(newCompany, { status: 201 });
}
