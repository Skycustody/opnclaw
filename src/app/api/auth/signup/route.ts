import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/auth";
import { createUser } from "@/lib/users";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "A valid email is required" },
      { status: 400 },
    );
  }

  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 },
    );
  }

  try {
    const user = await createUser(email, password);
    const response = NextResponse.json({ ok: true, tenantId: user.tenantId });
    response.headers.append("Set-Cookie", createSessionCookie(user.email));
    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create account" },
      { status: 400 },
    );
  }
}
