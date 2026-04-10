'use client'
import React, { useState, Children, isValidElement, ReactElement } from 'react'

interface TabItemProps {
  value: string
  label: string
  children: React.ReactNode
}

export function TabItem({ children }: TabItemProps) {
  return <>{children}</>
}

export function Tabs({ children }: { children: React.ReactNode }) {
  const items = Children.toArray(children).filter(
    (child): child is ReactElement<TabItemProps> => isValidElement(child)
  )
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <div className="my-4 overflow-hidden rounded-md border border-[var(--c-split)] font-mono">
      {/* tab bar */}
      <div className="flex gap-px border-b border-[var(--c-split)] bg-[var(--c-mantle)] px-1 pt-1">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={[
              'rounded-t px-4 sm:px-3 py-2 sm:py-1.5 text-[11px] sm:text-[10px] tracking-wide transition-colors',
              i === activeIdx
                ? 'border-b-2 border-[var(--c-blue)] bg-[var(--c-base)] text-[var(--c-text)]'
                : 'border-b-2 border-transparent text-[var(--c-overlay0)] hover:text-[var(--c-subtext0)]',
            ].join(' ')}
          >
            {item.props.label}
          </button>
        ))}
      </div>
      {/* content */}
      <div className="bg-[var(--c-base)]">
        {items[activeIdx]}
      </div>
    </div>
  )
}
