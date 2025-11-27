import { createClient } from "@/lib/supabase/server"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

async function seedUsers() {
  console.log("[v0] Starting user seeding...")

  const supabase = await createClient()

  // Delete existing test users
  await supabase
    .from("user_roles")
    .delete()
    .in("user_email", ["testadmin@company.com", "testlead@company.com", "testuser@company.com"])

  console.log("[v0] Deleted existing test users")

  // Create test users with properly hashed passwords
  const password = "Password123"
  const hashedPassword = await hashPassword(password)

  console.log("[v0] Generated password hash:", hashedPassword.substring(0, 20) + "...")

  const users = [
    {
      user_email: "testadmin@company.com",
      name: "Test Administrator",
      password: hashedPassword,
      role: "administrator",
    },
    {
      user_email: "testlead@company.com",
      name: "Test Lead",
      password: hashedPassword,
      role: "lead",
    },
    {
      user_email: "testuser@company.com",
      name: "Test User",
      password: hashedPassword,
      role: "user",
    },
  ]

  const { data, error } = await supabase.from("user_roles").insert(users).select()

  if (error) {
    console.error("[v0] Error seeding users:", error)
    return
  }

  console.log("[v0] Successfully created test users:", data)
  console.log("[v0] You can now login with:")
  console.log("[v0] - testadmin@company.com / Password123")
  console.log("[v0] - testlead@company.com / Password123")
  console.log("[v0] - testuser@company.com / Password123")
}

seedUsers()
