import crypto from "crypto";

const SESSION_COOKIE_NAME = "oc_session";

const AUTH_SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";

export type SessionPayload = {
  email: string;
};

function sign(data: string): string {
  return crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("hex");
}

export function createSessionCookie(email: string): string {
  const payload: SessionPayload = { email };
  const json = JSON.stringify(payload);
  const signature = sign(json);
  const value = Buffer.from(`${json}.${signature}`).toString("base64url");
  return `${SESSION_COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
    60 * 60 * 24 * 7
  }`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`;
}

export function parseSessionCookie(
  cookieHeader: string | null | undefined,
): SessionPayload | null {
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((part) => {
      const [k, ...rest] = part.trim().split("=");
      return [k, rest.join("=")];
    }),
  );

  const raw = cookies[SESSION_COOKIE_NAME];
  if (!raw) return null;

  try {
    const decoded = Buffer.from(raw, "base64url").toString("utf8");
    const lastDot = decoded.lastIndexOf(".");
    if (lastDot === -1) return null;

    const json = decoded.slice(0, lastDot);
    const signature = decoded.slice(lastDot + 1);

    if (sign(json) !== signature) return null;

    const payload = JSON.parse(json) as SessionPayload;
    if (!payload.email) return null;
    return payload;
  } catch {
    return null;
  }
}

export function parseSessionValue(
  raw: string | undefined | null,
): SessionPayload | null {
  if (!raw) return null;

  try {
    const decoded = Buffer.from(raw, "base64url").toString("utf8");
    const lastDot = decoded.lastIndexOf(".");
    if (lastDot === -1) return null;

    const json = decoded.slice(0, lastDot);
    const signature = decoded.slice(lastDot + 1);

    if (sign(json) !== signature) return null;

    const payload = JSON.parse(json) as SessionPayload;
    if (!payload.email) return null;
    return payload;
  } catch {
    return null;
  }
}


