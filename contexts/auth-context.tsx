"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  avatar?: string
  password?: string
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
    password: "password",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "user@company.com",
    role: "user",
    avatar: "/ceo-headshot.png",
    password: "password",
  },
]

function loadUsersFromStorage(): User[] {
  try {
    const storedUsers = localStorage.getItem("admin-users")
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers)
      // Combine static users with stored users, avoiding duplicates
      const allUsers = [...mockUsers]
      parsedUsers.forEach((storedUser: any) => {
        if (!allUsers.find((u) => u.email === storedUser.email)) {
          allUsers.push({
            id: storedUser.id,
            name: storedUser.name,
            email: storedUser.email,
            role: storedUser.role as "admin" | "user",
            avatar: storedUser.avatar || "/placeholder.svg",
            password: storedUser.password,
          })
        }
      })
      return allUsers
    }
  } catch (error) {
    console.error("Error loading users from storage:", error)
  }
  return mockUsers
}

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
    const allUsers = loadUsersFromStorage()

    // console.log("[v0] Login attempt for email:", email)
    // console.log(
    //   "[v0] All available users:",
    //   allUsers.map((u) => ({ email: u.email, hasPassword: !!u.password })),
    // )

    const foundUser = allUsers.find((u) => u.email === email)

    // console.log(
    //   "[v0] Found user:",
    //   foundUser ? { email: foundUser.email, hasPassword: !!foundUser.password } : "Not found",
    // )

    if (foundUser) {
      if (foundUser.password) {
        console.log("[v0] Comparing passwords - entered:", password, "stored:", foundUser.password)
        if (password === foundUser.password) {
          console.log("[v0] Password match - login successful")
          setUser(foundUser)
          localStorage.setItem("intranet-user", JSON.stringify(foundUser))
          return true
        } else {
          console.log("[v0] Password mismatch - login failed")
        }
      } else {
        console.log("[v0] No stored password, checking fallback passwords")
        if (password === "password" || password === "password123!") {
          console.log("[v0] Fallback password match - login successful")
          setUser(foundUser)
          localStorage.setItem("intranet-user", JSON.stringify(foundUser))
          return true
        } else {
          console.log("[v0] Fallback password mismatch - login failed")
        }
      }
    } else {
      console.log("[v0] User not found - login failed")
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
