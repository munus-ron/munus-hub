"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"

interface AdminOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { isAdmin } = useAuth()

  if (!isAdmin()) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default AdminOnly
