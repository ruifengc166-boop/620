import fs from "fs";
import path from "path";
import os from "os";
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/server-auth";
import { checkRequestRateLimit } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/request-security";

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

const FEEDBACK_FILE = path.join(getDataDir(), "feedback.json");
const ALLOWED_RATINGS = new Set(["good", "ok", "bad"]);
const ALLOWED_REASONS = new Set(["结构不对", "语言太空", "不够正式", "不够有传播感", "细节太少", "有编造内容", "格式不好复制", "其他"]);

function readList(): any[] {
  try {
    if (!fs.existsSync(FEEDBACK_FILE)) return [];
    const data = JSON.parse(fs.readFileSync(FEEDBACK_FILE, "utf-8"));
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

function writeList(list: any[]) {
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(list.slice(-2000), null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) return NextResponse.json({ ok: false, msg: "非法来源请求" }, { status: 403 });
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, msg: "请先登录" }, { status: 401 });

  const limited = checkRequestRateLimit(req, `feedback:${session.userId}`, 30, 60 * 60 * 1000);
  if (!limited.ok) return NextResponse.json({ ok: false, msg: "反馈过于频繁，请稍后再试" }, { status: 429 });

  try {
    const body = await req.json();
    const rating = String(body.rating || "");
    if (!ALLOWED_RATINGS.has(rating)) return NextResponse.json({ ok: false, msg: "反馈类型无效" }, { status: 400 });
    const reasons = Array.isArray(body.reasons) ? body.reasons.map((r: any) => String(r)).filter((r: string) => ALLOWED_REASONS.has(r)).slice(0, 5) : [];
    const comment = String(body.comment || "").slice(0, 500);
    const record = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      user_id: session.userId,
      user_email: session.email,
      rating,
      reasons,
      comment,
      material_type: String(body.material_type || "").slice(0, 80),
      result_id: String(body.result_id || "").slice(0, 80),
      created_at: new Date().toISOString(),
    };
    const list = readList();
    list.push(record);
    writeList(list);
    return NextResponse.json({ ok: true, msg: "感谢反馈，我们会用于优化生成质量" });
  } catch {
    return NextResponse.json({ ok: false, msg: "反馈提交失败" }, { status: 400 });
  }
}
