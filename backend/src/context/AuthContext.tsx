"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api/api";

type User = {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔹 Récupération du profil utilisateur
  async function refreshProfile(): Promise<void> {
    try {
      const res = await api.get("/auth/profile");

      setUser(res.data.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Login
  async function login(email: string, password: string): Promise<void> {
    try {
      const res = await api.post("/auth/login", { email, password });

      setUser(res.data.data.user);
    } catch (err) {
      throw err;
    }
  }

  // 🔹 Register
  async function register(email: string, password: string): Promise<void> {
    try {
      const res = await api.post("/auth/register", { email, password });

      setUser(res.data.data.user);
    } catch (err) {
      throw err;
    }
  }

  // 🔹 Logout
  function logout(): void {
    setUser(null);
  }

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshProfile, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}
