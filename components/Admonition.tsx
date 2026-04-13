import React from 'react'

type AdmonitionType = 'info' | 'tip' | 'warning' | 'note' | 'success'

interface AdmonitionProps {
  type?: AdmonitionType
  title?: string
  children: React.ReactNode
}

const STYLES: Record<AdmonitionType, { border: string; icon: string; label: string }> = {
  info: { border: 'border-[var(--c-blue)]', icon: 'ℹ', label: 'text-[var(--c-blue)]' },
  tip: { border: 'border-[var(--c-green)]', icon: '▶', label: 'text-[var(--c-green)]' },
  warning: { border: 'border-[var(--c-peach)]', icon: '⚠', label: 'text-[var(--c-peach)]' },
  note: { border: 'border-[var(--c-overlay0)]', icon: '·', label: 'text-[var(--c-overlay0)]' },
  success: { border: 'border-[var(--c-green)]', icon: '✓', label: 'text-[var(--c-green)]' },
}

export function Admonition({ type = 'info', title, children }: AdmonitionProps) {
  const { border, icon, label } = STYLES[type]
  return (
    <div
      className={`my-4 rounded-r border-l-4 bg-[var(--c-surface0)] px-4 py-3 font-mono text-[12px] ${border}`}
    >
      <div className={`mb-1.5 text-[10px] font-bold tracking-widest uppercase ${label}`}>
        {icon} {title ?? type}
      </div>
      <div className="leading-relaxed text-[var(--c-subtext0)]">{children}</div>
    </div>
  )
}
