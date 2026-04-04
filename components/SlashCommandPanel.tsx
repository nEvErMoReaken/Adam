'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Command } from 'cmdk'
import { useLang } from '@/lib/i18n'

const PAGES = [
  { cmd: '/home',     href: '/',         icon: '~' },
  { cmd: '/blog',     href: '/blog',     icon: '📝' },
  { cmd: '/projects', href: '/projects', icon: '🚀' },
  { cmd: '/about',    href: '/about',    icon: '👤' },
  { cmd: '/contact',  href: '/contact',  icon: '✉' },
]

const ACTIONS = [
  { cmd: '/search', icon: '🔍', action: 'search' },
  { cmd: '/theme',  icon: '◐',  action: 'theme' },
]

export default function SlashCommandPanel() {
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const { t, lang } = useLang()
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 点击输入框或输入 / 时打开
  useEffect(() => {
    setOpen(focused || value.startsWith('/'))
  }, [value, focused])

  // 全局快捷键
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === '/') {
        e.preventDefault()
        inputRef.current?.focus()
        setValue('/')
      }
      if (e.key === 'Escape') {
        close()
      }
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
    }
    if (action === 'search') {
      navigate('/blog')
      return
    }
    close()
  }

  return (
    <div className="relative font-mono">
      <Command shouldFilter={true} onKeyDown={e => e.key === 'Escape' && close()}>

        {/* 候选框 */}
        {open && (
          <div
            className="absolute bottom-full left-0 right-0"
            style={{
              backgroundColor: 'var(--c-crust)',
              borderTop: '1px solid var(--c-split)',
              borderLeft: '1px solid var(--c-split)',
              borderRight: '1px solid var(--c-split)',
              zIndex: 50,
            }}
          >
            <Command.List>
              <Command.Empty
                className="px-4 py-3 text-xs"
                style={{ color: 'var(--c-subtext0)' }}
              >
                {t.noMatch}
              </Command.Empty>

              {/* pages 分组 */}
              <Command.Group>
                <div
                  className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-widest"
                  style={{ color: 'var(--c-overlay0)' }}
                >
                  {t.groupPages}
                </div>
                {PAGES.map((item, i) => {
                  const labels = [t.slashHome, t.slashBlog, t.slashProjects, t.slashAbout, t.slashContact]
                  return (
                  <Command.Item
                    key={item.cmd}
                    value={item.cmd}
                    onSelect={() => navigate(item.href)}
                    className="group flex cursor-pointer items-center gap-3 px-3 py-2 text-xs transition-colors data-[selected=true]:bg-[var(--c-surface0)]"
                  >
                    <span
                      className="w-4 shrink-0 text-center text-[10px]"
                      style={{ color: 'var(--c-overlay0)' }}
                    >
                      {item.icon}
                    </span>
                    <span style={{ color: 'var(--c-blue)' }}>{item.cmd}</span>
                    <span
                      className="ml-auto"
                      style={{ color: 'var(--c-subtext0)' }}
                    >
                      {labels[i]}
                    </span>
                    <span
                      className="hidden text-[10px] group-data-[selected=true]:inline"
                      style={{ color: 'var(--c-overlay0)' }}
                    >
                      ↵
                    </span>
                  </Command.Item>
                  )
                })}
              </Command.Group>

              {/* actions 分组 */}
              <Command.Group>
                <div
                  className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-widest"
                  style={{
                    color: 'var(--c-overlay0)',
                    borderTop: '1px solid var(--c-split)',
                  }}
                >
                  {t.groupActions}
                </div>
                {ACTIONS.map((item, i) => {
                  const labels = [t.slashSearch, t.slashTheme]
                  return (
                  <Command.Item
                    key={item.cmd}
                    value={item.cmd}
                    onSelect={() => runAction(item.action)}
                    className="group flex cursor-pointer items-center gap-3 px-3 py-2 text-xs transition-colors data-[selected=true]:bg-[var(--c-surface0)]"
                  >
                    <span
                      className="w-4 shrink-0 text-center text-[10px]"
                      style={{ color: 'var(--c-overlay0)' }}
                    >
                      {item.icon}
                    </span>
                    <span style={{ color: 'var(--c-mauve)' }}>{item.cmd}</span>
                    <span
                      className="ml-auto"
                      style={{ color: 'var(--c-subtext0)' }}
                    >
                      {labels[i]}
                    </span>
                    <span
                      className="hidden text-[10px] group-data-[selected=true]:inline"
                      style={{ color: 'var(--c-overlay0)' }}
                    >
                      ↵
                    </span>
                  </Command.Item>
                  )
                })}
              </Command.Group>

              {/* 底部提示 */}
              <div
                className="flex items-center justify-between px-3 py-1.5 text-[10px]"
                style={{
                  borderTop: '1px solid var(--c-split)',
                  color: 'var(--c-overlay0)',
                }}
              >
                <span>{lang === 'zh' ? '↑↓ 选择' : '↑↓ navigate'}</span>
                <span>{lang === 'zh' ? '↵ 确认' : '↵ select'}</span>
                <span>{lang === 'zh' ? 'esc 关闭' : 'esc close'}</span>
              </div>
            </Command.List>
          </div>
        )}

        {/* Tips */}
        {!open && (
          <div
            className="px-3 py-1 font-mono text-[10px]"
            style={{ color: 'var(--c-overlay0)', borderTop: '1px solid var(--c-split)' }}
          >
            {lang === 'zh'
              ? <>按 <kbd style={{ color: 'var(--c-blue)' }}>/</kbd> 打开命令，<kbd style={{ color: 'var(--c-blue)' }}>?</kbd> 查看快捷键</>
              : <>press <kbd style={{ color: 'var(--c-blue)' }}>/</kbd> for commands, <kbd style={{ color: 'var(--c-blue)' }}>?</kbd> for hotkeys</>
            }
          </div>
        )}

        {/* 输入栏 */}
        <div
          className="flex h-10 items-center sm:h-9"
          style={{
            backgroundColor: 'var(--c-mantle)',
            outline: focused ? `1px solid var(--c-blue)` : 'none',
            outlineOffset: '-1px',
          }}
        >
          <span
            className="pl-3 pr-1.5 text-xs transition-colors"
            style={{ color: focused ? 'var(--c-blue)' : 'var(--c-green)' }}
          >
            &gt;
          </span>
          <Command.Input
            ref={inputRef}
            data-cmd-input=""
            value={value}
            onValueChange={setValue}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              // 延迟，让 onSelect 能先触发
              setTimeout(() => { setFocused(false); if (!value) setOpen(false) }, 150)
            }}
            placeholder="type /command or click to browse"
            className="flex-1 border-0 bg-transparent text-xs outline-none placeholder:text-[var(--c-overlay0)] focus:ring-0"
            style={{ color: 'var(--c-text)', caretColor: 'var(--c-blue)' }}
          />
          {!focused && (
            <span className="hidden pr-3 text-[10px] sm:block" style={{ color: 'var(--c-overlay0)' }}>
              press /
            </span>
          )}
          {focused && value === '' && (
            <span className="hidden pr-3 text-[10px] sm:block" style={{ color: 'var(--c-blue)' }}>
              browsing
            </span>
          )}
        </div>
      </Command>
    </div>
  )
}
