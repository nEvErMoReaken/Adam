'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Handler = (e: KeyboardEvent) => void

/**
 * 全局键盘快捷键注册器
 * 自动跳过 INPUT / TEXTAREA / contenteditable 焦点状态
 */
export function useGlobalKey(handler: Handler, skip = true) {
  const ref = useRef(handler)
  ref.current = handler

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (skip) {
        const tag = (document.activeElement as HTMLElement)?.tagName
        const editable = (document.activeElement as HTMLElement)?.isContentEditable
        if (tag === 'INPUT' || tag === 'TEXTAREA' || editable) return
      }
      ref.current(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [skip])
}

/**
 * 页面跳转快捷键：g + 第二键
 * g h → home, g b → blog, g p → projects, g a → about, g c → contact
 */
export function useGotoKeys() {
  const router = useRouter()
  const pending = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useGlobalKey((e) => {
    if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
      pending.current = true
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        pending.current = false
      }, 1000)
      return
    }
    if (!pending.current) return
    pending.current = false
    if (timer.current) clearTimeout(timer.current)

    const map: Record<string, string> = {
      h: '/',
      b: '/blog',
      p: '/projects',
      a: '/about',
      c: '/contact',
    }
    if (map[e.key]) {
      e.preventDefault()
      router.push(map[e.key])
    }
  })
}
