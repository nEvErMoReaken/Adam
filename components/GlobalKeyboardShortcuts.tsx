'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const GOTO_MAP: Record<string, string> = {
  h: '/', b: '/blog', p: '/projects', a: '/about', c: '/contact',
}

export default function GlobalKeyboardShortcuts() {
  const router = useRouter()
  const gPending = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (document.activeElement as HTMLElement)?.tagName
      const editable = (document.activeElement as HTMLElement)?.isContentEditable
      const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || editable

      // Ctrl+K → 由 SlashCommandPanel 自身处理
      if (inInput) return

      // g → 等待第二键
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        gPending.current = true
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => { gPending.current = false }, 1000)
        return
      }

      // g + h/b/p/a/c → 跳转
      if (gPending.current) {
        gPending.current = false
        if (timer.current) clearTimeout(timer.current)
        if (GOTO_MAP[e.key]) {
          e.preventDefault()
          router.push(GOTO_MAP[e.key])
        }
        return
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  return null
}
