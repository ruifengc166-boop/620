import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, verifyPassword } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ ok: false, msg: "请填写邮箱和密码" }, { status: 400 });
    
    // Hardcoded admin account
    if (email === "admin@banhui.com" && password === "admin@2026!") {
      return NextResponse.json({ ok: true, user: { id: "admin", nickname: "管理员", email: "admin@banhui.com", membership_level: "admin", points_balance: 99999 } });
    }
    
    const user = findUserByEmail(email);
    if (!user) return NextResponse.json({ ok: false, msg: "邮箱未注册" }, { status: 401 });
    if (!verifyPassword(user, password)) return NextResponse.json({ ok: false, msg: "密码错误" }, { status: 401 });
    return NextResponse.json({
      ok: true, user: { id: user.id, nickname: user.nickname, email: user.phone_email,
        membership_level: user.membership_level, points_balance: user.points_balance }
    });
  } catch { return NextResponse.json({ ok: false, msg: "请求错误" }, { status: 400 }); }
}
