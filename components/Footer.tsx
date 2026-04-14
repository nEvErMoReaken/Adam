'use client'

import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import SlashCommandPanel from './SlashCommandPanel'

function getLabel(pathname: string) {
  const pathMap: Record<string, string> = {
    '/': '~',
    '/blog': '~/blog',
    '/projects': '~/projects',
    '/about': '~/about',
    '/contact': '~/contact',
  }
  if (pathname === '/') return pathMap['/']
  for (const [key, label] of Object.entries(pathMap)) {
    if (key !== '/' && pathname.startsWith(key)) return label
  }
  return '~' + pathname
}

const THEMES = [
  { id: 'latte', label: 'latte' },
  { id: 'mocha', label: 'mocha' },
  { id: 'old-hope', label: 'old hope' },
]

export default function Footer() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [])

  const today = mounted ? new Date().toISOString().slice(0, 10) : ''
  const currentLabel = THEMES.find((t) => t.id === theme)?.label ?? theme

  return (
    <footer className="z-50 shrink-0 select-none">
      <SlashCommandPanel />

      {/* 状态栏 */}
      <div
        className="flex h-7 items-center justify-between px-3 font-mono text-xs"
        style={{ backgroundColor: 'var(--c-crust)', borderTop: '1px solid var(--c-split)' }}
      >
        {/* 左：[用户名] ~/路径/ */}
        <span style={{ color: 'var(--c-subtext0)' }}>
          <span style={{ color: 'var(--c-green)' }}>[Jimmy]</span>{' '}
          <span style={{ color: 'var(--c-blue)' }}>{getLabel(pathname)}</span>
          <span style={{ color: 'var(--c-text)' }}>/</span>
        </span>

        {/* 右：主题选择 + 日期 */}
        {mounted && (
          <div className="flex items-center gap-3" style={{ color: 'var(--c-subtext0)' }}>
            {/* 主题下拉 */}
            <div ref={ref} className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                data-theme-toggle
                className="group flex items-center gap-1 transition-colors"
                style={{ color: 'var(--c-subtext0)' }}
              >
                <span className="transition-colors group-hover:text-[var(--c-text)]">
                  [{currentLabel}]
                </span>
                <span
                  className="transition-colors group-hover:text-[var(--c-text)]"
                  style={{ fontSize: 9 }}
                >
                  {open ? '▲' : '▼'}
                </span>
              </button>
              {open && (
                <div
                  className="absolute right-0 bottom-full mb-1 flex flex-col"
                  style={{
                    backgroundColor: 'var(--c-mantle)',
                    border: '1px solid var(--c-split)',
                    minWidth: '6rem',
                  }}
                >
                  {THEMES.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => {
                        setOpen(false)
                        if (typeof document !== 'undefined' && 'startViewTransition' in document) {
                          // 以主题按钮为圆心扩散
                          const btn = document.querySelector('[data-theme-toggle]') as HTMLElement
                          if (btn) {
                            const r = btn.getBoundingClientRect()
                            const x = (((r.left + r.width / 2) / window.innerWidth) * 100).toFixed(
                              1
                            )
                            const y = (((r.top + r.height / 2) / window.innerHeight) * 100).toFixed(
                              1
                            )
                            document.documentElement.style.setProperty('--theme-origin-x', `${x}%`)
                            document.documentElement.style.setProperty('--theme-origin-y', `${y}%`)
                          }
                          ;(
                            document as Document & { startViewTransition: (cb: () => void) => void }
                          ).startViewTransition(() => setTheme(id))
                        } else {
                          setTheme(id)
                        }
                      }}
                      className="flex w-full items-center justify-between px-3 py-1.5 text-left transition-colors hover:bg-[var(--c-surface0)]"
                      style={{ color: theme === id ? 'var(--c-blue)' : 'var(--c-subtext0)' }}
                    >
                      <span>{label}</span>
                      {theme === id && <span style={{ fontSize: 8 }}>●</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span>{today}</span>
          </div>
        )}
      </div>
    </footer>
  )
}
