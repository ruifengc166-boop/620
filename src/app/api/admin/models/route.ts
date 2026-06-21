import { NextRequest, NextResponse } from "next/server";
import { getModelConfigs, updateModelConfig } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

function maskKey(key?: string) {
  if (!key) return "";
  if (key.length <= 8) return "********";
  return `${key.slice(0, 4)}****${key.slice(-4)}`;
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
  const models = getModelConfigs().map((m: any) => ({
    ...m,
    api_key: "",
    has_api_key: !!m.api_key,
    masked_api_key: maskKey(m.api_key),
  }));
  return NextResponse.json({ ok: true, models });
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
    const body = await req.json();
    const { provider } = body;
    const updates: Record<string, any> = {};
    if (body.api_key !== undefined && String(body.api_key).trim()) updates.api_key = body.api_key;
    if (body.api_url !== undefined) updates.api_url = body.api_url;
    if (body.is_active !== undefined) updates.is_active = body.is_active;
    if (body.system_prompt !== undefined) updates.system_prompt = body.system_prompt;
    if (body.temperature !== undefined) updates.temperature = body.temperature;
    if (provider && Object.keys(updates).length > 0) updateModelConfig(provider, updates);
    return NextResponse.json({ ok: true, msg: "模型配置已更新" });
  } catch {
    return NextResponse.json({ ok: false, msg: "配置失败" }, { status: 400 });
  }
}
