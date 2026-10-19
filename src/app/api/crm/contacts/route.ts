import { auth } from "@/lib/auth";
import { mockContacts } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // In production: call Twenty GraphQL API here
  // const contacts = await twentyClient.request(GET_CONTACTS_QUERY)
  return NextResponse.json(mockContacts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  // In production: call Twenty GraphQL createPerson mutation
  const newContact = {
    id: `c${Date.now()}`,
    ...body,
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json(newContact, { status: 201 });
}
