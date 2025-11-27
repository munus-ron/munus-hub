"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAnnouncements() {
  const supabase = await createClient()

  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("*, announcement_comments(*), announcement_likes(*)")
    .order("date", { ascending: false })

  if (error) {
    // If announcement_likes table doesn't exist, query without it
    if (error.code === "PGRST200" || error.message?.includes("Could not find")) {
      console.log("[v0] announcement_likes table not found, querying without likes")
      const { data: announcementsWithoutLikes, error: fallbackError } = await supabase
        .from("announcements")
        .select("*, announcement_comments(*)")
        .order("date", { ascending: false })

      if (fallbackError) {
        console.error("[v0] Error fetching announcements:", fallbackError)
        return []
      }

      return announcementsWithoutLikes.map((announcement) => ({
        ...announcement,
        isPinned: announcement.is_pinned,
        publishedAt: announcement.date,
        authorRole: announcement.author_role || "User",
        authorAvatar: announcement.author_avatar || "/placeholder.svg",
        comments: announcement.announcement_comments || [],
        commentsList: announcement.announcement_comments || [],
        likes: 0,
        likesList: [],
      }))
    }

    console.error("[v0] Error fetching announcements:", error)
    return []
  }

  return announcements.map((announcement) => ({
    ...announcement,
    isPinned: announcement.is_pinned,
    publishedAt: announcement.date,
    authorRole: announcement.author_role || "User",
    authorAvatar: announcement.author_avatar || "/placeholder.svg",
    comments: announcement.announcement_comments || [],
    commentsList: announcement.announcement_comments || [],
    likes: announcement.announcement_likes?.length || 0,
    likesList: announcement.announcement_likes || [],
  }))
}

export async function createAnnouncement(announcementData: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title: announcementData.title,
      content: announcementData.content,
      author: announcementData.author,
      priority: announcementData.priority || "medium",
      category: announcementData.category,
      tags: announcementData.tags || [],
      is_pinned: announcementData.isPinned || false,
      date: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating announcement:", error)
    throw new Error("Failed to create announcement")
  }

  revalidatePath("/announcements")
  return data
}

export async function updateAnnouncement(id: number, announcementData: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("announcements")
    .update({
      title: announcementData.title,
      content: announcementData.content,
      priority: announcementData.priority,
      category: announcementData.category,
      tags: announcementData.tags || [],
      is_pinned: announcementData.isPinned || false,
      updated_by: announcementData.updatedBy, // Capture who edited it
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("[v0] Error updating announcement:", error)
    throw new Error("Failed to update announcement")
  }

  revalidatePath("/announcements")
}

export async function deleteAnnouncement(id: number) {
  const supabase = await createClient()

  const { error } = await supabase.from("announcements").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting announcement:", error)
    throw new Error("Failed to delete announcement")
  }

  revalidatePath("/announcements")
}

export async function addComment(announcementId: number, commentData: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("announcement_comments")
    .insert({
      announcement_id: announcementId,
      author: commentData.author,
      content: commentData.content,
      date: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error adding comment:", error)
    throw new Error("Failed to add comment")
  }

  revalidatePath("/announcements")
  return data
}

export async function toggleLike(announcementId: number, userEmail: string, userName: string) {
  const supabase = await createClient()

  try {
    // Check if user already liked this announcement
    const { data: existingLike, error: checkError } = await supabase
      .from("announcement_likes")
      .select("*")
      .eq("announcement_id", announcementId)
      .eq("user_email", userEmail)
      .maybeSingle()

    if (checkError) {
      // Check if error is due to missing table
      if (checkError.code === "PGRST205" || checkError.message?.includes("Could not find the table")) {
        console.log("[v0] announcement_likes table not found. Please run script 023_create_announcement_likes.sql")
        return { success: false, error: "Likes feature not set up. Please run database migration script." }
      }
      console.error("[v0] Error checking like:", checkError)
      throw new Error("Failed to check like status")
    }

    if (existingLike) {
      // Unlike: Remove the like
      const { error: deleteError } = await supabase
        .from("announcement_likes")
        .delete()
        .eq("announcement_id", announcementId)
        .eq("user_email", userEmail)

      if (deleteError) {
        console.error("[v0] Error removing like:", deleteError)
        throw new Error("Failed to remove like")
      }

      console.log("[v0] Like removed:", { announcementId, userEmail })
    } else {
      // Like: Add the like
      const { error: insertError } = await supabase.from("announcement_likes").insert({
        announcement_id: announcementId,
        user_email: userEmail,
        user_name: userName,
      })

      if (insertError) {
        console.error("[v0] Error adding like:", insertError)
        throw new Error("Failed to add like")
      }

      console.log("[v0] Like added:", { announcementId, userEmail })
    }

    revalidatePath("/announcements")
    return { success: true }
  } catch (error: any) {
    // Handle missing table error gracefully
    if (error.code === "PGRST205" || error.message?.includes("Could not find the table")) {
      console.log("[v0] announcement_likes table not found. Please run script 023_create_announcement_likes.sql")
      return { success: false, error: "Likes feature not set up. Please run database migration script." }
    }
    throw error
  }
}
