'use client'

import React from 'react'

type CardType = 'feat' | 'fix' | 'chore' | 'ci' | 'docs'

interface ChangelogCardProps {
  type?: CardType
  title: string
  hash?: string
  date?: string
  children?: React.ReactNode
}

const TYPE_STYLES: Record<CardType, { color: string; bg: string; border: string }> = {
  feat: { color: 'var(--c-blue)', bg: 'rgba(137,180,250,0.06)', border: 'var(--c-blue)' },
  fix: { color: 'var(--c-peach)', bg: 'rgba(250,179,135,0.06)', border: 'var(--c-peach)' },
  chore: { color: 'var(--c-overlay1)', bg: 'rgba(108,112,134,0.06)', border: 'var(--c-overlay1)' },
  ci: { color: 'var(--c-mauve)', bg: 'rgba(203,166,247,0.06)', border: 'var(--c-mauve)' },
  docs: { color: 'var(--c-green)', bg: 'rgba(166,227,161,0.06)', border: 'var(--c-green)' },
}

export function ChangelogCard({ type = 'feat', title, hash, date, children }: ChangelogCardProps) {
  const { color, bg, border } = TYPE_STYLES[type]

  return (
    <div
      className="not-prose my-4 overflow-hidden font-mono text-xs"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderLeft: `3px solid ${border}`,
      }}
    >
      {/* 顶部标题栏 */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: children ? `1px solid var(--c-split)` : undefined }}
      >
        <div className="flex min-w-0 items-center gap-2">
          {/* type badge */}
          <span
            className="shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold tracking-widest uppercase"
            style={{ color, background: `color-mix(in srgb, ${color} 15%, transparent)` }}
          >
            {type}
          </span>
          {/* title */}
          <span className="truncate" style={{ color: 'var(--c-text)' }}>
            {title}
          </span>
        </div>
        {/* meta: hash + date */}
        <div
          className="ml-4 flex shrink-0 items-center gap-3"
          style={{ color: 'var(--c-overlay0)' }}
        >
          {date && <span>{date}</span>}
          {hash && (
            <span
              className="rounded-sm px-1 py-0.5 text-[10px]"
              style={{ background: 'var(--c-surface0)', color: 'var(--c-overlay1)' }}
            >
              {hash.slice(0, 7)}
            </span>
          )}
        </div>
      </div>

      {/* 正文 */}
      {children && (
        <div
          className="px-3 py-2.5 leading-relaxed [&_code]:text-[var(--c-mauve)] [&_p]:mb-2 [&_p]:last:mb-0 [&_pre]:rounded [&_pre]:bg-[var(--c-mantle)] [&_pre]:px-3 [&_pre]:py-2 [&_pre]:text-[11px] [&_pre]:leading-relaxed"
          style={{
            color: 'var(--c-subtext0)',
          }}
        >
          <style>{`
            .changelog-body pre {
              overflow-x: hidden !important;
              white-space: pre-wrap !important;
              word-break: break-word !important;
            }
          `}</style>
          <div className="changelog-body">{children}</div>
        </div>
      )}
    </div>
  )
}
