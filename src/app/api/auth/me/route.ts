import { NextRequest, NextResponse } from "next/server";
import { findUserById } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, msg: "未登录" }, { status: 401 });

  if (session.role === "admin") {
    return NextResponse.json({ ok: true, user: { id: session.userId, nickname: session.nickname, email: session.email, membership_level: "admin", points_balance: 99999, role: "admin" } });
  }

  const user = findUserById(session.userId);
  if (!user) return NextResponse.json({ ok: false, msg: "用户不存在" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      nickname: user.nickname,
      email: user.phone_email,
      membership_level: user.membership_level,
      points_balance: user.points_balance,
      role: "user",
    }
  });
}
