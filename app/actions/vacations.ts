"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export interface Vacation {
  id: number
  employee_name: string
  start_date: string
  end_date: string
  status: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export async function getVacations() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("vacations").select("*").order("start_date", { ascending: true })

    if (error) {
      console.error("[v0] Error loading vacations:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Error loading vacations:", error)
    return []
  }
}

export async function addVacation(vacation: Omit<Vacation, "id" | "created_at" | "updated_at">, createdBy: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("vacations")
      .insert({
        employee_name: vacation.employee_name,
        start_date: vacation.start_date,
        end_date: vacation.end_date,
        status: vacation.status || "pending",
        created_by: createdBy,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error adding vacation:", error)
      return null
    }

    revalidatePath("/calendar")
    return data
  } catch (error) {
    console.error("[v0] Error adding vacation:", error)
    return null
  }
}

export async function updateVacation(id: number, vacation: Partial<Vacation>) {
  try {
    const supabase = await createClient()

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (vacation.employee_name) updateData.employee_name = vacation.employee_name
    if (vacation.start_date) updateData.start_date = vacation.start_date
    if (vacation.end_date) updateData.end_date = vacation.end_date
    if (vacation.status) updateData.status = vacation.status

    const { data, error } = await supabase.from("vacations").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Error updating vacation:", error)
      return null
    }

    revalidatePath("/calendar")
    return data
  } catch (error) {
    console.error("[v0] Error updating vacation:", error)
    return null
  }
}

export async function deleteVacation(id: number) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("vacations").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting vacation:", error)
      return false
    }

    revalidatePath("/calendar")
    return true
  } catch (error) {
    console.error("[v0] Error deleting vacation:", error)
    return false
  }
}
