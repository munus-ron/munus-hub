"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { getUserRole, isProjectLead } from "@/app/actions/auth"

interface PermissionGuardProps {
  children: React.ReactNode
  requiredRole?: "administrator" | "lead" | "user"
  projectId?: number
  fallback?: React.ReactNode
}

export function PermissionGuard({ children, requiredRole, projectId, fallback = null }: PermissionGuardProps) {
  const { user } = useAuth()
  const [hasPermission, setHasPermission] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkPermission() {
      if (!user?.email) {
        setHasPermission(false)
        setLoading(false)
        return
      }

      try {
        const userRole = await getUserRole(user.email)

        if (!userRole) {
          setHasPermission(false)
          setLoading(false)
          return
        }

        // Administrators have access to everything
        if (userRole.role === "administrator") {
          setHasPermission(true)
          setLoading(false)
          return
        }

        // Check specific role requirement
        if (requiredRole === "administrator") {
          setHasPermission(false)
          setLoading(false)
          return
        }

        // Check project-specific permissions for leads
        if (projectId && userRole.role === "lead") {
          const isLead = await isProjectLead(user.email, projectId)
          setHasPermission(isLead)
          setLoading(false)
          return
        }

        // Check role hierarchy
        const roleHierarchy = { administrator: 3, lead: 2, user: 1 }
        const userLevel = roleHierarchy[userRole.role]
        const requiredLevel = requiredRole ? roleHierarchy[requiredRole] : 1

        setHasPermission(userLevel >= requiredLevel)
      } catch (error) {
        console.error("[v0] Error checking permission:", error)
        setHasPermission(false)
      } finally {
        setLoading(false)
      }
    }

    checkPermission()
  }, [user, requiredRole, projectId])

  if (loading) {
    return null
  }

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
