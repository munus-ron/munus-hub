export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Password Reset Tool</h1>
          <p className="text-muted-foreground mt-2">This page will show all users and let you reset passwords</p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  )
}
;("use client")

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getAllUsersBasic, resetUserPassword } from "@/app/actions/auth"

function ResetPasswordForm() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    const result = await getAllUsersBasic()
    console.log("[v0] getAllUsersBasic result:", result)
    if (result.success && result.users) {
      setUsers(result.users)
      console.log("[v0] Loaded users:", result.users.length)
    } else {
      console.log("[v0] Failed to load users:", result.error)
    }
    setLoading(false)
  }

  const handleReset = async (email: string) => {
    const result = await resetUserPassword(email, "admin123")
    if (result.success) {
      setMessage(`✓ Password reset for ${email}. Use password: admin123`)
    } else {
      setMessage(`✗ Failed: ${result.error}`)
    }
  }

  if (loading) {
    return <div className="text-center">Loading users...</div>
  }

  return (
    <div className="space-y-4">
      {message && (
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-sm font-medium">{message}</p>
        </Card>
      )}

      <Card className="p-4">
        <h2 className="font-semibold mb-4">Existing Users ({users.length})</h2>
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users found in database</p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.user_email} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{user.user_email}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.role} - {user.name}
                  </p>
                </div>
                <Button onClick={() => handleReset(user.user_email)} size="sm">
                  Reset to admin123
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
