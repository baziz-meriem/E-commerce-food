"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch, getStoredToken } from "@/lib/api";

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  branchId: string | null;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (p: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    const t = getStoredToken();
    if (!t) {
      setUser(null);
      setToken(null);
      return;
    }
    setToken(t);
    const u = await apiFetch<User>("/auth/me", { token: t });
    setUser(u);
  }, []);

  useEffect(() => {
    refreshMe()
      .catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, [refreshMe]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch<{ accessToken: string; user: User }>(
      "/auth/login",
      { method: "POST", json: { email, password } },
    );
    localStorage.setItem("token", res.accessToken);
    setToken(res.accessToken);
    setUser(res.user);
  }, []);

  const register = useCallback(
    async (p: {
      email: string;
      password: string;
      name: string;
      phone?: string;
    }) => {
      const res = await apiFetch<{ accessToken: string; user: User }>(
        "/auth/register",
        { method: "POST", json: p },
      );
      localStorage.setItem("token", res.accessToken);
      setToken(res.accessToken);
      setUser(res.user);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      refreshMe,
    }),
    [user, token, loading, login, register, logout, refreshMe],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth outside AuthProvider");
  return v;
}

export function useOptionalAuth() {
  return useContext(Ctx);
}
