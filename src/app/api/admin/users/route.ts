import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
  const users = getAllUsers().map(u => ({ id: u.id, nickname: u.nickname, email: u.phone_email, role: u.role_type, membership: u.membership_level, points: u.points_balance, created_at: u.created_at }));
  return NextResponse.json({ ok: true, users });
}

