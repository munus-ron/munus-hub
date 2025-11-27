"use client"

import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { getUserRole, getUserLeadProjects } from "@/app/actions/auth"

export function usePermissions() {
  const { user } = useAuth()
  const [role, setRole] = useState<"administrator" | "lead" | "user" | null>(null)
  const [leadProjects, setLeadProjects] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPermissions() {
      if (!user?.email) {
        setRole(null)
        setLeadProjects([])
        setLoading(false)
        return
      }

      try {
        const userRole = await getUserRole(user.email)
        setRole(userRole?.role || null)

        if (userRole?.role === "lead") {
          const projects = await getUserLeadProjects(user.email)
          setLeadProjects(projects)
        }
      } catch (error) {
        console.error("[v0] Error loading permissions:", error)
        setRole(null)
        setLeadProjects([])
      } finally {
        setLoading(false)
      }
    }

    loadPermissions()
  }, [user])

  const isAdministrator = role === "administrator"
  const isLead = role === "lead"
  const isUser = role === "user"

  const canEditProject = (projectId: number) => {
    if (isAdministrator) return true
    if (isLead) return leadProjects.includes(projectId)
    return false
  }

  const canEditEvent = (eventCreatedBy?: string) => {
    if (isAdministrator) return true
    if ((isLead || isUser) && eventCreatedBy === user?.email) return true
    return false
  }

  const canEditVacation = (vacationCreatedBy?: string, vacationEmployeeName?: string) => {
    if (isAdministrator) return true
    if ((isLead || isUser) && vacationCreatedBy === user?.email) return true
    return false
  }

  const canEditAnnouncement = (announcementAuthor?: string) => {
    if (isAdministrator) return true
    if ((isLead || isUser) && announcementAuthor === user?.name) return true
    return false
  }

  const canEditAnnouncements = isAdministrator || isLead || isUser
  const canEditCalendar = isAdministrator || isLead || isUser
  const canAccessAdmin = isAdministrator

  return {
    role,
    loading,
    isAdministrator,
    isLead,
    isUser,
    leadProjects,
    canEditProject,
    canEditEvent,
    canEditVacation,
    canEditAnnouncement,
    canEditAnnouncements,
    canEditCalendar,
    canAccessAdmin,
  }
}
