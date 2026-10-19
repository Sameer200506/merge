import { auth } from "@/lib/auth";
import { mockDeals } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(mockDeals);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const newDeal = { id: `d${Date.now()}`, stage: "LEAD", ...body, createdAt: new Date().toISOString() };
  return NextResponse.json(newDeal, { status: 201 });
}
