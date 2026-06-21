import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, msg: "未登录" }, { status: 401 });
  return NextResponse.json({
    ok: true,
    user: {
      id: session.userId,
      nickname: session.nickname,
      email: session.email,
      membership_level: session.membership_level,
      points_balance: session.points_balance,
      role: session.role,
    }
  });
}
