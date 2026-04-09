'use client'

import { useEffect, useState } from 'react'
import { PaneLayout, Pane } from '@/components/PaneLayout'

interface ModelStat {
  model: string
  prompt: number
  completion: number
  total: number
  requests: number
}

interface IinaData {
  models: ModelStat[]
  total_requests: number
  sampled: number
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

const BAR_W = 28

const COLORS = [
  'var(--c-blue)',
  'var(--c-mauve)',
  'var(--c-green)',
  'var(--c-peach)',
  'var(--c-teal)',
  'var(--c-yellow)',
  'var(--c-red)',
  'var(--c-sapphire)',
]

export default function IinaTokensPage() {
  const [data, setData] = useState<IinaData | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    fetch('/api/iina')
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then((j: IinaData) => setData(j))
      .catch(() => setErr(true))
  }, [])

  const models = data?.models ?? []
  const maxTotal = models[0]?.total ?? 1
  const grandTotal = models.reduce((s, m) => s + m.total, 0)
  const grandPrompt = models.reduce((s, m) => s + m.prompt, 0)
  const grandCompletion = models.reduce((s, m) => s + m.completion, 0)

  return (
    <>
      <style>{`
        @keyframes token-bar { from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0% 0 0) } }
        @keyframes token-in  { from { opacity:0; transform:translateY(4px) } to { opacity:1; transform:none } }
      `}</style>
      <PaneLayout cols="grid-cols-1">
        <Pane title="token-usage" index={0}>
          <div className="p-5 font-mono text-[11px] text-[var(--c-subtext0)]">

            {/* prompt line */}
            <div className="mb-5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px]">
              <span className="text-[var(--c-blue)]">❯</span>
              <span className="text-[var(--c-overlay0)]">token-usage --all-models</span>
            </div>

            {err && (
              <p className="text-[var(--c-red)]">
                <span className="text-[var(--c-overlay0)]">error</span>
                {' '}connection refused — iina.ai
              </p>
            )}

            {!data && !err && (
              <div className="flex items-center gap-2 text-[var(--c-overlay0)]">
                <span className="animate-pulse">▌</span>
                <span>fetching...</span>
              </div>
            )}

            {data && (
              <div className="space-y-8" style={{ animation: 'token-in .3s ease both' }}>

                {/* summary row */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-4 border-b pb-5" style={{ borderColor: 'var(--c-split)' }}>
                  {[
                    { label: 'total tokens',  val: formatTokens(grandTotal),      color: 'var(--c-text)' },
                    { label: 'prompt',        val: formatTokens(grandPrompt),      color: 'var(--c-blue)' },
                    { label: 'completion',    val: formatTokens(grandCompletion),  color: 'var(--c-green)' },
                    { label: 'requests',      val: formatReqs(data.total_requests),color: 'var(--c-mauve)' },
                  ].map(({ label, val, color }) => (
                    <div key={label}>
                      <p className="text-[9px] uppercase tracking-widest text-[var(--c-overlay0)] mb-0.5">{label}</p>
                      <p className="text-lg font-bold leading-none" style={{ color }}>{val}</p>
                    </div>
                  ))}
                </div>

                {/* per-model breakdown */}
                <div className="space-y-5">
                  <p className="text-[9px] uppercase tracking-widest text-[var(--c-overlay0)]">
                    by model
                  </p>
                  {models.map((m, i) => {
                    const pct = m.total / maxTotal
                    const filled = Math.round(pct * BAR_W)
                    const color = COLORS[i % COLORS.length]
                    const promptPct = m.total > 0 ? m.prompt / m.total : 0
                    const compPct   = m.total > 0 ? m.completion / m.total : 0
                    return (
                      <div key={m.model} className="space-y-[5px]" style={{ animation: `token-in .3s ease ${i * 40}ms both` }}>
                        {/* name + total */}
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-[var(--c-text)] text-[12px]">{m.model}</span>
                          <span className="shrink-0 text-[var(--c-overlay0)]">
                            {formatTokens(m.total)} · {formatReqs(m.requests)} reqs
                          </span>
                        </div>
                        {/* total bar */}
                        <div style={{
                          overflow: 'hidden', whiteSpace: 'nowrap', fontSize: 10,
                          animation: `token-bar 0.5s cubic-bezier(.4,0,.2,1) ${i * 50}ms both`,
                        }}>
                          <span style={{ color }}>{'█'.repeat(filled)}</span>
                          <span style={{ color: 'var(--c-surface1)' }}>{'░'.repeat(BAR_W - filled)}</span>
                        </div>
                        {/* prompt / completion split */}
                        <div className="flex gap-4 text-[9px] text-[var(--c-overlay0)]">
                          <span>
                            <span className="text-[var(--c-blue)]">↑</span>
                            {' prompt '}{formatTokens(m.prompt)}
                            {' '}({(promptPct * 100).toFixed(0)}%)
                          </span>
                          <span>
                            <span className="text-[var(--c-green)]">↓</span>
                            {' completion '}{formatTokens(m.completion)}
                            {' '}({(compPct * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* footer */}
                <p className="text-[9px] text-[var(--c-overlay0)] border-t pt-3" style={{ borderColor: 'var(--c-split)' }}>
                  sampled {formatReqs(data.sampled)} / {formatReqs(data.total_requests)} records
                </p>

              </div>
            )}
          </div>
        </Pane>
      </PaneLayout>
    </>
  )
}
