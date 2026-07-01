import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { loadDB, saveDB, addPointsLog } from "@/lib/db";

export type BindingStatus = "pending" | "bound" | "expired";

export interface WechatBindingRecord {
  id: string;
  user_id: string;
  user_email: string;
  code: string;
  status: BindingStatus;
  openid?: string;
  created_at: string;
  expires_at: string;
  bound_at?: string;
}

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

const BINDINGS_FILE = path.join(getDataDir(), "wechat-bindings.json");
const CODE_PREFIX = "BH";
const CODE_TTL_MS = 24 * 60 * 60 * 1000;

export function getWechatRewardPoints(): number {
  const n = Number(process.env.WECHAT_BIND_REWARD_POINTS || "10");
  return Number.isFinite(n) && n > 0 ? Math.min(Math.floor(n), 100) : 10;
}

function readBindings(): WechatBindingRecord[] {
  try {
    if (!fs.existsSync(BINDINGS_FILE)) return [];
    const data = JSON.parse(fs.readFileSync(BINDINGS_FILE, "utf-8"));
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

function writeBindings(list: WechatBindingRecord[]) {
  fs.writeFileSync(BINDINGS_FILE, JSON.stringify(list.slice(-5000), null, 2), "utf-8");
}

function genId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

function genCode(): string {
  const raw = crypto.randomBytes(4).toString("hex").toUpperCase();
  return CODE_PREFIX + raw.slice(0, 6);
}

function isExpired(rec: WechatBindingRecord) {
  return new Date(rec.expires_at).getTime() < Date.now();
}

export function getBindingForUser(userId: string) {
  const db = loadDB();
  const user = db.users.find((u: any) => u.id === userId) as any;
  const bindings = readBindings();
  const latest = bindings.filter(b => b.user_id === userId).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0];
  const bound = Boolean(user?.wechat_openid || latest?.status === "bound");
  return {
    bound,
    openid_tail: user?.wechat_openid ? String(user.wechat_openid).slice(-6) : latest?.openid ? String(latest.openid).slice(-6) : "",
    code: !bound && latest && latest.status === "pending" && !isExpired(latest) ? latest.code : "",
    expires_at: !bound && latest && latest.status === "pending" && !isExpired(latest) ? latest.expires_at : "",
    reward_points: getWechatRewardPoints(),
  };
}

export function createBindingCode(userId: string, email: string) {
  const db = loadDB();
  const user = db.users.find((u: any) => u.id === userId) as any;
  if (user?.wechat_openid) return getBindingForUser(userId);

  const bindings = readBindings().map(b => (b.status === "pending" && isExpired(b) ? { ...b, status: "expired" as BindingStatus } : b));
  const existing = bindings.find(b => b.user_id === userId && b.status === "pending" && !isExpired(b));
  if (existing) { writeBindings(bindings); return getBindingForUser(userId); }

  let code = genCode();
  while (bindings.some(b => b.code === code && b.status === "pending" && !isExpired(b))) code = genCode();

  bindings.push({
    id: genId(), user_id: userId, user_email: email, code, status: "pending",
    created_at: new Date().toISOString(), expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
  });
  writeBindings(bindings);
  return getBindingForUser(userId);
}

export function bindWechatByCode(codeInput: string, openid: string) {
  const code = String(codeInput || "").trim().toUpperCase();
  if (!code) return { ok: false, msg: "绑定码为空" };
  if (!openid) return { ok: false, msg: "无法识别微信用户" };

  const db = loadDB();
  const sameOpenidUser = db.users.find((u: any) => u.wechat_openid === openid) as any;
  if (sameOpenidUser) return { ok: false, msg: "该微信已领取过内测额度，不能重复领取。" };

  const bindings = readBindings().map(b => (b.status === "pending" && isExpired(b) ? { ...b, status: "expired" as BindingStatus } : b));
  const idx = bindings.findIndex(b => b.code === code && b.status === "pending" && !isExpired(b));
  if (idx < 0) { writeBindings(bindings); return { ok: false, msg: "绑定码无效或已过期，请回到网站重新生成。" }; }

  const rec = bindings[idx];
  const uidx = db.users.findIndex((u: any) => u.id === rec.user_id);
  if (uidx < 0) return { ok: false, msg: "未找到对应网站账号，请重新生成绑定码。" };
  const user: any = db.users[uidx];
  if (user.wechat_openid) return { ok: false, msg: "该网站账号已绑定公众号。" };

  const rewardPoints = getWechatRewardPoints();
  db.users[uidx] = {
    ...user,
    wechat_openid: openid,
    wechat_bound_at: new Date().toISOString(),
    points_balance: (user.points_balance || 0) + rewardPoints,
    updated_at: new Date().toISOString(),
  };
  bindings[idx] = { ...rec, status: "bound", openid, bound_at: new Date().toISOString() };
  saveDB();
  writeBindings(bindings);
  addPointsLog({ user_id: rec.user_id, action_type: "wechat_bind_reward", points_change: rewardPoints });
  return { ok: true, msg: `绑定成功，已为网站账号增加 ${rewardPoints} 次内测生成额度。`, user_id: rec.user_id, reward_points: rewardPoints };
}
