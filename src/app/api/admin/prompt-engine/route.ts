import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getPromptEngineConfig, getPromptEngineMeta, savePromptEngineConfig } from "@/lib/prompt-engine";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
  return NextResponse.json({ ok: true, config: getPromptEngineConfig(), meta: getPromptEngineMeta() });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
  try {
    const body = await req.json();
    const config = savePromptEngineConfig(body || {});
    return NextResponse.json({ ok: true, msg: "Prompt 引擎配置已保存", config, meta: getPromptEngineMeta() });
  } catch {
    return NextResponse.json({ ok: false, msg: "保存失败，请检查 JSON 格式" }, { status: 400 });
  }
}
