import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { nickname, email, password } = await req.json();
    if (!nickname || !email || !password) return NextResponse.json({ ok: false, msg: "请填写所有字段" }, { status: 400 });
    if (password.length < 4) return NextResponse.json({ ok: false, msg: "密码至少4位" }, { status: 400 });
    if (findUserByEmail(email)) return NextResponse.json({ ok: false, msg: "该邮箱已注册" }, { status: 409 });
    const user = createUser(nickname, email, password);
    return NextResponse.json({
      ok: true, user: { id: user.id, nickname: user.nickname, email: user.phone_email,
        membership_level: user.membership_level, points_balance: user.points_balance }
    });
  } catch { return NextResponse.json({ ok: false, msg: "请求错误" }, { status: 400 }); }
}

