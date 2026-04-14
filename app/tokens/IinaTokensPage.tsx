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

/** 生成 24 个对齐 slot，每个 slot 包含各模型 tokens */
function buildSlots(
  hourly: HourStat[]
): { ts: number; segments: { model: string; tokens: number }[]; total: number; label: string }[] {
  const now = Math.floor(Date.now() / 1000)
  const currentHourTs = Math.floor(now / 3600) * 3600
  const map = new Map(hourly.map((h) => [h.ts, h.segments]))

  return Array.from({ length: 24 }, (_, i) => {
    const ts = currentHourTs - (23 - i) * 3600
    const h = new Date(ts * 1000).getHours()
    const segments = map.get(ts) ?? []
    const total = segments.reduce((s, seg) => s + seg.tokens, 0)
    const label = String(h).padStart(2, '0')
    return { ts, segments, total, label }
  })
}

export default function IinaTokensPage() {
  const { t } = useLang()
  const [data, setData] = useState<IinaData | null>(null)
  const [err, setErr] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

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

  // 当前小时 ts（用于高亮）
  const currentHourTs = useMemo(() => Math.floor(Date.now() / 1000 / 3600) * 3600, [])

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

  const hoveredSlot = hoveredIdx !== null ? slots[hoveredIdx] : null

  return (
    <PaneLayout cols="grid-cols-1">
      <Pane title="token-usage" index={0}>
        <div className="flex h-full flex-col p-5 font-mono text-[11px] text-[var(--c-subtext0)]">
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
            <div className="flex flex-1 animate-pulse flex-col gap-6 overflow-hidden">
              {/* stats grid skeleton */}
              <div
                className="grid grid-cols-2 gap-x-8 gap-y-3 border-b pb-5 sm:grid-cols-4"
                style={{ borderColor: 'var(--c-split)' }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-2 w-16 rounded bg-[var(--c-surface0)]" />
                    <div className="h-5 w-20 rounded bg-[var(--c-surface1)]" />
                  </div>
                ))}
              </div>
              {/* bar chart skeleton */}
              <div className="flex min-h-0 flex-1 flex-col gap-1">
                <div className="h-2 w-20 rounded bg-[var(--c-surface0)]" />
                <div className="flex min-h-0 flex-1 items-end gap-px">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-[var(--c-surface0)]"
                      style={{ height: `${15 + ((Math.sin(i * 0.8) + 1) / 2) * 60}%` }}
                    />
                  ))}
                </div>
                <div className="flex">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="flex flex-1 justify-center">
                      <div className="h-1.5 w-3 rounded bg-[var(--c-surface0)]" />
                    </div>
                  ))}
                </div>
              </div>
              {/* by-model skeleton */}
              <div className="shrink-0 space-y-4">
                <div className="h-2 w-20 rounded bg-[var(--c-surface0)]" />
                {[90, 72, 55, 40, 28].map((w) => (
                  <div key={w} className="space-y-[5px]">
                    <div className="flex justify-between gap-4">
                      <div
                        className="h-3 rounded bg-[var(--c-surface0)]"
                        style={{ width: `${w * 0.7}%` }}
                      />
                      <div className="h-3 w-20 shrink-0 rounded bg-[var(--c-surface0)]" />
                    </div>
                    <div className="h-2.5 w-full rounded bg-[var(--c-surface0)]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {data && (
            <div
              className="flex flex-1 flex-col gap-6 overflow-hidden"
              style={{ animation: 'fade-up .3s ease both' }}
            >
              {/* 统计数字 */}
              <div
                className="grid grid-cols-2 gap-x-8 gap-y-3 border-b pb-5 sm:grid-cols-4"
                style={{ borderColor: 'var(--c-split)' }}
              >
                {[
                  {
                    label: t.tokenTotalTokens,
                    val: Math.round(models.reduce((s, m) => s + m.total, 0)).toLocaleString(),
                    color: 'var(--c-text)',
                  },
                  {
                    label: t.tokenRequests,
                    val: data.total_requests.toLocaleString(),
                    color: 'var(--c-mauve)',
                  },
                  { label: t.tokenUsed, val: `$${data.used.toFixed(2)}`, color: 'var(--c-peach)' },
                  {
                    label: t.tokenAllReqs,
                    val: data.request_count.toLocaleString(),
                    color: 'var(--c-blue)',
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

              {/* 今日堆叠柱状图 */}
              <div className="flex min-h-0 flex-1 flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] tracking-widest text-[var(--c-overlay0)] uppercase">
                    {t.tokenToday}
                  </p>
                  {maxHourly > 1 && (
                    <span className="text-[9px] text-[var(--c-surface2)]">
                      peak {maxHourly.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* 柱子区域（relative 用于定位 tooltip） */}
                <div
                  className="relative flex min-h-0 flex-1 items-stretch gap-px"
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {slots.map((slot, i) => {
                    const isCurrent = slot.ts === currentHourTs
                    const isHovered = hoveredIdx === i
                    return (
                      <div
                        key={slot.ts}
                        className="flex flex-1 flex-col"
                        style={{
                          cursor: slot.total > 0 ? 'crosshair' : 'default',
                          outline: isCurrent
                            ? '1px solid var(--c-yellow)'
                            : isHovered && slot.total > 0
                              ? '1px solid var(--c-overlay0)'
                              : 'none',
                          outlineOffset: '-1px',
                          transition: 'outline-color 0.1s',
                        }}
                        onMouseEnter={() => setHoveredIdx(i)}
                      >
                        {slot.total === 0 ? (
                          <>
                            <div className="flex-1" />
                            <div
                              style={{ height: 1, background: 'var(--c-surface0)', opacity: 0.3 }}
                            />
                          </>
                        ) : (
                          <>
                            {/* 顶部空白 */}
                            <div style={{ flex: maxHourly - slot.total }} />
                            {/* 各模型色块，从下到上最大的在底 */}
                            {[...slot.segments].reverse().map((seg) => (
                              <div
                                key={seg.model}
                                style={{
                                  flex: seg.tokens,
                                  background: colorOf(seg.model),
                                  transformOrigin: 'bottom',
                                  animation: `bar-grow 0.4s cubic-bezier(.4,0,.2,1) ${i * 12}ms both`,
                                  opacity: hoveredIdx !== null && !isHovered ? 0.45 : 1,
                                  transition: 'opacity 0.12s',
                                }}
                              />
                            ))}
                          </>
                        )}
                      </div>
                    )
                  })}

                  {/* Hover tooltip */}
                  {hoveredSlot && hoveredSlot.total > 0 && hoveredIdx !== null && (
                    <div
                      className="pointer-events-none absolute z-20"
                      style={{
                        ...(hoveredIdx >= 20
                          ? { right: 0, left: 'auto' }
                          : hoveredIdx <= 3
                            ? { left: 0 }
                            : {
                                left: `${((hoveredIdx + 0.5) / 24) * 100}%`,
                                transform: 'translateX(-50%)',
                              }),
                        top: 0,
                        transform:
                          hoveredIdx >= 20 || hoveredIdx <= 3
                            ? 'translateY(calc(-100% - 6px))'
                            : 'translate(-50%, calc(-100% - 6px))',
                        background: 'var(--c-crust)',
                        border: '1px solid var(--c-split)',
                        borderRadius: 3,
                        padding: '5px 8px',
                        minWidth: 120,
                        animation: 'fade-up 0.12s ease both',
                      }}
                    >
                      <p
                        className="mb-1.5 border-b pb-1 text-[9px] tracking-widest text-[var(--c-overlay0)] uppercase"
                        style={{ borderColor: 'var(--c-split)' }}
                      >
                        {hoveredSlot.label}:00 · {hoveredSlot.total.toLocaleString()} tok
                      </p>
                      {[...hoveredSlot.segments]
                        .sort((a, b) => b.tokens - a.tokens)
                        .map((seg) => (
                          <div key={seg.model} className="flex items-center gap-1.5 leading-5">
                            <span
                              className="inline-block h-1.5 w-1.5 shrink-0"
                              style={{ background: colorOf(seg.model) }}
                            />
                            <span
                              className="truncate text-[var(--c-subtext0)]"
                              style={{ maxWidth: 130, fontSize: 10 }}
                            >
                              {seg.model}
                            </span>
                            <span
                              className="ml-auto shrink-0 text-[var(--c-text)]"
                              style={{ fontSize: 10 }}
                            >
                              {formatTokens(seg.tokens)}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* x 轴 */}
                <div className="flex">
                  {slots.map((slot, i) => (
                    <div
                      key={i}
                      className="flex-1 text-center text-[7px]"
                      style={{
                        minWidth: 0,
                        color: slot.ts === currentHourTs ? 'var(--c-yellow)' : 'var(--c-surface2)',
                        fontWeight: slot.ts === currentHourTs ? 'bold' : undefined,
                      }}
                    >
                      {slot.label}
                    </div>
                  ))}
                </div>

                {/* 图例 */}
                {todayModelOrder.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {todayModelOrder.map((model) => (
                      <div
                        key={model}
                        className="flex items-center gap-1 text-[9px] text-[var(--c-overlay0)]"
                      >
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
              <div className="shrink-0 space-y-4">
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
                      style={{ animation: `fade-up .3s ease ${i * 40}ms both` }}
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
                          animation: `bar-reveal 0.5s cubic-bezier(.4,0,.2,1) ${i * 50}ms both`,
                        }}
                      >
                        <span style={{ color }}>{'█'.repeat(filled)}</span>
                        <span style={{ color: 'var(--c-surface1)' }}>
                          {'░'.repeat(MODEL_BAR_W - filled)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* footer */}
              <p
                className="shrink-0 border-t pt-3 text-[9px] text-[var(--c-overlay0)]"
                style={{ borderColor: 'var(--c-split)' }}
              >
                {formatReqs(data.total_requests)} {t.tokenFooter}
              </p>
            </div>
          )}
        </div>
      </Pane>
    </PaneLayout>
  )
}
