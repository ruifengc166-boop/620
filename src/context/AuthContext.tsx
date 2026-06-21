"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { login as authLogin, register as authRegister, logout as authLogout, getSession, type Session } from "@/lib/auth";

interface AuthContextType {
  user: Session | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; msg: string }>;
  register: (nickname: string, email: string, password: string) => Promise<{ ok: boolean; msg: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ ok: false, msg: "" }),
  register: async () => ({ ok: false, msg: "" }),
  logout: () => {},
  isAuthenticated: false,
});

function toSession(u: any): Session {
  return {
    userId: u.id,
    nickname: u.nickname,
    email: u.email,
    token: "server-session",
    membership_level: u.membership_level,
    points_balance: u.points_balance,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const local = getSession();
    if (local) setUser(local);
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.ok && d.user) {
          const s = toSession(d.user);
          localStorage.setItem("banhui_session", JSON.stringify(s));
          setUser(s);
        } else {
          localStorage.removeItem("banhui_session");
          localStorage.removeItem("banhui_admin");
          setUser(null);
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authLogin(email, password);
    if (res.ok && res.session) setUser(res.session);
    return { ok: res.ok, msg: res.msg };
  }, []);

  const register = useCallback(async (nickname: string, email: string, password: string) => {
    const res = await authRegister(nickname, email, password);
    return { ok: res.ok, msg: res.msg };
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
