"use client";

export interface Session {
  userId: string;
  nickname: string;
  email: string;
  token: string;
  membership_level?: string;
  points_balance?: number;
}

const SESSION_KEY = "banhui_session";

function genId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

export async function register(nickname: string, email: string, password: string): Promise<{ ok: boolean; msg: string }> {
  try {
    const r = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, email, password }),
    });
    const d = await r.json();
    return { ok: d.ok, msg: d.msg || (d.ok ? "注册成功" : "注册失败") };
  } catch { return { ok: false, msg: "网络错误" }; }
}

export async function login(email: string, password: string): Promise<{ ok: boolean; msg: string; session?: Session }> {
  try {
    const r = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const d = await r.json();
    if (d.ok && d.user) {
      const session: Session = {
        userId: d.user.id, nickname: d.user.nickname, email: d.user.email,
        token: genId() + genId(),
        membership_level: d.user.membership_level || "free",
        points_balance: d.user.points_balance || 0,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { ok: true, msg: "登录成功", session };
    }
    return { ok: false, msg: d.msg || "登录失败" };
  } catch { return { ok: false, msg: "网络错误" }; }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}