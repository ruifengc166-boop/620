import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getStats } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
  return NextResponse.json({ ok: true, stats: getStats() });
}

