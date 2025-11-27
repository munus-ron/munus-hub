"use server"

import { createClient } from "@/lib/supabase/server"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

export async function setupAdminUser() {
  try {
    const supabase = await createClient()

    // Delete existing test admin if exists
    await supabase.from("user_roles").delete().eq("user_email", "testadmin@company.com")

    // Hash the password using the same function as the app
    const hashedPassword = await hashPassword("admin123")

    console.log("[v0] Creating admin user with password hash:", hashedPassword.substring(0, 20))

    // Insert the admin user
    const { error } = await supabase.from("user_roles").insert({
      user_email: "testadmin@company.com",
      name: "Test Admin",
      password: hashedPassword,
      role: "administrator",
    })

    if (error) {
      console.error("[v0] Error creating admin user:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] Admin user created successfully")
    return { success: true }
  } catch (error) {
    console.error("[v0] Setup error:", error)
    return { success: false, error: String(error) }
  }
}
