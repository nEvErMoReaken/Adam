import { NextRequest, NextResponse } from 'next/server'

const CLIENT_ID = process.env.GH_CLIENT_ID ?? ''
const SITE_URL = 'https://sleeprhino.com'

export async function GET(req: NextRequest) {
  const redirect = req.nextUrl.searchParams.get('redirect') ?? '/'
  const state = Buffer.from(redirect).toString('base64url')
  const url =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${CLIENT_ID}&scope=public_repo&state=${state}`
  return NextResponse.redirect(url)
}
