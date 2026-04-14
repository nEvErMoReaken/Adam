'use client'

import { useEffect, useMemo, useState } from 'react'
import { PaneLayout, Pane } from '@/components/PaneLayout'
import { useLang } from '@/lib/i18n'

interface ModelStat {
  model: string
  total: number
  requests: number
}

interface HourStat {
  ts: number
  segments: { model: string; tokens: number }[]
}

interface IinaData {
  models: ModelStat[]
  total_requests: number
  hourly: HourStat[]
  used: number
  request_count: number
}

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

const PALETTE = [
  'var(--c-blue)',
  'var(--c-mauve)',
  'var(--c-green)',
  'var(--c-peach)',
  'var(--c-teal)',
  'var(--c-yellow)',
  'var(--c-red)',
  'var(--c-sapphire)',
]

const MODEL_BAR_W = 24
const CHART_H = 56 // px

/** 生成 24 个对齐 slot，每个 slot 包含各模型 tokens */
function buildSlots(hourly: HourStat[]): { ts: number; segments: { model: string; tokens: number }[]; total: number; label: string }[] {
  const now = Math.floor(Date.now() / 1000)
  const currentHourTs = Math.floor(now / 3600) * 3600
  const map = new Map(hourly.map((h) => [h.ts, h.segments]))

  return Array.from({ length: 24 }, (_, i) => {
    const ts = currentHourTs - (23 - i) * 3600
    const h = new Date(ts * 1000).getUTCHours()
    const segments = map.get(ts) ?? []
    const total = segments.reduce((s, seg) => s + seg.tokens, 0)
    const label = i % 6 === 0 ? String(h).padStart(2, '0') : ''
    return { ts, segments, total, label }
  })
}

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

  const slots = useMemo(() => (data ? buildSlots(data.hourly) : []), [data])
  const maxHourly = Math.max(...slots.map((s) => s.total), 1)

  // 从今日数据中收集所有模型，按总量排序，分配固定颜色
  const todayModelOrder = useMemo(() => {
    const totals = new Map<string, number>()
    for (const slot of slots) {
      for (const seg of slot.segments) {
        totals.set(seg.model, (totals.get(seg.model) ?? 0) + seg.tokens)
      }
    }
    return Array.from(totals.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([model]) => model)
  }, [slots])

  const colorOf = (model: string) => {
    const idx = todayModelOrder.indexOf(model)
    return PALETTE[(idx === -1 ? 0 : idx) % PALETTE.length]
  }

  return (
    <>
      <style>{`
        @keyframes token-bar { from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0% 0 0) } }
        @keyframes token-in  { from { opacity:0; transform:translateY(4px) } to { opacity:1; transform:none } }
        @keyframes bar-grow  { from { transform: scaleY(0) } to { transform: scaleY(1) } }
      `}</style>
      <PaneLayout cols="grid-cols-1">
        <Pane title="token-usage" index={0}>
          <div className="p-5 font-mono text-[11px] text-[var(--c-subtext0)]">
            {/* prompt line */}
            <div className="mb-5 flex items-center gap-x-1.5">
              <span className="text-[var(--c-blue)]">❯</span>
              <span className="text-[var(--c-overlay0)]">{t.tokenCmd}</span>
            </div>

            {err && (
              <p className="text-[var(--c-red)]">
                <span className="text-[var(--c-overlay0)]">error</span> {t.tokenError}
              </p>
            )}
            {!data && !err && (
              <div className="flex items-center gap-2 text-[var(--c-overlay0)]">
                <span className="animate-pulse">▌</span>
                <span>{t.tokenFetching}</span>
              </div>
            )}

            {data && (
              <div className="space-y-7" style={{ animation: 'token-in .3s ease both' }}>

                {/* 统计数字 */}
                <div
                  className="grid grid-cols-2 gap-x-8 gap-y-3 border-b pb-5 sm:grid-cols-4"
                  style={{ borderColor: 'var(--c-split)' }}
                >
                  {[
                    { label: t.tokenTotalTokens, val: formatTokens(models.reduce((s, m) => s + m.total, 0)), color: 'var(--c-text)' },
                    { label: t.tokenRequests,    val: formatReqs(data.total_requests),  color: 'var(--c-mauve)' },
                    { label: t.tokenUsed,        val: formatUsd(data.used),             color: 'var(--c-peach)' },
                    { label: t.tokenAllReqs,     val: formatReqs(data.request_count),   color: 'var(--c-blue)'  },
                  ].map(({ label, val, color }) => (
                    <div key={label}>
                      <p className="mb-0.5 text-[9px] tracking-widest text-[var(--c-overlay0)] uppercase">{label}</p>
                      <p className="text-lg leading-none font-bold" style={{ color }}>{val}</p>
                    </div>
                  ))}
                </div>

                {/* 今日堆叠柱状图 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] tracking-widest text-[var(--c-overlay0)] uppercase">
                      {t.tokenToday}
                    </p>
                    {maxHourly > 1 && (
                      <span className="text-[9px] text-[var(--c-surface2)]">
                        peak {formatTokens(maxHourly)}
                      </span>
                    )}
                  </div>

                  {/* 柱子 */}
                  <div className="flex items-end gap-px" style={{ height: CHART_H }}>
                    {slots.map((slot, i) => {
                      const totalH = (slot.total / maxHourly) * CHART_H
                      return (
                        <div
                          key={slot.ts}
                          className="flex flex-1 flex-col justify-end overflow-hidden"
                          style={{ height: CHART_H }}
                        >
                          {slot.total === 0 ? (
                            <div style={{ height: 1, background: 'var(--c-surface0)', opacity: 0.4 }} />
                          ) : (
                            // 堆叠各模型色块（从下到上：占比最大的在底部）
                            [...slot.segments].reverse().map((seg) => {
                              const segH = (seg.tokens / slot.total) * totalH
                              return (
                                <div
                                  key={seg.model}
                                  style={{
                                    height: segH,
                                    background: colorOf(seg.model),
                                    transformOrigin: 'bottom',
                                    animation: `bar-grow 0.4s cubic-bezier(.4,0,.2,1) ${i * 12}ms both`,
                                    flexShrink: 0,
                                  }}
                                />
                              )
                            })
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* x 轴 */}
                  <div className="flex">
                    {slots.map((slot, i) => (
                      <div
                        key={i}
                        className="flex-1 text-center text-[8px] text-[var(--c-surface2)]"
                        style={{ minWidth: 0 }}
                      >
                        {slot.label}
                      </div>
                    ))}
                  </div>

                  {/* 图例 */}
                  {todayModelOrder.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {todayModelOrder.map((model) => (
                        <div key={model} className="flex items-center gap-1 text-[9px] text-[var(--c-overlay0)]">
                          <span
                            className="inline-block h-2 w-2 shrink-0"
                            style={{ background: colorOf(model) }}
                          />
                          {model}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* by-model top 5 */}
                <div className="space-y-4">
                  <p className="text-[9px] tracking-widest text-[var(--c-overlay0)] uppercase">
                    {t.tokenByModel}
                  </p>
                  {models.map((m, i) => {
                    const pct = m.total / maxTotal
                    const filled = Math.round(pct * MODEL_BAR_W)
                    const color = PALETTE[i % PALETTE.length]
                    return (
                      <div
                        key={m.model}
                        className="space-y-[5px]"
                        style={{ animation: `token-in .3s ease ${i * 40}ms both` }}
                      >
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="truncate text-[12px] text-[var(--c-text)]">{m.model}</span>
                          <span className="shrink-0 text-[var(--c-overlay0)]">
                            {formatTokens(m.total)} · {formatReqs(m.requests)} reqs
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
                          <span style={{ color: 'var(--c-surface1)' }}>{'░'.repeat(MODEL_BAR_W - filled)}</span>
                        </div>
                      </div>
                    )
                  })}
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
      </PaneLayout>
    </>
  )
}
