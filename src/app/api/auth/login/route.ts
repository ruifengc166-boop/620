import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { findUserByEmail, loadDB, saveDB } from "@/lib/db";
import { setSessionCookie } from "@/lib/server-auth";
import { checkRequestRateLimit } from "@/lib/rate-limit";
import { hashPasswordSecure, isLegacyPasswordHash, verifyPasswordSecure } from "@/lib/password";
import { isSameOriginRequest } from "@/lib/request-security";

function sha256(v: string) {
  return crypto.createHash("sha256").update(v).digest("hex");
}

function verifyAdmin(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || email !== adminEmail) return false;
  if (adminPasswordHash) return sha256(password) === adminPasswordHash;
  if (adminPassword) return password === adminPassword;
  return false;
}

function maybeUpgradePasswordHash(userId: string, password: string, currentHash: string) {
  if (!isLegacyPasswordHash(currentHash)) return;
  const db = loadDB();
  const idx = db.users.findIndex((u: any) => u.id === userId);
  if (idx >= 0) {
    db.users[idx].password_hash = hashPasswordSecure(password);
    db.users[idx].updated_at = new Date().toISOString();
    saveDB();
  }
}

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) return NextResponse.json({ ok: false, msg: "非法来源请求" }, { status: 403 });

  const limited = checkRequestRateLimit(req, "auth-login", 20, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ ok: false, msg: "登录请求过于频繁，请稍后再试" }, { status: 429, headers: { "Retry-After": String(limited.retryAfter) } });
  }

  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ ok: false, msg: "请填写邮箱和密码" }, { status: 400 });

    if (verifyAdmin(email, password)) {
      const user = { id: "admin", nickname: "管理员", email, membership_level: "admin", points_balance: 99999 };
      const res = NextResponse.json({ ok: true, user });
      setSessionCookie(res, { userId: user.id, email: user.email, nickname: user.nickname, role: "admin", membership_level: "admin", points_balance: 99999 });
      return res;
    }

    const user = findUserByEmail(email);
    if (!user) return NextResponse.json({ ok: false, msg: "邮箱未注册" }, { status: 401 });
    if (!verifyPasswordSecure(user.password_hash, password)) return NextResponse.json({ ok: false, msg: "密码错误" }, { status: 401 });
    maybeUpgradePasswordHash(user.id, password, user.password_hash);

    const publicUser = {
      id: user.id,
      nickname: user.nickname,
      email: user.phone_email,
      membership_level: user.membership_level,
      points_balance: user.points_balance,
    };
    const res = NextResponse.json({ ok: true, user: publicUser });
    setSessionCookie(res, { userId: user.id, email: user.phone_email, nickname: user.nickname, role: "user", membership_level: user.membership_level, points_balance: user.points_balance });
    return res;
  } catch {
    return NextResponse.json({ ok: false, msg: "请求错误" }, { status: 400 });
  }
}
