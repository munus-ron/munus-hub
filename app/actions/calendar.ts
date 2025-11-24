"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getCalendarEvents() {
  const supabase = await createServerClient()

  const { data: events, error } = await supabase
    .from("calendar_events")
    .select("*")
    .order("start_time", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching calendar events:", error)
    return []
  }

  return events
}

export async function createCalendarEvent(eventData: any, createdBy: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("calendar_events")
    .insert({
      title: eventData.title,
      description: eventData.description,
      start_time: eventData.startTime,
      end_time: eventData.endTime,
      location: eventData.location,
      online_meeting_link: eventData.onlineMeetingLink || null,
      attendees: eventData.attendees || [],
      color: eventData.color || "blue",
      type: eventData.type || "meeting",
      created_by: createdBy,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating calendar event:", error)
    throw new Error("Failed to create calendar event")
  }

  revalidatePath("/calendar")
  return data
}

export async function updateCalendarEvent(id: number, eventData: any) {
  const supabase = await createServerClient()

  console.log("[v0] Updating calendar event:", { id, eventData })

  const { data, error } = await supabase
    .from("calendar_events")
    .update({
      title: eventData.title,
      description: eventData.description,
      start_time: eventData.startTime,
      end_time: eventData.endTime,
      location: eventData.location,
      online_meeting_link: eventData.onlineMeetingLink || null,
      attendees: eventData.attendees,
      color: eventData.color,
      type: eventData.type || "meeting",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating calendar event:", error)
    throw new Error("Failed to update calendar event")
  }

  console.log("[v0] Calendar event updated successfully:", data)

  revalidatePath("/calendar")
  return data
}

export async function deleteCalendarEvent(id: number) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("calendar_events").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting calendar event:", error)
    throw new Error("Failed to delete calendar event")
  }

  revalidatePath("/calendar")
}
