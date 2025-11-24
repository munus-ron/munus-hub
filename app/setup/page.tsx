"use client"

import { useState } from "react"
import { setupAdminUser } from "@/app/actions/setup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSetup = async () => {
    setStatus("loading")
    setMessage("")

    const result = await setupAdminUser()

    if (result.success) {
      setStatus("success")
      setMessage("Admin user created successfully!")
    } else {
      setStatus("error")
      setMessage(result.error || "Failed to create admin user")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>Create the admin user account to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This will create an admin account with the following credentials:
            </p>
            <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
              <p>
                <strong>Email:</strong> testadmin@company.com
              </p>
              <p>
                <strong>Password:</strong> admin123
              </p>
              <p>
                <strong>Role:</strong> Administrator
              </p>
            </div>
          </div>

          <Button onClick={handleSetup} disabled={status === "loading" || status === "success"} className="w-full">
            {status === "loading" ? "Creating..." : "Create Admin User"}
          </Button>

          {status === "success" && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
              <XCircle className="h-5 w-5" />
              <p className="text-sm">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">You can now login with the credentials above.</p>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => (window.location.href = "/")}>
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
