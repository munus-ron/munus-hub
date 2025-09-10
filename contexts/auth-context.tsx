"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: () => boolean
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "admin@company.com",
    role: "admin",
    avatar: "/professional-headshot.png",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "user@company.com",
    role: "user",
    avatar: "/ceo-headshot.png",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("intranet-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const foundUser = mockUsers.find((u) => u.email === email)

    if (foundUser && password === "password") {
      setUser(foundUser)
      localStorage.setItem("intranet-user", JSON.stringify(foundUser))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("intranet-user")
  }

  const isAdmin = () => {
    return user?.role === "admin"
  }

  const isAuthenticated = () => {
    return user !== null
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isAuthenticated }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
