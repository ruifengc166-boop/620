import { NextRequest } from "next/server";

const ADMIN_EMAIL = "admin@banhui.com";

export function isAdminRequest(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-auth") || req.nextUrl.searchParams.get("auth");
  return auth === ADMIN_EMAIL;
}

export function getAuthEmail(req: NextRequest): string | null {
  const auth = req.headers.get("x-admin-auth") || req.nextUrl.searchParams.get("auth");
  if (auth === ADMIN_EMAIL) return ADMIN_EMAIL;
  return null;
}

