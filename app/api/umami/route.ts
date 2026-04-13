import { NextRequest, NextResponse } from 'next/server'

const BASE = 'https://umami.sleeprhino.com'
const SITE_ID = '88651a0c-381a-483e-88d0-4ad165f084b4'

let cachedToken: string | null = null
let tokenExpiry = 0

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: process.env.UMAMI_USER,
      password: process.env.UMAMI_PASS,
    }),
  })
  const data = await res.json()
  cachedToken = data.token
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000 // 23h
  return cachedToken!
}

async function umamiGet(path: string) {
  const token = await getToken()
  const res = await fetch(`${BASE}/api/websites/${SITE_ID}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 30 },
  })
  return res.json()
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type')
  const slug = req.nextUrl.searchParams.get('slug') // e.g. /blog/ring-buffer/

  try {
    if (type === 'active') {
      const data = await umamiGet('/active')
      return NextResponse.json({ count: data.visitors ?? 0 })
    }

    if (type === 'pageviews' && slug) {
      const now = Date.now()
      const start = new Date('2020-01-01').getTime()
      const data = await umamiGet(`/metrics?type=path&startAt=${start}&endAt=${now}`)
      const page = (data as { x: string; y: number }[]).find(
        (d) => d.x === slug || d.x === slug.replace(/\/$/, '')
      )
      return NextResponse.json({ views: page?.y ?? 0 })
    }

    return NextResponse.json({ error: 'invalid type' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: 'umami error' }, { status: 500 })
  }
}
