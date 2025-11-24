"use client"

import { useAuth } from "@/contexts/auth-context"

export function useUser() {
  const { user } = useAuth()
  return { user }
}
