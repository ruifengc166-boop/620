import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/server-auth";
import { isSameOriginRequest } from "@/lib/request-security";

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) return NextResponse.json({ ok: false, msg: "非法来源请求" }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}
