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

interface TabsProps {
  children: React.ReactNode
}

export function Tabs({ children }: TabsProps) {
  const items = Children.toArray(children).filter(
    (child): child is ReactElement<TabItemProps> => isValidElement(child)
  )
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <div style={{ margin: '1rem 0', fontFamily: 'monospace' }}>
      {/* tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--c-split)',
        background: 'var(--c-mantle)',
        borderRadius: '4px 4px 0 0',
        padding: '0 4px',
        gap: '2px',
      }}>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            style={{
              padding: '6px 14px',
              fontSize: '10px',
              fontFamily: 'monospace',
              background: 'transparent',
              color: i === activeIdx ? 'var(--c-text)' : 'var(--c-overlay0)',
              border: 'none',
              borderBottom: i === activeIdx ? '2px solid var(--c-blue)' : '2px solid transparent',
              cursor: 'pointer',
              letterSpacing: '0.5px',
              transition: 'color 0.1s',
            }}
          >
            {item.props.label}
          </button>
        ))}
      </div>
      {/* content */}
      <div style={{
        border: '1px solid var(--c-split)',
        borderTop: 'none',
        borderRadius: '0 0 4px 4px',
        background: 'var(--c-base)',
      }}>
        {items[activeIdx]}
      </div>
    </div>
  )
}
