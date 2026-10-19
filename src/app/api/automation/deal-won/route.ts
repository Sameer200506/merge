import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { dealId, dealName, companyName, amount, projectManagerId } = await req.json();

  // In production: call Twenty API to update deal stage, then call Plane API to create project
  const projectId = `p${Date.now()}`;

  // Simulate async work
  await new Promise((r) => setTimeout(r, 800));

  return NextResponse.json({
    success: true,
    projectId,
    message: `Project created for ${dealName}`,
    details: {
      dealId,
      dealName,
      companyName,
      amount,
      projectManagerId,
      createdAt: new Date().toISOString(),
    },
  });
}
