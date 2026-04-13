'use client'

import { useEffect, useRef, useState } from 'react'

const USERNAME = 'Jmh246'
const API_URL = `/api/codestats`

interface LangEntry {
  xps: number
  new_xps: number
}

interface CodeStatsData {
  user: string
  total_xp: number
  new_xp: number
  languages: Record<string, LangEntry>
  dates: Record<string, number>
}

type DatesData = Record<string, number>

function formatXP(xp: number): string {
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}M`
  if (xp >= 1_000) return `${(xp / 1_000).toFixed(1)}k`
  return String(xp)
}

function xpToLevel(xp: number): number {
  return Math.floor(0.025 * Math.sqrt(xp))
}

function buildCalendarGrid(dates: DatesData): { date: string; xp: number }[][] {
  const today = new Date()
  const endDay = new Date(today)
  endDay.setDate(today.getDate() + (6 - today.getDay()))

  const weeks: { date: string; xp: number }[][] = []
  const cursor = new Date(endDay)
  cursor.setDate(cursor.getDate() - 52 * 7)
  cursor.setDate(cursor.getDate() - cursor.getDay())

  while (cursor <= endDay) {
    const week: { date: string; xp: number }[] = []
    for (let d = 0; d < 7; d++) {
      const iso = cursor.toISOString().slice(0, 10)
      week.push({ date: iso, xp: dates[iso] ?? 0 })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

function xpToIntensity(xp: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (xp === 0) return 0
  const r = xp / max
  if (r < 0.15) return 1
  if (r < 0.4) return 2
  if (r < 0.7) return 3
  return 4
}

const CELL_BG: Record<number, string> = {
  0: 'var(--c-surface0)',
  1: 'color-mix(in srgb, var(--c-blue) 18%, var(--c-surface0))',
  2: 'color-mix(in srgb, var(--c-blue) 40%, var(--c-surface0))',
  3: 'color-mix(in srgb, var(--c-blue) 65%, var(--c-surface0))',
  4: 'var(--c-blue)',
}

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
// only label Mon / Wed / Fri rows (indices 1, 3, 5)
const DOW_LABELS = ['', 'M', '', 'W', '', 'F', '']

const CELL = 11
const GAP = 2

/* ─── Heatmap ───────────────────────────────────────────────── */
function Heatmap({ dates }: { dates: DatesData }) {
  const weeks = buildCalendarGrid(dates)
  const maxXP = Math.max(...Object.values(dates), 1)
  const todayS = new Date().toISOString().slice(0, 10)

  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  // month label positions
  const monthLabels: { label: string; col: number }[] = []
  weeks.forEach((week, wi) => {
    const m = parseInt(week[0].date.slice(5, 7)) - 1
    const prev = wi > 0 ? parseInt(weeks[wi - 1][0].date.slice(5, 7)) - 1 : -1
    if (m !== prev) monthLabels.push({ label: MONTH_NAMES[m], col: wi })
  })

  return (
    <div className="overflow-x-auto">
      <div ref={ref} className="relative select-none" style={{ minWidth: 'max-content' }}>
        {/* month row */}
        <div className="mb-[3px] flex" style={{ paddingLeft: 18 }}>
          {weeks.map((_, wi) => {
            const ml = monthLabels.find((m) => m.col === wi)
            return (
              <div
                key={wi}
                style={{ width: CELL + GAP, flexShrink: 0, fontSize: 9 }}
                className="font-mono leading-none text-[var(--c-overlay0)]"
              >
                {ml?.label ?? ''}
              </div>
            )
          })}
        </div>

        <div className="flex" style={{ gap: GAP }}>
          {/* day-of-week col */}
          <div className="flex shrink-0 flex-col" style={{ gap: GAP, marginRight: 2 }}>
            {DOW_LABELS.map((label, i) => (
              <div
                key={i}
                style={{ width: 12, height: CELL, fontSize: 9, lineHeight: 1 }}
                className="flex items-center justify-end font-mono text-[var(--c-overlay0)]"
              >
                {label}
              </div>
            ))}
          </div>

          {/* week columns */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
              {week.map((day, di) => {
                const intensity = xpToIntensity(day.xp, maxXP)
                const isFuture = day.date > todayS
                return (
                  <div
                    key={di}
                    style={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 2,
                      backgroundColor: isFuture ? 'transparent' : CELL_BG[intensity],
                      transition: 'opacity 0.12s',
                      opacity: isFuture ? 0 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (isFuture || day.xp === 0) return
                      const cr = ref.current?.getBoundingClientRect()
                      const el = (e.target as HTMLElement).getBoundingClientRect()
                      setTip({
                        x: el.left - (cr?.left ?? 0) + CELL / 2,
                        y: el.top - (cr?.top ?? 0) - 6,
                        text: `${day.date}  ${formatXP(day.xp)} xp`,
                      })
                    }}
                    onMouseLeave={() => setTip(null)}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {tip && (
          <div
            className="pointer-events-none absolute z-20 font-mono whitespace-nowrap"
            style={{
              left: tip.x,
              top: tip.y,
              transform: 'translate(-50%, -100%)',
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 3,
              border: '1px solid var(--c-split)',
              backgroundColor: 'var(--c-crust)',
              color: 'var(--c-text)',
            }}
          >
            {tip.text}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Lang bars ─────────────────────────────────────────────── */
function LangBars({ langs }: { langs: [string, LangEntry][] }) {
  const top = langs.slice(0, 6)
  const maxXP = top[0]?.[1].xps ?? 1

  // bar chars — full + half block for sub-character precision
  function makeBar(pct: number, width: number): string {
    const full = Math.floor(pct * width)
    const frac = pct * width - full
    const half = frac >= 0.5 ? '▌' : ''
    const empty = width - full - (half ? 1 : 0)
    return '█'.repeat(full) + half + '░'.repeat(Math.max(0, empty))
  }

  const BAR_W = 20

  return (
    <div className="space-y-[5px]">
      {top.map(([lang, entry], i) => {
        const pct = entry.xps / maxXP
        return (
          <div key={lang} className="font-mono text-[11px] leading-none">
            {/* name + xp on one line */}
            <div className="mb-[2px] flex justify-between">
              <span className="max-w-[9rem] truncate text-[var(--c-text)]">{lang}</span>
              <span className="ml-2 shrink-0 text-[var(--c-overlay0)]">{formatXP(entry.xps)}</span>
            </div>
            {/* bar */}
            <div
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                animation: `cs-bar 0.55s cubic-bezier(.4,0,.2,1) ${i * 55}ms both`,
              }}
            >
              <span className="text-[var(--c-blue)]">{'█'.repeat(Math.round(pct * BAR_W))}</span>
              <span className="text-[var(--c-surface1)]">
                {'░'.repeat(BAR_W - Math.round(pct * BAR_W))}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Root ──────────────────────────────────────────────────── */
export default function CodeStatsWidget() {
  const [data, setData] = useState<CodeStatsData | null>(null)
  const [dates, setDates] = useState<DatesData | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    fetch(API_URL)
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((j: CodeStatsData) => {
        setData(j)
        setDates(j.dates ?? {})
      })
      .catch(() => setErr(true))
  }, [])

  const topLangs = data ? Object.entries(data.languages).sort((a, b) => b[1].xps - a[1].xps) : []

  const level = data ? xpToLevel(data.total_xp) : 0
  const nextLvl = level + 1
  // XP needed: inverse of level formula  xp = (lvl / 0.025)^2
  const xpForNext = Math.ceil(Math.pow(nextLvl / 0.025, 2))
  const xpForCurr = Math.ceil(Math.pow(level / 0.025, 2))
  const lvlPct = data ? (data.total_xp - xpForCurr) / (xpForNext - xpForCurr) : 0

  return (
    <>
      <style>{`
        @keyframes cs-bar  { from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0% 0 0) } }
        @keyframes cs-in   { from { opacity:0; transform:translateY(3px) } to { opacity:1; transform:none } }
      `}</style>

      <div className="space-y-4 font-mono text-[11px] text-[var(--c-subtext0)]">
        {/* ── prompt line ── */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <span className="text-[var(--c-blue)]">❯</span>
          <span>code-stats</span>
          <span className="text-[var(--c-overlay0)]">fetch</span>
          <a
            href={`https://codestats.net/users/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--c-mauve)] transition-opacity hover:opacity-70"
          >
            {USERNAME}
          </a>
        </div>

        {err && (
          <p className="text-[var(--c-red)]">
            <span className="text-[var(--c-overlay0)]">error</span> connection refused —
            codestats.net
          </p>
        )}

        {!data && !err && (
          <div className="flex items-center gap-2 text-[var(--c-overlay0)]">
            <span className="animate-pulse">▌</span>
            <span>fetching...</span>
          </div>
        )}

        {data && dates && (
          <div className="space-y-4" style={{ animation: 'cs-in .3s ease both' }}>
            {/* ── level block ── */}
            <div className="space-y-[5px]">
              <div className="flex items-baseline gap-2">
                <span className="text-base leading-none font-bold text-[var(--c-text)]">
                  Lv.{level}
                </span>
                <span className="text-[var(--c-overlay0)]">{formatXP(data.total_xp)} xp</span>
                {data.new_xp > 0 && (
                  <span className="text-[var(--c-green)]">+{formatXP(data.new_xp)} today</span>
                )}
              </div>

              {/* level progress bar */}
              <div className="flex items-center gap-1.5">
                <span className="shrink-0 text-[var(--c-overlay0)]" style={{ fontSize: 9 }}>
                  {level}
                </span>
                <div
                  className="flex flex-1 text-[var(--c-blue)]"
                  style={{ fontSize: 10, lineHeight: 1 }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: `${lvlPct * 100}%`,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {'━'.repeat(30)}
                  </span>
                  <span
                    className="text-[var(--c-surface1)]"
                    style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    {'━'.repeat(30)}
                  </span>
                </div>
                <span className="shrink-0 text-[var(--c-overlay0)]" style={{ fontSize: 9 }}>
                  {nextLvl}
                </span>
              </div>
              <p className="text-[var(--c-overlay0)]" style={{ fontSize: 9 }}>
                {formatXP(xpForNext - data.total_xp)} xp to next level
              </p>
            </div>

            {/* ── heatmap ── */}
            <div className="space-y-1.5">
              <p className="text-[9px] tracking-widest text-[var(--c-overlay0)] uppercase">
                xp / day · last 52 weeks
              </p>
              <Heatmap dates={dates} />
            </div>

            {/* ── lang bars ── */}
            <div className="space-y-1.5">
              <p className="text-[9px] tracking-widest text-[var(--c-overlay0)] uppercase">
                languages
              </p>
              <LangBars langs={topLangs} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
