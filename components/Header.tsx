'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import SearchButton from './SearchButton'
import { useLang } from '@/lib/i18n'

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { lang, setLang, t } = useLang()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const activeLink = headerNavLinks.find((l) => isActive(l.href))
  const activeFallback = lang === 'zh' ? '主页' : 'home'

  return (
    <header className="z-50 shrink-0 border-b bg-[var(--c-mantle)]" style={{ borderColor: 'var(--c-split)' }}>
      {/* 桌面端 */}
      <div className="hidden h-9 items-center gap-0 overflow-x-auto px-2 md:flex">
        {headerNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-tab ${isActive(link.href) ? 'active' : ''}`}
          >
            {link.index}:{link.title[lang]}
          </Link>
        ))}
        <span className="ml-auto flex items-center gap-2 pr-2">
          <SearchButton />
          <button
            type="button"
            aria-label={t.toggleLang}
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="font-mono text-xs text-[var(--c-subtext0)] transition-colors hover:text-[var(--c-text)]"
          >
            {lang === 'zh' ? '[EN]' : '[中文]'}
          </button>
        </span>
      </div>

      {/* 移动端顶栏 */}
      <div className="flex h-11 items-center justify-between gap-2 px-2 md:hidden">
        <div className="font-mono text-sm font-semibold text-[var(--c-text)]">
          {`| ${activeLink?.index ?? 0}:${activeLink?.title[lang] ?? activeFallback}`}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="terminal-control h-10 px-2 text-sm"
            aria-label={t.openMenu}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {t.menu}
          </button>
          <button
            type="button"
            aria-label={t.toggleLang}
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="font-mono text-xs text-[var(--c-subtext0)] transition-colors hover:text-[var(--c-text)]"
          >
            {lang === 'zh' ? '[EN]' : '[中文]'}
          </button>
          <SearchButton />
        </div>
      </div>

      {/* 移动端展开菜单 */}
      {mobileMenuOpen && (
        <div
          className="border-t md:hidden"
          style={{ borderColor: 'var(--c-split)', backgroundColor: 'var(--c-mantle)' }}
        >
          <div className="grid grid-cols-2 gap-px" style={{ backgroundColor: 'var(--c-split)' }}>
            {headerNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex h-10 items-center px-3 font-mono text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'bg-[var(--c-surface0)] text-[var(--c-text)]'
                    : 'bg-[var(--c-mantle)] text-[var(--c-subtext0)] hover:bg-[var(--c-surface0)] hover:text-[var(--c-text)]'
                }`}
              >
                {link.index}:{link.title[lang]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
