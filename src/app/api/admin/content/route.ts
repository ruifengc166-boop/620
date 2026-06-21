import { NextRequest, NextResponse } from "next/server";
import { loadDB, saveDB } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  // Public - no auth required (frontend needs to read site content)
  const db = loadDB();
  return NextResponse.json({ ok: true, content: db.site_content || {} });
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
    const { key, value } = await req.json();
    if (!key) return NextResponse.json({ ok: false, msg: "缺少key" }, { status: 400 });
    const db = loadDB();
    if (!db.site_content) db.site_content = {};
    db.site_content[key] = value;
    saveDB();
    return NextResponse.json({ ok: true, msg: "已保存" });
  } catch { return NextResponse.json({ ok: false, msg: "保存失败" }, { status: 400 }); }
}
