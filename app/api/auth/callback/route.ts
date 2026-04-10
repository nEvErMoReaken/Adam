import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code') ?? ''
  const state = req.nextUrl.searchParams.get('state') ?? ''

  let redirect = '/'
  try { redirect = Buffer.from(state, 'base64url').toString() } catch {}

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GH_CLIENT_ID,
      client_secret: process.env.GH_CLIENT_SECRET,
      code,
    }),
  })
  const data = await res.json()
  const token: string = data.access_token ?? ''

  const response = NextResponse.redirect(new URL(redirect, 'https://sleeprhino.com'))
  if (token) {
    response.cookies.set('gh_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
  }
  return response
}
