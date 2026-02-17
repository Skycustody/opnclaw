import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "A valid email is required" },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.headers.append("Set-Cookie", createSessionCookie(email.toLowerCase()));
  return response;
}

