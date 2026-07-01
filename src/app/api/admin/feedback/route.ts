import fs from "fs";
import path from "path";
import os from "os";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

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

function readFeedback() {
  try {
    if (!fs.existsSync(FEEDBACK_FILE)) return [];
    const list = JSON.parse(fs.readFileSync(FEEDBACK_FILE, "utf-8"));
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
  const list = readFeedback().sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 300);
  const summary = list.reduce((acc: any, item: any) => {
    acc.total += 1;
    acc[item.rating] = (acc[item.rating] || 0) + 1;
    for (const r of item.reasons || []) acc.reasons[r] = (acc.reasons[r] || 0) + 1;
    return acc;
  }, { total: 0, good: 0, ok: 0, bad: 0, reasons: {} });
  return NextResponse.json({ ok: true, feedback: list, summary });
}
