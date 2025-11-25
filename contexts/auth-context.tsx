"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { authenticateUser } from "@/app/actions/auth";
import { signIn, signOut } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "administrator" | "lead" | "user";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  ssoLogin: () => Promise<void>;
  ssoLogout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("intranet-user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("[v0] Error parsing stored user:", error);
        localStorage.removeItem("intranet-user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("[v0] Login attempt for email:", email);

    try {
      // Authenticate user against database
      const result = await authenticateUser(email, password);

      if (result.success && result.user) {
        console.log("[v0] Authentication successful for:", email);

        // Create user object
        const authenticatedUser: User = {
          id: result.user.email, // Use email as ID
          name: result.user.name || result.user.email,
          email: result.user.email,
          role: result.user.role,
          avatar: "/placeholder.svg",
        };

        // Store user in state and localStorage
        setUser(authenticatedUser);
        localStorage.setItem("intranet-user", JSON.stringify(authenticatedUser));

        return true;
      } else {
        console.log("[v0] Authentication failed:", result.error);
        return false;
      }
    } catch (error) {
      console.error("[v0] Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("intranet-user");
  };

  const ssoLogin = async () => {
    await signIn("microsoft-entra-id");
  };

  const ssoLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const isAdmin = () => {
    return user?.role === "administrator";
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return <AuthContext.Provider value={{ user, login, logout, ssoLogin, ssoLogout, isAdmin, isAuthenticated }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
