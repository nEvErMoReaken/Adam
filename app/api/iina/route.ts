import { NextResponse } from 'next/server'

const API_BASE = 'https://iina.ai'
const TOKEN = process.env.IINA_TOKEN ?? ''
const USER_ID = process.env.IINA_USER_ID ?? '3'
const MONTHS = 6
const QUOTA_PER_USD = 500000

export interface ModelStat {
  model: string
  prompt: number
  completion: number
  total: number
  requests: number
}

export interface HourStat {
  ts: number
  segments: { model: string; tokens: number }[]  // 按 tokens 降序
}

interface QuotaData {
  model_name: string
  token_used: number
  count: number
  quota: number
  created_at: number
}

const headers = { Authorization: `Bearer ${TOKEN}`, 'New-Api-User': USER_ID }

async function fetchUserSelf(): Promise<{ used: number; request_count: number }> {
  const res = await fetch(`${API_BASE}/api/user/self`, {
    headers,
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error('upstream error')
  const json = await res.json()
  const d = json.data
  return {
    used: d.used_quota / QUOTA_PER_USD,
    request_count: d.request_count,
  }
}

async function fetchQuotaData(start: number, end: number): Promise<QuotaData[]> {
  const url = `${API_BASE}/api/data/self?start_timestamp=${start}&end_timestamp=${end}`
  const res = await fetch(url, { headers, next: { revalidate: 600 } })
  if (!res.ok) throw new Error('upstream error')
  const json = await res.json()
  if (!json.success) throw new Error(json.message)
  return json.data as QuotaData[]
}

export async function GET() {
  try {
    const now = Math.floor(Date.now() / 1000)
    const step = 2592000 // 30 天
    const dayAgo = now - 86400

    const monthRanges = Array.from({ length: MONTHS }, (_, i) => ({
      start: now - step * (i + 1),
      end: now - step * i,
    }))

    const [userInfo, todayRows, ...monthChunks] = await Promise.all([
      fetchUserSelf(),
      fetchQuotaData(dayAgo, now),
      ...monthRanges.map((r) => fetchQuotaData(r.start, r.end)),
    ])

    // 今日按小时 + 模型聚合
    const hourModelMap = new Map<number, Map<string, number>>()
    for (const row of todayRows) {
      if (!hourModelMap.has(row.created_at)) hourModelMap.set(row.created_at, new Map())
      const m = hourModelMap.get(row.created_at)!
      m.set(row.model_name, (m.get(row.model_name) ?? 0) + row.token_used)
    }
    const hourly: HourStat[] = Array.from(hourModelMap.entries())
      .map(([ts, modelTokens]) => ({
        ts,
        segments: Array.from(modelTokens.entries())
          .map(([model, tokens]) => ({ model, tokens }))
          .sort((a, b) => b.tokens - a.tokens),
      }))
      .sort((a, b) => a.ts - b.ts)

    // 6 个月按模型聚合，取 Top 5
    const allRows: QuotaData[] = monthChunks.flat()
    const modelMap = new Map<string, ModelStat>()
    for (const row of allRows) {
      const existing = modelMap.get(row.model_name) ?? {
        model: row.model_name,
        prompt: 0,
        completion: 0,
        total: 0,
        requests: 0,
      }
      existing.total += row.token_used
      existing.requests += row.count
      modelMap.set(row.model_name, existing)
    }
    const models = Array.from(modelMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

    const total_requests = Array.from(modelMap.values()).reduce((s, m) => s + m.requests, 0)

    return NextResponse.json({
      models,
      total_requests,
      hourly,
      used: userInfo.used,
      request_count: userInfo.request_count,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 })
  }
}
