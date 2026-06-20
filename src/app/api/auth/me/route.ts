import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const userId = req.headers.get("x-user-id");
  
  if (!email && !userId) return NextResponse.json({ ok: false, msg: "需要email或userId参数" }, { status: 400 });
  
  // Require at least one identifying parameter
  const searchEmail = email || "";
  if (!searchEmail) return NextResponse.json({ ok: false, msg: "需要email参数" }, { status: 400 });
  
  const user = findUserByEmail(searchEmail);
  if (!user) return NextResponse.json({ ok: false, msg: "用户不存在" }, { status: 404 });
  return NextResponse.json({
    ok: true, user: { id: user.id, nickname: user.nickname, email: user.phone_email,
      membership_level: user.membership_level, points_balance: user.points_balance }
  });
}