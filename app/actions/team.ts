"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getTeamMembers() {
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from("team_members")
    .select("*")
    .order("position", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching team members:", error)
    return { founders: [], advisors: [], consultants: [] }
  }

  // Group by category
  const founders = members.filter((m) => m.category === "founder")
  const advisors = members.filter((m) => m.category === "advisor")
  const consultants = members.filter((m) => m.category === "consultant")

  return { founders, advisors, consultants }
}

export async function createTeamMember(memberData: any) {
  const supabase = await createClient()

  const { data: maxPositionData } = await supabase
    .from("team_members")
    .select("position")
    .eq("category", memberData.category)
    .order("position", { ascending: false })
    .limit(1)
    .single()

  const nextPosition = (maxPositionData?.position || 0) + 1

  const { data, error } = await supabase
    .from("team_members")
    .insert({
      name: memberData.name,
      role: memberData.role,
      category: memberData.category,
      email: memberData.email,
      phone: memberData.phone,
      location: memberData.location || "", // Added location field
      image: memberData.avatar || "/placeholder.svg",
      bio: memberData.bio || "",
      linkedin: memberData.linkedin || "",
      twitter: memberData.twitter || "",
      position: nextPosition, // Added position field
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating team member:", error)
    throw new Error("Failed to create team member")
  }

  revalidatePath("/team")
  return data
}

export async function updateTeamMember(id: number, memberData: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("team_members")
    .update({
      name: memberData.name,
      role: memberData.role,
      email: memberData.email,
      phone: memberData.phone,
      location: memberData.location || "", // Added location field
      image: memberData.avatar || memberData.image, // Handle both avatar and image fields
      bio: memberData.bio || "",
      linkedin: memberData.linkedin || "",
      twitter: memberData.twitter || "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("[v0] Error updating team member:", error)
    throw new Error("Failed to update team member")
  }

  revalidatePath("/team")
}

export async function deleteTeamMember(id: number) {
  const supabase = await createClient()

  const { error } = await supabase.from("team_members").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting team member:", error)
    throw new Error("Failed to delete team member")
  }

  revalidatePath("/team")
}

export async function updateTeamMemberImage(id: number, imageUrl: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("team_members").update({ image: imageUrl }).eq("id", id)

  if (error) {
    console.error("[v0] Error updating team member image:", error)
    throw new Error("Failed to update team member image")
  }

  revalidatePath("/team")
}
