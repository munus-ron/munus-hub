"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProjectTeamMembers(projectId: number) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("project_team_members")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching project team members:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Error in getProjectTeamMembers:", error)
    return []
  }
}

export async function addProjectTeamMember(
  projectId: number,
  member: {
    team_member_id?: number
    name: string
    role?: string
    email?: string
    avatar?: string
  },
) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("project_team_members")
      .insert({
        project_id: projectId,
        team_member_id: member.team_member_id || null,
        name: member.name,
        role: member.role || "",
        email: member.email || "",
        avatar: member.avatar || "/placeholder.svg",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error adding project team member:", error)
      return null
    }

    revalidatePath(`/projects/${projectId}`)
    return data
  } catch (error) {
    console.error("[v0] Error in addProjectTeamMember:", error)
    return null
  }
}

export async function updateProjectTeamMember(
  id: number,
  projectId: number,
  updates: {
    name?: string
    role?: string
    email?: string
    avatar?: string
  },
) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.from("project_team_members").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Error updating project team member:", error)
      return null
    }

    revalidatePath(`/projects/${projectId}`)
    return data
  } catch (error) {
    console.error("[v0] Error in updateProjectTeamMember:", error)
    return null
  }
}

export async function removeProjectTeamMember(id: number, projectId: number) {
  try {
    const supabase = await createServerClient()

    const { error } = await supabase.from("project_team_members").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error removing project team member:", error)
      return false
    }

    revalidatePath(`/projects/${projectId}`)
    return true
  } catch (error) {
    console.error("[v0] Error in removeProjectTeamMember:", error)
    return false
  }
}
