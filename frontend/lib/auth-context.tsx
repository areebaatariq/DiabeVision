"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as api from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "medical_professional" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, name?: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("retinacheck_token");
    const storedUser = localStorage.getItem("retinacheck_user");
    if (token && storedUser) {
      api
        .getMe()
        .then(({ user: me }) => {
          setUser(me);
          localStorage.setItem("retinacheck_user", JSON.stringify(me));
        })
        .catch(() => {
          localStorage.removeItem("retinacheck_token");
          localStorage.removeItem("retinacheck_user");
        })
        .finally(() => setIsLoading(false));
    } else {
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("retinacheck_user");
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, _name?: string) => {
    const { user: u, token } = await api.login(email, password);
    setUser(u);
    localStorage.setItem("retinacheck_token", token);
    localStorage.setItem("retinacheck_user", JSON.stringify(u));
    router.push("/dashboard");
  };

  const register = async (name: string, email: string, password: string) => {
    const { user: u, token } = await api.register(name, email, password);
    setUser(u);
    localStorage.setItem("retinacheck_token", token);
    localStorage.setItem("retinacheck_user", JSON.stringify(u));
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("retinacheck_token");
    localStorage.removeItem("retinacheck_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
