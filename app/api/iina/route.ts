import { NextResponse } from 'next/server'

const API_BASE = 'https://iina.ai'
const TOKEN = process.env.IINA_TOKEN ?? ''
const USER_ID = process.env.IINA_USER_ID ?? '3'
const PAGE_SIZE = 500
const MAX_PAGES = 10  // cap at 5000 records

interface LogItem {
  model_name: string
  prompt_tokens: number
  completion_tokens: number
}

export interface ModelStat {
  model: string
  prompt: number
  completion: number
  total: number
  requests: number
}

async function fetchPage(page: number): Promise<{ items: LogItem[]; total: number }> {
  const url = `${API_BASE}/api/log/self?type=0&p=${page}&page_size=${PAGE_SIZE}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}`, 'New-Api-User': USER_ID },
    next: { revalidate: 600 },
  })
  if (!res.ok) throw new Error('upstream error')
  const json = await res.json()
  if (!json.success) throw new Error(json.message)
  return { items: json.data.items, total: json.data.total }
}

export async function GET() {
  try {
    const first = await fetchPage(1)
    const totalPages = Math.min(Math.ceil(first.total / PAGE_SIZE), MAX_PAGES)

    // fetch remaining pages in parallel
    const rest = totalPages > 1
      ? await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 2))
        )
      : []

    const allItems: LogItem[] = [first.items, ...rest.map(r => r.items)].flat()

    // aggregate by model
    const map = new Map<string, ModelStat>()
    for (const item of allItems) {
      const key = item.model_name
      const existing = map.get(key) ?? { model: key, prompt: 0, completion: 0, total: 0, requests: 0 }
      existing.prompt     += item.prompt_tokens
      existing.completion += item.completion_tokens
      existing.total      += item.prompt_tokens + item.completion_tokens
      existing.requests   += 1
      map.set(key, existing)
    }

    const models = Array.from(map.values()).sort((a, b) => b.total - a.total)

    return NextResponse.json({
      models,
      total_requests: first.total,
      sampled: allItems.length,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 })
  }
}
