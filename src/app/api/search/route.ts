import { auth } from "@/lib/auth";
import { mockContacts, mockCompanies, mockDeals, mockProjects } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  if (q.length < 2) return NextResponse.json({ contacts: [], companies: [], deals: [], projects: [] });

  return NextResponse.json({
    contacts: mockContacts.filter(
      (c) =>
        `${c.name.firstName} ${c.name.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    ).slice(0, 4),
    companies: mockCompanies.filter((c) =>
      c.name.text.toLowerCase().includes(q)
    ).slice(0, 4),
    deals: mockDeals.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 4),
    projects: mockProjects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 4),
  });
}
