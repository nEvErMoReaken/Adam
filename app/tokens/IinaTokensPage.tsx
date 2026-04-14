'use client'

import { useEffect, useState } from 'react'
import { PaneLayout, Pane } from '@/components/PaneLayout'
import { useLang } from '@/lib/i18n'

interface ModelStat {
  model: string
  total: number
  requests: number
}

interface HourStat {
  ts: number
  tokens: number
}

interface IinaData {
  models: ModelStat[]
  total_requests: number
  hourly: HourStat[]
  used: number
  request_count: number
}

const BLOCKS = ' ▁▂▃▄▅▆▇█'

function formatTokens(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

function formatReqs(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

function formatUsd(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`
  return `$${n.toFixed(2)}`
}

/** 把 hourly 数组转成 24 格 spark 图 */
function buildSparkLine(hourly: HourStat[]): { bars: string; max: number } {
  // 以当前小时为基准，往前取 24 小时
  const now = Math.floor(Date.now() / 1000)
  const slotStart = now - 86400
  // 按小时 slot 聚合
  const slotMap = new Map<number, number>()
  for (const h of hourly) {
    if (h.ts >= slotStart) slotMap.set(h.ts, h.tokens)
  }
  // 生成 24 个 slot（从最早到最新）
  const currentHour = Math.floor(now / 3600) * 3600
  const slots: number[] = Array.from({ length: 24 }, (_, i) => {
    const ts = currentHour - (23 - i) * 3600
    return slotMap.get(ts) ?? 0
  })
  const max = Math.max(...slots, 1)
  const bars = slots
    .map((v) => {
      const idx = Math.round((v / max) * 8)
      return BLOCKS[idx]
    })
    .join('')
  return { bars, max }
}

const COLORS = [
  'var(--c-blue)',
  'var(--c-mauve)',
  'var(--c-green)',
  'var(--c-peach)',
  'var(--c-teal)',
]

const BAR_W = 20

export default function IinaTokensPage() {
  const { t } = useLang()
  const [data, setData] = useState<IinaData | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    fetch('/api/iina')
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((j: IinaData) => setData(j))
      .catch(() => setErr(true))
  }, [])

  const models = data?.models ?? []
  const maxTotal = models[0]?.total ?? 1
  const spark = data ? buildSparkLine(data.hourly) : null

  // x 轴标签：每 6 小时一个，对齐 24 格
  const now = Math.floor(Date.now() / 1000)
  const currentHour = new Date(now * 1000).getUTCHours()
  const xLabels = Array.from({ length: 24 }, (_, i) => {
    const h = (currentHour - 23 + i + 24) % 24
    return i % 6 === 0 ? String(h).padStart(2, '0') : ' '
  })

  const loadingNode = (
    <div className="flex h-full items-center justify-center gap-2 text-[var(--c-overlay0)]">
      <span className="animate-pulse">▌</span>
      <span>{t.tokenFetching}</span>
    </div>
  )

  const errNode = (
    <p className="p-5 text-[var(--c-red)]">
      <span className="text-[var(--c-overlay0)]">error</span> {t.tokenError}
    </p>
  )

  return (
    <>
      <style>{`
        @keyframes token-bar { from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0% 0 0) } }
        @keyframes token-in  { from { opacity:0; transform:translateY(4px) } to { opacity:1; transform:none } }
      `}</style>
      <PaneLayout>
        {/* 左列：用户统计 + 今日时序图 */}
        <Pane title="stats" index={0}>
          <div className="p-5 font-mono text-[11px] text-[var(--c-subtext0)]">
            <div className="mb-5 flex items-center gap-x-1.5 text-[11px]">
              <span className="text-[var(--c-blue)]">❯</span>
              <span className="text-[var(--c-overlay0)]">{t.tokenCmd}</span>
            </div>

            {err && errNode}
            {!data && !err && loadingNode}

            {data && (
              <div className="space-y-6" style={{ animation: 'token-in .3s ease both' }}>
                {/* 用户统计 */}
                <div
                  className="grid grid-cols-2 gap-x-6 gap-y-3 border-b pb-5"
                  style={{ borderColor: 'var(--c-split)' }}
                >
                  {[
                    { label: t.tokenUsed, val: formatUsd(data.used), color: 'var(--c-peach)' },
                    {
                      label: t.tokenAllReqs,
                      val: formatReqs(data.request_count),
                      color: 'var(--c-mauve)',
                    },
                  ].map(({ label, val, color }) => (
                    <div key={label}>
                      <p className="mb-0.5 text-[9px] tracking-widest text-[var(--c-overlay0)] uppercase">
                        {label}
                      </p>
                      <p className="text-lg leading-none font-bold" style={{ color }}>
                        {val}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 今日时序柱状图 */}
                <div className="space-y-2">
                  <p className="text-[9px] tracking-widest text-[var(--c-overlay0)] uppercase">
                    {t.tokenToday}
                    <span className="ml-2 normal-case">
                      {spark && spark.max > 0 ? `max ${formatTokens(spark.max)}` : ''}
                    </span>
                  </p>
                  {spark && (
                    <>
                      {/* spark 图 */}
                      <div
                        className="text-[14px] leading-none tracking-[2px] text-[var(--c-blue)]"
                        style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
                      >
                        {spark.bars}
                      </div>
                      {/* x 轴标签 */}
                      <div
                        className="flex text-[8px] text-[var(--c-surface2)]"
                        style={{ letterSpacing: '0px' }}
                      >
                        {xLabels.map((label, i) => (
                          <span
                            key={i}
                            style={{ width: `${100 / 24}%`, textAlign: 'left', flexShrink: 0 }}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* footer */}
                <p
                  className="border-t pt-3 text-[9px] text-[var(--c-overlay0)]"
                  style={{ borderColor: 'var(--c-split)' }}
                >
                  {formatReqs(data.total_requests)} {t.tokenFooter}
                </p>
              </div>
            )}
          </div>
        </Pane>

        {/* 右列：by-model Top 5 */}
        <Pane title="by-model" index={1}>
          <div className="p-5 font-mono text-[11px] text-[var(--c-subtext0)]">
            {err && errNode}
            {!data && !err && loadingNode}

            {data && (
              <div className="space-y-5" style={{ animation: 'token-in .3s ease both' }}>
                <p className="text-[9px] tracking-widest text-[var(--c-overlay0)] uppercase">
                  {t.tokenByModel}
                </p>
                {models.map((m, i) => {
                  const pct = m.total / maxTotal
                  const filled = Math.round(pct * BAR_W)
                  const color = COLORS[i % COLORS.length]
                  return (
                    <div
                      key={m.model}
                      className="space-y-[5px]"
                      style={{ animation: `token-in .3s ease ${i * 40}ms both` }}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-[12px] text-[var(--c-text)]">{m.model}</span>
                        <span className="shrink-0 text-[var(--c-overlay0)]">
                          {formatTokens(m.total)}
                        </span>
                      </div>
                      <div
                        style={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          fontSize: 10,
                          animation: `token-bar 0.5s cubic-bezier(.4,0,.2,1) ${i * 50}ms both`,
                        }}
                      >
                        <span style={{ color }}>{'█'.repeat(filled)}</span>
                        <span style={{ color: 'var(--c-surface1)' }}>
                          {'░'.repeat(BAR_W - filled)}
                        </span>
                      </div>
                      <p className="text-[9px] text-[var(--c-overlay0)]">
                        {formatReqs(m.requests)} reqs
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Pane>
      </PaneLayout>
    </>
  )
}
