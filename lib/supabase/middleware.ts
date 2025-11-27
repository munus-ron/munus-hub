import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Simply pass through all requests without Supabase Auth checks
  return NextResponse.next({
    request,
  })
}
