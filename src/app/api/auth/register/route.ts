import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, loadDB, saveDB } from "@/lib/db";
import { checkRequestRateLimit } from "@/lib/rate-limit";
import { hashPasswordSecure } from "@/lib/password";
import { isSameOriginRequest } from "@/lib/request-security";

function genId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function isValidEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) return NextResponse.json({ ok: false, msg: "非法来源请求" }, { status: 403 });

  const limited = checkRequestRateLimit(req, "auth-register", 5, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ ok: false, msg: "注册请求过于频繁，请稍后再试" }, { status: 429, headers: { "Retry-After": String(limited.retryAfter) } });
  }

  try {
    const { nickname, email, password } = await req.json();
    if (!nickname || !email || !password) return NextResponse.json({ ok: false, msg: "请填写所有字段" }, { status: 400 });
    if (!isValidEmail(email)) return NextResponse.json({ ok: false, msg: "邮箱格式不正确" }, { status: 400 });
    if (String(nickname).length > 40) return NextResponse.json({ ok: false, msg: "昵称过长" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ ok: false, msg: "密码至少8位" }, { status: 400 });
    if (findUserByEmail(email)) return NextResponse.json({ ok: false, msg: "该邮箱已注册" }, { status: 409 });

    const db = loadDB();
    const user = {
      id: genId(),
      phone_email: email,
      nickname,
      password_hash: hashPasswordSecure(password),
      role_type: "user",
      membership_level: "free",
      points_balance: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.users.push(user as any);
    saveDB();

    return NextResponse.json({
      ok: true,
      user: { id: user.id, nickname: user.nickname, email: user.phone_email, membership_level: user.membership_level, points_balance: user.points_balance }
    });
  } catch {
    return NextResponse.json({ ok: false, msg: "请求错误" }, { status: 400 });
  }
}
