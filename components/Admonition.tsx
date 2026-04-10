import React from 'react'

type AdmonitionType = 'info' | 'tip' | 'warning' | 'note' | 'success'

interface AdmonitionProps {
  type?: AdmonitionType
  title?: string
  children: React.ReactNode
}

const STYLES: Record<AdmonitionType, { color: string; icon: string }> = {
  info:    { color: 'var(--c-blue)',    icon: 'ℹ' },
  tip:     { color: 'var(--c-green)',   icon: '▶' },
  warning: { color: 'var(--c-peach)',   icon: '⚠' },
  note:    { color: 'var(--c-overlay0)', icon: '·' },
  success: { color: 'var(--c-green)',   icon: '✓' },
}

export function Admonition({ type = 'info', title, children }: AdmonitionProps) {
  const { color, icon } = STYLES[type]
  return (
    <div style={{
      margin: '1rem 0',
      padding: '12px 16px',
      borderLeft: `3px solid ${color}`,
      background: 'var(--c-surface0)',
      borderRadius: '0 4px 4px 0',
      fontFamily: 'monospace',
      fontSize: '12px',
    }}>
      <div style={{ color, fontSize: '10px', marginBottom: '6px', letterSpacing: '1px', fontWeight: 'bold' }}>
        {icon} {(title ?? type).toUpperCase()}
      </div>
      <div style={{ color: 'var(--c-subtext0)', lineHeight: '1.7' }}>
        {children}
      </div>
    </div>
  )
}
