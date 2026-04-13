'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

// Focus context
const PaneFocusContext = createContext<{
  focused: number
  setFocused: (i: number) => void
}>({ focused: 0, setFocused: () => {} })

interface PaneProps {
  title: string
  index: number
  children: ReactNode
  className?: string
}

/** 单个 pane 面板，带标题栏 */
export function Pane({ title, index, children, className = '' }: PaneProps) {
  const { focused, setFocused } = useContext(PaneFocusContext)
  const isFocused = focused === index

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <section
      className={`flex min-h-0 flex-col bg-[var(--c-base)] transition-colors ${className}`}
      style={{
        border: isFocused ? '1px solid var(--c-blue)' : '1px solid var(--c-split)',
        boxShadow: isFocused ? 'inset 0 0 0 1px var(--c-blue)' : undefined,
        outline: 'none',
      }}
      onMouseDown={() => setFocused(index)}
    >
      <div className="pane-titlebar">
        <span
          className="font-semibold"
          style={{ color: isFocused ? 'var(--c-blue)' : 'var(--c-text)' }}
        >
          {title}
        </span>
        <span style={{ color: isFocused ? 'var(--c-blue)' : 'var(--c-subtext0)' }}>{index}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </section>
  )
}

interface PaneLayoutProps {
  children: ReactNode
  cols?: string
}

/** 多 pane 网格容器 */
export function PaneLayout({
  children,
  cols = 'grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,1fr)]',
}: PaneLayoutProps) {
  const [focused, setFocused] = useState(0)

  return (
    <PaneFocusContext.Provider value={{ focused, setFocused }}>
      <div
        className={`grid h-full ${cols}`}
        style={{ backgroundColor: 'var(--c-split)', gap: '1px' }}
      >
        {children}
      </div>
    </PaneFocusContext.Provider>
  )
}
