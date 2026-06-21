
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (s) setUser(s);
    setReady(true);
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

