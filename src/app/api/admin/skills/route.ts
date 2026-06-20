import { NextRequest, NextResponse } from "next/server";
import { getLearnedExamples, createLearnedExample, deleteLearnedExample, autoGenerateSkillFromExample } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
  return NextResponse.json({ ok: true, examples: getLearnedExamples() });
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
    const { action, name, source_content, id, updates } = await req.json();
    
    if (action === "auto_generate" && source_content && name) {
      const example = autoGenerateSkillFromExample(source_content, name);
      return NextResponse.json({ ok: true, example, msg: "技能已自动生成" });
    }
    
    if (action === "update" && id && updates) {
      const { updateLearnedExample } = await import("@/lib/db");
      updateLearnedExample(id, updates);
      return NextResponse.json({ ok: true, msg: "已更新" });
    }
    
    if (name && source_content) {
      const example = createLearnedExample({ name, source_content, source_type: "manual" });
      return NextResponse.json({ ok: true, example, msg: "范本已保存" });
    }
    
    return NextResponse.json({ ok: false, msg: "缺少参数" }, { status: 400 });
  } catch { return NextResponse.json({ ok: false, msg: "操作失败" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
    const { id } = await req.json();
    deleteLearnedExample(id);
    return NextResponse.json({ ok: true, msg: "已删除" });
  } catch { return NextResponse.json({ ok: false, msg: "删除失败" }, { status: 400 }); }
}