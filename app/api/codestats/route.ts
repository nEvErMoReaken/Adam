import { NextResponse } from 'next/server'

const USERNAME = 'Jmh246'
const URL = `https://codestats.net/api/users/${USERNAME}`

export async function GET() {
  try {
    const res = await fetch(URL, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    })
    if (!res.ok) return NextResponse.json({ error: 'upstream error' }, { status: res.status })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'fetch failed' }, { status: 502 })
  }
}
