import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, getAllGenerations } from "@/lib/db";

const planLimits: Record<string, number> = { free: 10, pro: 50, expert: 200, admin: 9999 };

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ ok: false, msg: "需要email" }, { status: 400 });
  if (email === "admin@banhui.com") return NextResponse.json({ ok: true, today: 0, daily_limit: 9999, remaining: 9999 });
  const user = findUserByEmail(email);
  if (!user) return NextResponse.json({ ok: false, msg: "用户不存在" }, { status: 404 });
  const today = new Date().toISOString().slice(0, 10);
  const gens = getAllGenerations().filter((g: any) => g.user_id === user.id && g.created_at.startsWith(today));
  const limit = planLimits[user.membership_level] || 10;
  return NextResponse.json({ ok: true, today: gens.length, daily_limit: limit, remaining: Math.max(0, limit - gens.length) });
}
