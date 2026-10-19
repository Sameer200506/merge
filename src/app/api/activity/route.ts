import { auth } from "@/lib/auth";
import { mockActivities } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(mockActivities);
}
