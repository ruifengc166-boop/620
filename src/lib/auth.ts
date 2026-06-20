
export interface StoredUser { id: string; nickname: string; email: string; password: string; membership_level?: string; points_balance?: number; }

export interface Session {
  userId: string;
  nickname: string;
  email: string;
  token: string;
  membership_level?: string;
  points_balance?: number;
}

const USERS_KEY = "banhui_users";
const SESSION_KEY = "banhui_session";

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function genId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

export function register(nickname: string, email: string, password: string): { ok: boolean; msg: string } {
  const users = getUsers();
  if (users.find(u => u.email === email)) return { ok: false, msg: "该邮箱已注册" };
  if (password.length < 4) return { ok: false, msg: "密码至少4位" };
  users.push({ id: genId(), nickname, email, password });
  saveUsers(users);
  return { ok: true, msg: "注册成功" };
}

export function login(email: string, password: string): { ok: boolean; msg: string; session?: Session } {
  // Check hardcoded admin account
  if (email === "admin@banhui.com" && password === "admin@2026!") {
    const session: Session = { userId: "admin", nickname: "管理员", email: "admin@banhui.com", token: genId() + genId(), membership_level: "admin", points_balance: 99999 };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, msg: "管理员登录成功", session };
  }
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return { ok: false, msg: "邮箱未注册" };
  if (user.password !== password) return { ok: false, msg: "密码错误" };
  const session: Session = { userId: user.id, nickname: user.nickname, email: user.email, token: genId() + genId(), membership_level: user.membership_level, points_balance: user.points_balance };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, msg: "登录成功", session };
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




