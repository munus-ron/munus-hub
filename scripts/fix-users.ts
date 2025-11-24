import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

async function fixUsers() {
  console.log("🔧 Fixing user passwords...")

  const { error: deleteError } = await supabase.from("user_roles").delete().neq("user_email", "")

  if (deleteError) {
    console.error("❌ Error deleting users:", deleteError)
    return
  }

  console.log("✅ Deleted all existing users")

  const adminPassword = await hashPassword("admin123")
  const { error: adminError } = await supabase.from("user_roles").insert({
    user_email: "admin@company.com",
    name: "Administrator",
    password: adminPassword,
    role: "administrator",
  })

  if (adminError) {
    console.error("❌ Error creating admin:", adminError)
  } else {
    console.log("✅ Created admin@company.com with password: admin123")
    console.log("   Password hash:", adminPassword)
  }

  const leadPassword = await hashPassword("lead123")
  const { error: leadError } = await supabase.from("user_roles").insert({
    user_email: "lead@company.com",
    name: "Lead User",
    password: leadPassword,
    role: "lead",
  })

  if (leadError) {
    console.error("❌ Error creating lead:", leadError)
  } else {
    console.log("✅ Created lead@company.com with password: lead123")
  }

  const userPassword = await hashPassword("user123")
  const { error: userError } = await supabase.from("user_roles").insert({
    user_email: "user@company.com",
    name: "Regular User",
    password: userPassword,
    role: "user",
  })

  if (userError) {
    console.error("❌ Error creating user:", userError)
  } else {
    console.log("✅ Created user@company.com with password: user123")
  }

  console.log("\n🎉 User fix complete!")
  console.log("\n📋 Login credentials:")
  console.log("   Admin: admin@company.com / admin123")
  console.log("   Lead:  lead@company.com / lead123")
  console.log("   User:  user@company.com / user123")
}

fixUsers()
