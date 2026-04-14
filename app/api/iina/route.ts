import { NextResponse } from 'next/server'

const API_BASE = 'https://iina.ai'
const TOKEN = process.env.IINA_TOKEN ?? ''
const USER_ID = process.env.IINA_USER_ID ?? '3'
const MONTHS = 6 // 往前统计 6 个月

export interface ModelStat {
  model: string
  prompt: number
  completion: number
  total: number
  requests: number
}

interface QuotaData {
  model_name: string
  token_used: number
  count: number
  quota: number
}

async function fetchMonth(start: number, end: number): Promise<QuotaData[]> {
  const url = `${API_BASE}/api/data/self?start_timestamp=${start}&end_timestamp=${end}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}`, 'New-Api-User': USER_ID },
    next: { revalidate: 600 },
  })
  if (!res.ok) throw new Error('upstream error')
  const json = await res.json()
  if (!json.success) throw new Error(json.message)
  return json.data as QuotaData[]
}

export async function GET() {
  try {
    const now = Math.floor(Date.now() / 1000)
    const step = 2592000 // 30 天（API 限制）

    // 并行拉取最近 N 个月，每段不超过 30 天
    const ranges = Array.from({ length: MONTHS }, (_, i) => ({
      start: now - step * (i + 1),
      end: now - step * i,
    }))

    const chunks = await Promise.all(ranges.map((r) => fetchMonth(r.start, r.end)))
    const allRows: QuotaData[] = chunks.flat()

    // 按 model_name 聚合 token_used 和 count
    const map = new Map<string, ModelStat>()
    for (const row of allRows) {
      const key = row.model_name
      const existing = map.get(key) ?? {
        model: key,
        prompt: 0,
        completion: 0,
        total: 0,
        requests: 0,
      }
      existing.total += row.token_used
      existing.requests += row.count
      map.set(key, existing)
    }

    const models = Array.from(map.values()).sort((a, b) => b.total - a.total)
    const total_requests = models.reduce((s, m) => s + m.requests, 0)

    return NextResponse.json({
      models,
      total_requests,
      sampled: total_requests,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 })
  }
}
