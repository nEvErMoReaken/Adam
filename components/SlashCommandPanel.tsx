'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Command } from 'cmdk'
import { useKBar } from 'kbar'
import { useLang } from '@/lib/i18n'

export default function SlashCommandPanel() {
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const { t } = useLang()
  const { query } = useKBar()
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setOpen(focused || value.startsWith('/'))
  }, [value, focused])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setFocused(true)
        setOpen(true)
        return
      }
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === '/') {
        e.preventDefault()
        inputRef.current?.focus()
        setValue('/')
      }
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function close() {
    setValue('')
    setOpen(false)
    setFocused(false)
    inputRef.current?.blur()
  }

  function navigate(href: string) {
    close()
    router.push(href)
  }

  function runAction(action: string) {
    if (action === 'theme') {
      setTheme(theme === 'latte' ? 'mocha' : 'latte')
    } else if (action === 'search') {
      close()
      query.toggle()
      return
    }
    close()
  }

  const PAGES = [
    { cmd: '/home', href: '/', label: t.slashHome, hint: '~/' },
    { cmd: '/blog', href: '/blog', label: t.slashBlog, hint: 'blog/' },
    { cmd: '/projects', href: '/projects', label: t.slashProjects, hint: 'projects/' },
    { cmd: '/about', href: '/about', label: t.slashAbout, hint: 'about/' },
    { cmd: '/contact', href: '/contact', label: t.slashContact, hint: 'contact/' },
  ]
  const ACTIONS = [
    { cmd: '/search', label: t.slashSearch, hint: 'grep', action: 'search' },
    { cmd: '/theme', label: t.slashTheme, hint: 'toggle', action: 'theme' },
  ]

  return (
    <div className="relative font-mono" style={{ borderTop: '1px solid var(--c-split)' }}>
      <Command shouldFilter={true} onKeyDown={(e) => e.key === 'Escape' && close()}>
        {/* 候选框 */}
        {open && (
          <div
            className="absolute right-0 bottom-full left-0"
            style={{
              background: 'var(--c-mantle)',
              borderTop: '1px solid var(--c-split)',
              borderLeft: '1px solid var(--c-split)',
              borderRight: '1px solid var(--c-split)',
              boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
              zIndex: 50,
            }}
          >
            <Command.List>
              <Command.Empty className="px-4 py-2 text-xs" style={{ color: 'var(--c-subtext0)' }}>
                {t.noMatch}
              </Command.Empty>

              <Command.Group>
                <div
                  className="px-4 pt-2 pb-0.5 text-[10px] tracking-widest uppercase select-none"
                  style={{ color: 'var(--c-overlay0)' }}
                >
                  {t.groupPages}
                </div>
                {PAGES.map((item) => (
                  <Command.Item
                    key={item.cmd}
                    value={item.cmd}
                    onSelect={() => navigate(item.href)}
                    className="group flex cursor-pointer items-center gap-0 py-1.5 text-xs transition-colors data-[selected=true]:bg-[var(--c-surface0)]"
                  >
                    <span className="w-4 shrink-0 text-center text-[var(--c-blue)] opacity-0 group-data-[selected=true]:opacity-100">
                      |
                    </span>
                    <span
                      className="flex-1 group-data-[selected=true]:text-[var(--c-blue)]"
                      style={{ color: 'var(--c-text)' }}
                    >
                      {item.cmd}
                    </span>
                    <span
                      className="pr-4 text-[10px] tabular-nums"
                      style={{ color: 'var(--c-overlay0)' }}
                    >
                      {item.label}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group>
                <div
                  className="px-4 pt-2.5 pb-0.5 text-[10px] tracking-widest uppercase select-none"
                  style={{ color: 'var(--c-overlay0)', borderTop: '1px solid var(--c-split)' }}
                >
                  {t.groupActions}
                </div>
                {ACTIONS.map((item) => (
                  <Command.Item
                    key={item.cmd}
                    value={item.cmd}
                    onSelect={() => runAction(item.action)}
                    className="group flex cursor-pointer items-center gap-0 py-1.5 text-xs transition-colors data-[selected=true]:bg-[var(--c-surface0)]"
                  >
                    <span className="w-4 shrink-0 text-center text-[var(--c-mauve)] opacity-0 group-data-[selected=true]:opacity-100">
                      |
                    </span>
                    <span
                      className="flex-1 group-data-[selected=true]:text-[var(--c-mauve)]"
                      style={{ color: 'var(--c-text)' }}
                    >
                      {item.cmd}
                    </span>
                    <span
                      className="pr-4 text-[10px] tabular-nums"
                      style={{ color: 'var(--c-overlay0)' }}
                    >
                      {item.label}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>

              <div
                className="flex items-center gap-4 px-4 py-1.5 text-[10px] select-none"
                style={{ borderTop: '1px solid var(--c-split)', color: 'var(--c-overlay0)' }}
              >
                <span>↑↓ nav</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            </Command.List>
          </div>
        )}

        {/* Tip 行 */}
        <div
          className="px-4 py-0.5 text-[10px] select-none"
          style={{ color: 'var(--c-overlay0)', borderBottom: '1px solid var(--c-split)' }}
        >
          Tip: press / for commands
        </div>

        {/* 输入行 */}
        <div className="flex h-9 items-center" style={{ backgroundColor: 'var(--c-mantle)' }}>
          <span
            className="pr-2 pl-4 text-xs select-none"
            style={{ color: focused ? 'var(--c-blue)' : 'var(--c-green)' }}
          >
            &gt;
          </span>
          <Command.Input
            ref={inputRef}
            value={value}
            onValueChange={setValue}
            onFocus={() => setFocused(true)}
            onBlur={() =>
              setTimeout(() => {
                setFocused(false)
                if (!value) setOpen(false)
              }, 150)
            }
            placeholder="Type /command"
            data-cmd-input
            className="flex-1 border-0 bg-transparent text-xs outline-none focus:ring-0"
            style={{
              color: 'var(--c-text)',
              caretColor: 'var(--c-blue)',
            }}
          />
          <span
            className="hidden pr-4 text-[10px] select-none sm:block"
            style={{ color: 'var(--c-overlay0)' }}
          >
            Press / or Cmd/Ctrl+K
          </span>
        </div>
      </Command>
    </div>
  )
}
