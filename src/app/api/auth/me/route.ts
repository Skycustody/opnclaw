import { NextRequest, NextResponse } from "next/server";
import { parseSessionCookie } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = parseSessionCookie(request.headers.get("cookie"));

  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      email: session.email,
      tenantId: session.email.toLowerCase(),
    },
  });
}

