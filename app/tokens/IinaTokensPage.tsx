'use client'

import { useEffect, useState } from 'react'
import { PaneLayout, Pane } from '@/components/PaneLayout'
import { useLang } from '@/lib/i18n'

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
  const grandTotal = models.reduce((s, m) => s + m.total, 0)

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
              <div className="space-y-8" style={{ animation: 'token-in .3s ease both' }}>
                {/* summary row */}
                <div
                  className="grid grid-cols-2 gap-x-8 gap-y-1 border-b pb-5 sm:grid-cols-2"
                  style={{ borderColor: 'var(--c-split)' }}
                >
                  {[
                    { label: t.tokenTotalTokens, val: formatTokens(grandTotal), color: 'var(--c-text)' },
                    { label: t.tokenRequests, val: formatReqs(data.total_requests), color: 'var(--c-mauve)' },
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

                {/* per-model breakdown */}
                <div className="space-y-5">
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
                        {/* name + total */}
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-[12px] text-[var(--c-text)]">{m.model}</span>
                          <span className="shrink-0 text-[var(--c-overlay0)]">
                            {formatTokens(m.total)} · {formatReqs(m.requests)} reqs
                          </span>
                        </div>
                        {/* total bar */}
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
