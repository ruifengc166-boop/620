import fs from "fs";
import path from "path";
import os from "os";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { loadDB, saveDB } from "@/lib/db";

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

const DATA_DIR = getDataDir();
const DB_FILE = path.join(DATA_DIR, "db.json");
const PROMPT_FILE = path.join(DATA_DIR, "prompt-engine.private.json");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");
const WECHAT_BINDINGS_FILE = path.join(DATA_DIR, "wechat-bindings.json");
const BACKUP_DIR = path.join(DATA_DIR, "backups");

function safeStat(file: string) {
  try {
    const stat = fs.statSync(file);
    return { exists: true, size: stat.size, updated_at: stat.mtime.toISOString() };
  } catch { return { exists: false, size: 0, updated_at: null }; }
}

function listBackups() {
  try {
    if (!fs.existsSync(BACKUP_DIR)) return [];
    return fs.readdirSync(BACKUP_DIR)
      .filter(f => f.endsWith(".json"))
      .map(f => ({ name: f, ...safeStat(path.join(BACKUP_DIR, f)) }))
      .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
      .slice(0, 30);
  } catch { return []; }
}

function snapshotFile(src: string, label: string, stamp: string) {
  if (!fs.existsSync(src)) return null;
  const dest = path.join(BACKUP_DIR, `${stamp}-${label}.json`);
  fs.copyFileSync(src, dest);
  return path.basename(dest);
}

function backupNow() {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const files = [
    snapshotFile(DB_FILE, "db", stamp),
    snapshotFile(PROMPT_FILE, "prompt-engine", stamp),
    snapshotFile(FEEDBACK_FILE, "feedback", stamp),
    snapshotFile(WECHAT_BINDINGS_FILE, "wechat-bindings", stamp),
  ].filter(Boolean);
  return files;
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
  const db = loadDB();
  return NextResponse.json({
    ok: true,
    generation_paused: String(db.site_content?.generation_paused || "false") === "true",
    files: {
      db: safeStat(DB_FILE),
      prompt: safeStat(PROMPT_FILE),
      feedback: safeStat(FEEDBACK_FILE),
      wechat_bindings: safeStat(WECHAT_BINDINGS_FILE),
    },
    backups: listBackups(),
  });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, msg: "未授权" }, { status: 401 });
  try {
    const body = await req.json();
    if (body.action === "set_generation_paused") {
      const db = loadDB();
      if (!db.site_content) db.site_content = {};
      db.site_content.generation_paused = body.paused ? "true" : "false";
      saveDB();
      return NextResponse.json({ ok: true, msg: body.paused ? "已暂停普通用户生成" : "已恢复普通用户生成" });
    }
    if (body.action === "backup") {
      const files = backupNow();
      return NextResponse.json({ ok: true, msg: `已备份 ${files.length} 个文件`, files, backups: listBackups() });
    }
    return NextResponse.json({ ok: false, msg: "未知操作" }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false, msg: "操作失败" }, { status: 400 });
  }
}
