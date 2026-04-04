'use client'

import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { useLang } from '@/lib/i18n'

const MAX_DISPLAY = 6

export default function Home({ posts }) {
  const { t } = useLang()

  const whoami = {
    [t.roleKey]:     '全栈开发',
    [t.locationKey]: 'BYD',
    [t.aboutKey]:    siteMetadata.description,
  }

  const quickLinks = [
    { index: 1, label: t.quickBlog,     href: '/blog' },
    { index: 2, label: t.quickProjects, href: '/projects' },
    { index: 3, label: t.quickAbout,    href: '/about' },
    { index: 4, label: t.quickContact,  href: '/contact' },
  ]

  return (
    <div className="h-full">
      <div
        className="grid h-full grid-cols-1 gap-px lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,1fr)]"
        style={{ backgroundColor: 'var(--c-split)' }}
      >
        {/* 左 pane：标题 + whoami + 最近文章 */}
        <section className="flex min-h-0 flex-col bg-[var(--c-base)]">
          <div className="pane-titlebar">
            <span className="font-semibold text-[var(--c-text)]">whoami</span>
            <span>0</span>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6">

            {/* 大标题区 */}
            <div className="space-y-1 border-b pb-5" style={{ borderColor: 'var(--c-split)' }}>
              <p className="font-mono text-xs text-[var(--c-subtext0)]">$ whoami</p>
              <h1 className="font-mono text-2xl font-bold leading-tight text-[var(--c-text)] sm:text-3xl">
                {siteMetadata.author}
              </h1>
              <p className="font-mono text-sm text-[var(--c-blue)]">
                {'> '}{whoami[t.roleKey]}
              </p>
            </div>

            {/* KV 信息 */}
            <div className="space-y-1.5">
              {Object.entries(whoami).map(([key, value]) => (
                <p key={key} className="font-mono text-sm">
                  <span className="text-[var(--c-mauve)]">{key}</span>
                  <span className="text-[var(--c-subtext0)]"> = </span>
                  <span className="text-[var(--c-text)]">{value}</span>
                </p>
              ))}
            </div>

            {/* 最近文章 */}
            <div>
              <p className="mb-2 font-mono text-xs text-[var(--c-subtext0)]">{t.recentPosts}</p>
              <ul className="space-y-1">
                {!posts.length && (
                  <li className="font-mono text-sm text-[var(--c-subtext0)]">{t.noPosts}</li>
                )}
                {posts.slice(0, MAX_DISPLAY).map((post) => {
                  const { slug, date, title } = post
                  return (
                    <li key={slug}>
                      <Link
                        href={`/blog/${slug}`}
                        className="flex items-center justify-between gap-4 rounded px-2 py-1 font-mono text-sm transition-colors hover:bg-[var(--c-surface0)]"
                      >
                        <span className="min-w-0 truncate">
                          <span className="mr-2 text-[var(--c-blue)]">&gt;</span>
                          <span className="text-[var(--c-text)]">{title}</span>
                        </span>
                        <time dateTime={date} className="shrink-0 text-xs text-[var(--c-subtext0)]">
                          {formatDate(date, siteMetadata.locale)}
                        </time>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              {posts.length > MAX_DISPLAY && (
                <Link
                  href="/blog"
                  className="mt-2 inline-block font-mono text-xs text-[var(--c-blue)] hover:opacity-75"
                >
                  {t.allPosts}
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* 右 pane：快速开始 */}
        <section className="flex min-h-0 flex-col bg-[var(--c-base)]">
          <div className="pane-titlebar">
            <span className="font-semibold text-[var(--c-text)]">{t.quickStart}</span>
            <span>1</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <p className="font-mono text-xs text-[var(--c-subtext0)]">$ ls -la navigation/</p>
            <ul className="space-y-1">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 rounded px-2 py-1.5 font-mono text-sm transition-colors hover:bg-[var(--c-surface0)]"
                  >
                    <span className="text-[var(--c-subtext0)]">-rwxr-xr-x</span>
                    <span className="text-[var(--c-blue)]">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
