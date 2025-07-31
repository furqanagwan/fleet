"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Role = "ADMIN" | "DRIVER";

type User = {
  id: string;
  email: string;
  role: Role;
  mustUpdatePassword?: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("fleet-auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setToken(parsed.token);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    console.log("🔐 Attempting login with:", { email, password });

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("📡 Response status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Login failed. Response:", text);
      throw new Error("Login failed");
    }

    const data = await res.json();
    console.log("✅ Login succeeded. User:", data.user);

    setUser(data.user);
    setToken(data.access_token);
    localStorage.setItem(
      "fleet-auth",
      JSON.stringify({ user: data.user, token: data.access_token }),
    );

    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fleet-auth");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
