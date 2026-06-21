import { NextRequest } from "next/server";
import { getSessionFromRequest } from "./server-auth";
import { isSameOriginRequest } from "./request-security";

export function isAdminRequest(req: NextRequest): boolean {
  if (!isSameOriginRequest(req)) return false;
  const session = getSessionFromRequest(req);
  return session?.role === "admin";
}

export function getAuthEmail(req: NextRequest): string | null {
  if (!isSameOriginRequest(req)) return null;
  const session = getSessionFromRequest(req);
  return session?.role === "admin" ? session.email : null;
}
