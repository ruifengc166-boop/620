import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export interface ServerSession {
  userId: string;
  email: string;
  nickname: string;
  role: "user" | "admin";
  membership_level: string;
  points_balance: number;
  exp: number;
}

const COOKIE_NAME = "banhui_session_token";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const SESSION_SECRET = process.env.SESSION_SECRET || "local-dev-session-secret-change-before-production";

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function signPayload(payload: string) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function createSessionToken(data: Omit<ServerSession, "exp">, maxAgeSeconds = SESSION_MAX_AGE_SECONDS) {
  const payload: ServerSession = { ...data, exp: Math.floor(Date.now() / 1000) + maxAgeSeconds };
  const encoded = base64url(JSON.stringify(payload));
  const sig = signPayload(encoded);
  return `${encoded}.${sig}`;
}

export function verifySessionToken(token?: string | null): ServerSession | null {
  if (!token || !token.includes(".")) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const expected = signPayload(encoded);
  if (!safeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as ServerSession;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.userId || !payload.email || !payload.role) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest): ServerSession | null {
  return verifySessionToken(req.cookies.get(COOKIE_NAME)?.value || null);
}

export function isAdminSession(req: NextRequest): boolean {
  const session = getSessionFromRequest(req);
  return session?.role === "admin";
}

export function setSessionCookie(res: NextResponse, data: Omit<ServerSession, "exp">) {
  const token = createSessionToken(data);
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
