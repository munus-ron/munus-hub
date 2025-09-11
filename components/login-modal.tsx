"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const success = await login(email, password)

    if (success) {
      onOpenChange(false)
      setEmail("")
      setPassword("")
    } else {
      setError("Invalid email or password")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto p-6 sm:p-8">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl sm:text-3xl font-serif text-center">Sign In</DialogTitle>
          <DialogDescription className="text-center text-base">
            Enter your credentials to access the intranet
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-base font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-12 text-base px-4"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-base font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 text-base px-4"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive" className="py-3">
              <AlertDescription className="text-base">{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full h-12 text-base font-medium mt-8" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
