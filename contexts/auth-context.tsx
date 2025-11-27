"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { authenticateUser } from "@/app/actions/auth";
import { signIn, signOut, useSession } from "next-auth/react";
import router from "next/router";

interface User {
  id: string;
  name: string;
  email: string;
  role: "administrator" | "lead" | "user";
  avatar?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  ssoLogin: () => Promise<void>;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: session, status } = useSession();

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

  useEffect(() => {
    // This catches users logging in via SSO.
    if (status === "authenticated" && !user && session?.user && !isLoggingOut) {
      const nextAuthUser = session.user as any;
      const ssoUser: User = {
        id: nextAuthUser.dbUserId || nextAuthUser.email,
        name: nextAuthUser.name || nextAuthUser.email,
        email: nextAuthUser.email,
        role: nextAuthUser.role,
        avatar: nextAuthUser.avatar || "/placeholder.svg",
        provider: nextAuthUser.provider || "sso",
      };

      console.log("[v1] SSO Sync: Updating local context state.");

      // 3. Manually update state and localStorage to match the SSO session
      setUser(ssoUser);
      localStorage.setItem("intranet-user", JSON.stringify(ssoUser));
    }
  }, [status, session, user, setUser, isLoggingOut]);

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

  const logout = async () => {
    setIsLoggingOut(true);
    // Check if the user object was created via SSO (manual sync) or Credential
    const isSSO = user?.provider === "microsoft-entra-id" || user?.provider === "sso";

    // 1. Clear local state first
    setUser(null);
    localStorage.removeItem("intranet-user");

    // 2. Call NextAuth signOut to clear cookies
    await signOut({ redirect: false });

    await new Promise((resolve) => setTimeout(resolve, 50));

    if (isSSO) {
      // 3. Remote SSO Logout (Microsoft Entra ID)
      const tenantId = process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID;
      const postLogoutRedirectUri = encodeURIComponent(`${window.location.origin}/`);
      const logoutUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutRedirectUri}`;
      window.location.href = logoutUrl;
    } else {
      window.location.href = "/";
    }
  };

  const ssoLogin = async () => {
    console.log("[v0] Initiating SSO redirect to Microsoft...");

    try {
      await signIn("microsoft-entra-id", {
        // callbackUrl: "/dashboard",
      });

      console.log("[v0] Redirect initiated.");
    } catch (error) {
      console.error("[v0] SSO sign-in failed during redirect initiation:", error);
    }
  };

  const isAdmin = () => {
    return user?.role === "administrator";
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return <AuthContext.Provider value={{ user, login, logout, ssoLogin, isAdmin, isAuthenticated }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
