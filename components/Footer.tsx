'use client'

import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import SlashCommandPanel from './SlashCommandPanel'

function getLabel(pathname: string) {
  const pathMap: Record<string, string> = {
    '/':         '~',
    '/blog':     '~/blog',
    '/projects': '~/projects',
    '/about':    '~/about',
    '/contact':  '~/contact',
  }
  if (pathname === '/') return pathMap['/']
  for (const [key, label] of Object.entries(pathMap)) {
    if (key !== '/' && pathname.startsWith(key)) return label
  }
  return '~' + pathname
}

const THEMES = [
  { id: 'latte',    label: 'latte' },
  { id: 'mocha',    label: 'mocha' },
  { id: 'old-hope', label: 'old hope' },
]

export default function Footer() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  // 点击外部关闭
  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [])

  const currentLabel = THEMES.find(t => t.id === theme)?.label ?? theme

  return (
    <footer className="z-50 shrink-0" style={{ borderTop: '1px solid var(--c-split)' }}>
      <SlashCommandPanel />

      <div
        className="flex h-7 items-center justify-between px-3"
        style={{ backgroundColor: 'var(--c-crust)', borderTop: '1px solid var(--c-split)' }}
      >
        <span className="font-mono text-xs" style={{ color: 'var(--c-subtext0)' }}>
          <span style={{ color: 'var(--c-green)' }}>[sleeprhino]</span>
          {' '}
          <span style={{ color: 'var(--c-blue)' }}>{getLabel(pathname)}</span>
          <span style={{ color: 'var(--c-text)' }}>/</span>
        </span>

        {mounted && (
          <div ref={ref} className="relative font-mono text-xs">
            {/* 触发按钮 */}
            <button
              onClick={() => setOpen(o => !o)}
              className="group flex items-center gap-1 px-1.5 py-0.5 transition-colors"
              style={{ color: 'var(--c-subtext0)' }}
            >
              <span
                className="transition-colors group-hover:text-[var(--c-text)] group-hover:underline group-hover:decoration-dotted group-hover:underline-offset-2 group-hover:cursor-pointer"
              >
                [{currentLabel}]
              </span>
              <span
                className="transition-colors group-hover:text-[var(--c-text)]"
                style={{ fontSize: 9 }}
              >
                {open ? '▲' : '▼'}
              </span>
            </button>

            {/* 下拉菜单，向上弹出 */}
            {open && (
              <div
                className="absolute bottom-full right-0 mb-1 flex flex-col"
                style={{
                  backgroundColor: 'var(--c-mantle)',
                  border: '1px solid var(--c-split)',
                  minWidth: '6rem',
                }}
              >
                {THEMES.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => { setTheme(id); setOpen(false) }}
                    className="group flex items-center justify-between px-3 py-1.5 text-left transition-colors hover:bg-[var(--c-surface0)]"
                    style={
                      theme === id
                        ? { color: 'var(--c-blue)' }
                        : { color: 'var(--c-subtext0)' }
                    }
                  >
                    <span className="group-hover:underline group-hover:decoration-dotted group-hover:underline-offset-2 group-hover:cursor-pointer group-hover:text-[var(--c-text)]">
                      {label}
                    </span>
                    {theme === id && (
                      <span style={{ fontSize: 8 }}>●</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  )
}
