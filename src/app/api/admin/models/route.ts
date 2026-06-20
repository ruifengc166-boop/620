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
    const body = await req.json();
    const { provider } = body;
    const updates: Record<string, any> = {};
    if (body.api_key !== undefined) updates.api_key = body.api_key;
    if (body.is_active !== undefined) updates.is_active = body.is_active;
    if (body.system_prompt !== undefined) updates.system_prompt = body.system_prompt;
    if (body.temperature !== undefined) updates.temperature = body.temperature;
    if (provider && Object.keys(updates).length > 0) updateModelConfig(provider, updates);
    return NextResponse.json({ ok: true, msg: "模型配置已更新" });
  } catch { return NextResponse.json({ ok: false, msg: "配置失败" }, { status: 400 }); }
}