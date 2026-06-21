import { NextRequest } from "next/server";
import { getSessionFromRequest } from "./server-auth";

export function isAdminRequest(req: NextRequest): boolean {
  const session = getSessionFromRequest(req);
  return session?.role === "admin";
}

export function getAuthEmail(req: NextRequest): string | null {
  const session = getSessionFromRequest(req);
  return session?.role === "admin" ? session.email : null;
}
