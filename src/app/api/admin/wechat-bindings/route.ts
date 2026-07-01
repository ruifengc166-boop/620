import fs from "fs";
import path from "path";
import os from "os";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { loadDB } from "@/lib/db";

function getDataDir(): string {
  const primary = path.join(process.cwd(), "data");
  try {
    if (!fs.existsSync(primary)) fs.mkdirSync(primary, { recursive: true });
    const test = path.join(primary, ".write-test");
    fs.writeFileSync(test, "");
    fs.unlinkSync(test);
    return primary;
  } catch {
    const fallback = path.join(os.tmpdir(), "banhuigongfang-data");
    if (!fs.existsSync(fallback)) fs.mkdirSync(fallback, { recursive: true });
    return fallback;
  }
}

const BINDINGS_FILE = path.join(getDataDir(), "wechat-bindings.json");

function readBindings(): any[] {
  try {
    if (!fs.existsSync(BINDINGS_FILE)) return [];
    const list = JSON.parse(fs.readFileSync(BINDINGS_FILE, "utf-8"));
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
  const db = loadDB();
  const users = db.users || [];
  const bindings = readBindings();
  const latestByUser = new Map<string, any>();
  for (const b of bindings.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))) {
    if (!latestByUser.has(b.user_id)) latestByUser.set(b.user_id, b);
  }

  const rows = users
    .filter((u: any) => u.role_type !== "admin")
    .map((u: any) => {
      const latest = latestByUser.get(u.id);
      return {
        user_id: u.id,
        nickname: u.nickname,
        email: u.phone_email,
        points_balance: u.points_balance || 0,
        membership_level: u.membership_level || "free",
        bound: Boolean(u.wechat_openid),
        openid_tail: u.wechat_openid ? String(u.wechat_openid).slice(-6) : latest?.openid ? String(latest.openid).slice(-6) : "",
        wechat_bound_at: u.wechat_bound_at || latest?.bound_at || "",
        latest_code: latest?.status === "pending" ? latest.code : "",
        latest_status: latest?.status || (u.wechat_openid ? "bound" : "none"),
        latest_expires_at: latest?.expires_at || "",
        latest_created_at: latest?.created_at || "",
      };
    })
    .sort((a: any, b: any) => String(b.wechat_bound_at || b.latest_created_at || "").localeCompare(String(a.wechat_bound_at || a.latest_created_at || "")));

  const summary = {
    total_users: rows.length,
    bound_users: rows.filter((r: any) => r.bound).length,
    pending_codes: rows.filter((r: any) => r.latest_status === "pending").length,
    binding_records: bindings.length,
  };
  return NextResponse.json({ ok: true, rows, summary });
}
