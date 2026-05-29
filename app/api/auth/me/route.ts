// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { findUserById } from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
  try {
    const dbUser = findUserById(user.userId)
    return NextResponse.json({ user: dbUser })
  } catch {
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
