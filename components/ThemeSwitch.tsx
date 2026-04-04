'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return <span className="inline-block h-6 w-6" />

  return (
    <button
      aria-label="切换主题"
      onClick={() => setTheme(theme === 'mocha' ? 'latte' : 'mocha')}
      className="font-mono text-xs text-[var(--c-subtext0)] transition-colors hover:text-[var(--c-text)]"
    >
      {theme === 'mocha' ? '[☀]' : '[☾]'}
    </button>
  )
}
