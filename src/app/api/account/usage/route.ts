import { NextRequest, NextResponse } from "next/server";
import { findUserById, getAllGenerations } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/server-auth";

const planLimits: Record<string, number> = { free: 10, pro: 50, expert: 200, admin: 9999 };

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, msg: "请先登录" }, { status: 401 });
  if (session.role === "admin") return NextResponse.json({ ok: true, today: 0, daily_limit: 9999, remaining: 9999, points_balance: 99999 });

  const user = findUserById(session.userId);
  if (!user) return NextResponse.json({ ok: false, msg: "用户不存在" }, { status: 404 });
  const today = new Date().toISOString().slice(0, 10);
  const gens = getAllGenerations().filter((g: any) => g.user_id === user.id && g.created_at.startsWith(today));
  const limit = planLimits[user.membership_level] || 10;
  const dailyRemaining = Math.max(0, limit - gens.length);
  const pointRemaining = Math.max(0, user.points_balance || 0);
  return NextResponse.json({ ok: true, today: gens.length, daily_limit: limit, remaining: Math.min(dailyRemaining, pointRemaining), points_balance: pointRemaining });
}
