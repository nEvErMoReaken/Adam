'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const BLOCKS = 40

export default function PixelLoader() {
  const pathname  = usePathname()
  const prevPath  = useRef(pathname)
  const [active,  setActive]  = useState(false)
  const [filled,  setFilled]  = useState(0)
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const start = () => {
    clearInterval(timer.current)
    setFilled(0)
    setActive(true)
    setVisible(true)
  }

  const finish = () => {
    clearInterval(timer.current)
    setActive(false)
    setFilled(BLOCKS)
    setTimeout(() => setVisible(false), 350)
    setTimeout(() => setFilled(0), 400)
  }

  // detect link clicks → start
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a[href]')
      if (!a) return
      const href = a.getAttribute('href') ?? ''
      if (!href || href.startsWith('#') || /^(https?:|mailto:|\/\/)/.test(href)) return
      start()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // pathname change → finish
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname
      finish()
    }
  }, [pathname])

  // crawl progress while active
  useEffect(() => {
    if (!active) return
    timer.current = setInterval(() => {
      setFilled(f => {
        const ceiling = BLOCKS - 6          // stall before end
        if (f >= ceiling) return ceiling
        const step = Math.random() < 0.3 ? 2 : 1
        return Math.min(f + step, ceiling)
      })
    }, 55)
    return () => clearInterval(timer.current)
  }, [active])

  if (!visible) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999]"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* pixel block bar */}
      <div className="flex" style={{ height: 5, gap: 2, padding: '0 2px' }}>
        {Array.from({ length: BLOCKS }, (_, i) => {
          const isHead = i === filled - 1 && active
          const isFill = i < filled
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: '100%',
                background: isHead
                  ? 'var(--c-text)'
                  : isFill
                  ? 'var(--c-blue)'
                  : 'color-mix(in srgb, var(--c-surface0) 60%, transparent)',
                boxShadow: isHead ? '0 0 6px var(--c-blue)' : undefined,
                transition: isFill ? 'background 0.05s' : 'none',
              }}
            />
          )
        })}
      </div>

      {/* scanline shimmer on active head */}
      {active && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${(filled / BLOCKS) * 100}%`,
            width: 40,
            height: 5,
            background: 'linear-gradient(90deg, var(--c-blue) 0%, transparent 100%)',
            opacity: 0.4,
            transform: 'translateX(-100%)',
          }}
        />
      )}
    </div>
  )
}
