'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/lib/i18n'

const SHORTCUTS_ZH = [
  { keys: ['?'],        desc: '显示/关闭快捷键帮助' },
  { keys: ['/'],        desc: '打开命令面板' },
  { keys: ['Ctrl', 'K'], desc: '打开命令面板' },
  { keys: ['Esc'],      desc: '关闭面板 / 取消' },
  { sep: '导航' },
  { keys: ['g', 'h'],   desc: '跳转主页' },
  { keys: ['g', 'b'],   desc: '跳转文章列表' },
  { keys: ['g', 'p'],   desc: '跳转项目' },
  { keys: ['g', 'a'],   desc: '跳转关于' },
  { keys: ['g', 'c'],   desc: '跳转联系' },
  { sep: '文章列表' },
  { keys: ['j'],        desc: '下一篇' },
  { keys: ['k'],        desc: '上一篇' },
  { keys: ['Enter'],    desc: '打开选中文章' },
  { keys: ['['],        desc: '上一页' },
  { keys: [']'],        desc: '下一页' },
  { sep: '文章阅读' },
  { keys: ['n'],        desc: '下一篇文章' },
  { keys: ['p'],        desc: '上一篇文章' },
  { keys: ['u'],        desc: '返回文章列表' },
]

const SHORTCUTS_EN = [
  { keys: ['?'],        desc: 'toggle keyboard help' },
  { keys: ['/'],        desc: 'open command palette' },
  { keys: ['Ctrl', 'K'], desc: 'open command palette' },
  { keys: ['Esc'],      desc: 'close panel / cancel' },
  { sep: 'navigation' },
  { keys: ['g', 'h'],   desc: 'go to home' },
  { keys: ['g', 'b'],   desc: 'go to blog' },
  { keys: ['g', 'p'],   desc: 'go to projects' },
  { keys: ['g', 'a'],   desc: 'go to about' },
  { keys: ['g', 'c'],   desc: 'go to contact' },
  { sep: 'post list' },
  { keys: ['j'],        desc: 'next post' },
  { keys: ['k'],        desc: 'prev post' },
  { keys: ['Enter'],    desc: 'open selected post' },
  { keys: ['['],        desc: 'prev page' },
  { keys: [']'],        desc: 'next page' },
  { sep: 'reading' },
  { keys: ['n'],        desc: 'next post' },
  { keys: ['p'],        desc: 'prev post' },
  { keys: ['u'],        desc: 'back to list' },
]

export default function KeyboardHelp() {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const shortcuts = lang === 'zh' ? SHORTCUTS_ZH : SHORTCUTS_EN

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (document.activeElement as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === '?') setOpen(o => !o)
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={() => setOpen(false)}
    >
      <div
        className="max-h-[80vh] w-full max-w-sm overflow-y-auto font-mono text-xs"
        style={{
          backgroundColor: 'var(--c-mantle)',
          border: '1px solid var(--c-split)',
          borderRadius: 4,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: '1px solid var(--c-split)' }}
        >
          <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>
            {lang === 'zh' ? '键盘快捷键' : 'keyboard shortcuts'}
          </span>
          <button
            onClick={() => setOpen(false)}
            style={{ color: 'var(--c-subtext0)' }}
            className="hover:text-[var(--c-text)]"
          >
            ✕
          </button>
        </div>

        {/* 快捷键列表 */}
        <div className="px-4 py-3 space-y-1">
          {shortcuts.map((item, i) => {
            if ('sep' in item) {
              return (
                <div
                  key={i}
                  className="pt-3 pb-1 text-[10px] uppercase tracking-widest"
                  style={{ color: 'var(--c-overlay0)', borderTop: i > 0 ? '1px solid var(--c-split)' : 'none' }}
                >
                  {item.sep}
                </div>
              )
            }
            return (
              <div key={i} className="flex items-center justify-between gap-4 py-0.5">
                <div className="flex items-center gap-1">
                  {item.keys!.map((k, ki) => (
                    <span key={ki} className="flex items-center gap-1">
                      <kbd
                        style={{
                          display: 'inline-block',
                          padding: '1px 6px',
                          background: 'var(--c-surface0)',
                          border: '1px solid var(--c-split)',
                          borderRadius: 3,
                          color: 'var(--c-blue)',
                          fontSize: 10,
                        }}
                      >
                        {k}
                      </kbd>
                      {ki < item.keys!.length - 1 && (
                        <span style={{ color: 'var(--c-overlay0)' }}>+</span>
                      )}
                    </span>
                  ))}
                </div>
                <span style={{ color: 'var(--c-subtext0)' }}>{item.desc}</span>
              </div>
            )
          })}
        </div>

        {/* 底部提示 */}
        <div
          className="px-4 py-2 text-[10px]"
          style={{ borderTop: '1px solid var(--c-split)', color: 'var(--c-overlay0)' }}
        >
          {lang === 'zh' ? '按 ? 或 Esc 关闭' : 'press ? or Esc to close'}
        </div>
      </div>
    </div>
  )
}
