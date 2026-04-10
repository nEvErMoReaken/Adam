import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const jar = await cookies()
  const token = jar.get('gh_token')?.value
  if (!token) return NextResponse.json(null)

  const res = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  })
  if (!res.ok) return NextResponse.json(null)

  const u = await res.json()
  return NextResponse.json({ login: u.login as string, avatar: u.avatar_url as string })
}
