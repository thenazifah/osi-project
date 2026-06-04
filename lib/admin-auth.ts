import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { isAllowedAdminEmail } from "@/lib/admin-allowlist";

const COOKIE_NAME = "osi_admin_session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) {
    throw new Error("ADMIN_SECRET must be set in .env.local for admin sessions.");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function createToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      exp: Date.now() + SESSION_MS,
      email: email.trim().toLowerCase(),
    })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function parseToken(token: string): { exp: number; email: string } | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      exp: number;
      email: string;
    };
    if (!data.email || data.exp <= Date.now()) return null;
    if (!isAllowedAdminEmail(data.email)) return null;
    return data;
  } catch {
    return null;
  }
}

export async function setAdminSession(email: string): Promise<void> {
  if (!isAllowedAdminEmail(email)) {
    throw new Error("Email is not authorized for admin access.");
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MS / 1000,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getAdminSessionEmail()) !== null;
}

export async function getAdminSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return parseToken(token)?.email ?? null;
}
