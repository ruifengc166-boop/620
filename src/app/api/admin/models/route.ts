import { NextRequest, NextResponse } from "next/server";
import { getModelConfigs, updateModelConfig } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
  return NextResponse.json({ ok: true, models: getModelConfigs() });
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
    const { provider, api_key, is_active, system_prompt, temperature } = await req.json();
    if (provider) updateModelConfig(provider, { api_key, is_active, system_prompt, temperature });
    return NextResponse.json({ ok: true, msg: "模型配置已更新" });
  } catch { return NextResponse.json({ ok: false, msg: "配置失败" }, { status: 400 }); }
}