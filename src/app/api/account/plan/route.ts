import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, loadDB, saveDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ ok: false, msg: "需要email" }, { status: 400 });
  if (email === "admin@banhui.com") return NextResponse.json({ ok: true, plan: "admin", points: 99999, email });
  const user = findUserByEmail(email);
  if (!user) return NextResponse.json({ ok: false, msg: "用户不存在" }, { status: 404 });
  return NextResponse.json({ ok: true, plan: user.membership_level, points: user.points_balance, email: user.phone_email });
}

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json();
    if (!email || !plan) return NextResponse.json({ ok: false, msg: "缺少参数" }, { status: 400 });
    if (email === "admin@banhui.com") return NextResponse.json({ ok: true, msg: "管理员无需更改套餐" });
    const db = loadDB();
    const idx = db.users.findIndex((u: any) => u.phone_email === email);
    if (idx < 0) return NextResponse.json({ ok: false, msg: "用户不存在" }, { status: 404 });
    db.users[idx].membership_level = plan;
    saveDB();
    return NextResponse.json({ ok: true, msg: "套餐已更新" });
  } catch { return NextResponse.json({ ok: false, msg: "更新失败" }, { status: 500 }); }
}
