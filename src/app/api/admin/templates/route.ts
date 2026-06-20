import { NextRequest, NextResponse } from "next/server";
import { getAllTemplatesAdmin, upsertTemplate, loadDB, saveDB } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
  const templates = getAllTemplatesAdmin();
  return NextResponse.json({ ok: true, templates });
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
    const data = await req.json();
    upsertTemplate(data);
    return NextResponse.json({ ok: true, msg: "模板已保存" });
  } catch { return NextResponse.json({ ok: false, msg: "保存失败" }, { status: 400 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
    const { id } = await req.json();
    const db = loadDB();
    db.templates = db.templates.filter((t: any) => t.id !== id);
    saveDB();
    return NextResponse.json({ ok: true, msg: "模板已删除" });
  } catch { return NextResponse.json({ ok: false, msg: "删除失败" }, { status: 400 }); }
}