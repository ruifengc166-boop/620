import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/server-auth";
import { checkRequestRateLimit } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/request-security";
import { createBindingCode, getBindingForUser } from "@/lib/wechat-binding";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, msg: "请先登录" }, { status: 401 });
  return NextResponse.json({ ok: true, ...getBindingForUser(session.userId) });
}

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) return NextResponse.json({ ok: false, msg: "非法来源请求" }, { status: 403 });
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, msg: "请先登录" }, { status: 401 });

  const limited = checkRequestRateLimit(req, `bind-code:${session.userId}`, 10, 60 * 60 * 1000);
  if (!limited.ok) return NextResponse.json({ ok: false, msg: "绑定码生成过于频繁，请稍后再试" }, { status: 429 });

  const status = createBindingCode(session.userId, session.email);
  return NextResponse.json({ ok: true, ...status });
}
