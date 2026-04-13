'use client'

import Link from '@/components/Link'
import { PaneLayout, Pane } from '@/components/PaneLayout'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { useLang } from '@/lib/i18n'
import { useLanyardWS } from 'use-lanyard'
import CodeStatsWidget from '@/components/CodeStatsWidget'
import { createContext, useContext, useState } from 'react'

const DISCORD_ID = '936154914843951104'
const MAX_DISPLAY = 6

const INFO = [
  { keyZh: '姓名', keyEn: 'name', val: 'Jimmy (姜鸣鹤)' },
  { keyZh: '职位', keyEn: 'title', val: 'Senior Software Engineer' },
  { keyZh: '城市', keyEn: 'location', val: 'Shenzhen, China' },
  { keyZh: '经验', keyEn: 'experience', val: '3+ years @ BYD' },
  { keyZh: '专注', keyEn: 'focus', val: 'IoT · LLM Eng · Backend Infra' },
]

// Inline focus context so the right column's two mini-panes share state with the root grid
const FocusCtx = createContext<{ focused: number; setFocused: (i: number) => void }>({
  focused: 0,
  setFocused: () => {},
})

function useFocus() {
  return useContext(FocusCtx)
}

function PaneShell({
  index,
  title,
  paneNum,
  children,
  className = '',
}: {
  index: number
  title: string
  paneNum: number
  children: React.ReactNode
  className?: string
}) {
  const { focused, setFocused } = useFocus()
  const active = focused === index
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <section
      className={`flex min-h-0 flex-col bg-[var(--c-base)] transition-colors ${className}`}
      style={{
        border: active ? '1px solid var(--c-blue)' : '1px solid transparent',
        boxShadow: active ? 'inset 0 0 0 1px var(--c-blue)' : undefined,
      }}
      onMouseDown={() => setFocused(index)}
    >
      <div className="pane-titlebar">
        <span
          className="font-semibold"
          style={{ color: active ? 'var(--c-blue)' : 'var(--c-text)' }}
        >
          {title}
        </span>
        <span style={{ color: active ? 'var(--c-blue)' : 'var(--c-subtext0)' }}>{paneNum}</span>
      </div>
      {children}
    </section>
  )
}

export default function Home({ posts }) {
  const { t, lang } = useLang()
  const discord = useLanyardWS(DISCORD_ID)
  const [focused, setFocused] = useState(0)

  const statusColor: Record<string, string> = {
    online: 'var(--c-green)',
    idle: 'var(--c-yellow)',
    dnd: 'var(--c-red)',
    offline: 'var(--c-overlay0)',
  }
  const statusLabel: Record<string, { zh: string; en: string }> = {
    online: { zh: '在线', en: 'Online' },
    idle: { zh: '挂机', en: 'Idle' },
    dnd: { zh: '请勿打扰', en: 'Do Not Disturb' },
    offline: { zh: '离线', en: 'Offline' },
  }
  const status = discord?.discord_status ?? 'offline'
  const color = statusColor[status] ?? statusColor.offline
  const label = (statusLabel[status] ?? statusLabel.offline)[lang]

  return (
    <FocusCtx.Provider value={{ focused, setFocused }}>
      <div className="h-full">
        <div
          className="grid h-full grid-cols-1 gap-px lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,1fr)]"
          style={{ backgroundColor: 'var(--c-split)' }}
        >
          {/* ── pane 0: whoami ── */}
          <PaneShell index={0} title="whoami" paneNum={0} className="min-h-0">
            <div className="flex-1 space-y-6 overflow-y-auto p-5">
              <div className="space-y-1 border-b pb-5" style={{ borderColor: 'var(--c-split)' }}>
                <p className="font-mono text-xs text-[var(--c-subtext0)]">$ whoami</p>
                <h1 className="font-mono text-2xl leading-tight font-bold text-[var(--c-text)] sm:text-3xl">
                  {siteMetadata.author}
                </h1>
                <p className="font-mono text-sm text-[var(--c-blue)]">
                  {'> '}Agentic Software Engineer
                </p>
                <p className="font-mono text-xs text-[var(--c-overlay0)] italic">
                  {lang === 'zh'
                    ? '// Frontend. Backend. DevOps. AI. Yes, all of it.'
                    : '// Frontend. Backend. DevOps. AI. Yes, all of it.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 font-mono text-xs text-[var(--c-subtext0)]">
                {INFO.map(({ keyZh, keyEn, val }) => (
                  <p key={keyEn}>
                    <span>{lang === 'zh' ? keyZh : keyEn}</span>
                    <span className="text-[var(--c-overlay0)]">: </span>
                    <span>{val}</span>
                  </p>
                ))}
                <p>
                  <span>{lang === 'zh' ? '机器人' : 'robot'}</span>
                  <span className="text-[var(--c-overlay0)]">: </span>
                  <Link
                    href="/llms-full.txt"
                    className="underline underline-offset-2 hover:text-[var(--c-blue)]"
                  >
                    llms-full.txt
                  </Link>
                </p>
              </div>

              <div className="space-y-0.5 font-mono text-xs text-[var(--c-subtext0)]">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span>Discord</span>
                  <span className="text-[var(--c-overlay0)]">:</span>
                  <span style={{ color }}>{label}</span>
                </div>
                {discord?.listening_to_spotify && discord.spotify && (
                  <div className="flex items-center gap-1 pl-4 text-[var(--c-overlay0)]">
                    <span className="text-[var(--c-green)]">♫</span>
                    <span className="max-w-[16rem] truncate">
                      {discord.spotify.song} — {discord.spotify.artist}
                    </span>
                  </div>
                )}
                {!discord?.listening_to_spotify &&
                  (discord?.activities ?? [])
                    .filter((a) => a.type !== 4)
                    .map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 pl-4 text-[var(--c-overlay0)]"
                      >
                        <span className="text-[var(--c-mauve)]">▶</span>
                        <span className="max-w-[16rem] truncate">
                          {a.name}
                          {a.details ? ` — ${a.details}` : ''}
                        </span>
                      </div>
                    ))}
              </div>

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
                          <time
                            dateTime={date}
                            className="shrink-0 text-xs text-[var(--c-subtext0)]"
                          >
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
          </PaneShell>

          {/* ── right column: two stacked panes ── */}
          <div
            className="flex min-h-0 flex-col gap-px"
            style={{ backgroundColor: 'var(--c-split)' }}
          >
            {/* pane 1: quickstart */}
            <PaneShell index={1} title={t.quickStart} paneNum={1} className="shrink-0">
              <div className="space-y-1 p-4 font-mono text-sm">
                {[
                  { label: t.quickBlog, href: '/blog' },
                  { label: t.quickProjects, href: '/projects' },
                  { label: t.quickAbout, href: '/about' },
                  { label: t.quickContact, href: '/contact' },
                ].map(({ label, href }, i) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 rounded px-2 py-0.5 transition-colors hover:bg-[var(--c-surface0)]"
                  >
                    <span className="text-[var(--c-blue)]">{i + 1})</span>
                    <span className="text-[var(--c-text)]">[{label}]</span>
                  </Link>
                ))}
                <div className="space-y-1 pt-2 text-xs text-[var(--c-subtext0)]">
                  <p>{t.smiRobotHint}</p>
                  <ol className="space-y-0.5 text-[var(--c-text)]">
                    {t.smiStartList.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="shrink-0 text-[var(--c-blue)]">{i + 1})</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </PaneShell>

            {/* pane 2: code-stats */}
            <PaneShell index={2} title="code-stats" paneNum={2} className="min-h-0 flex-1">
              <div className="flex-1 overflow-y-auto p-4">
                <CodeStatsWidget />
              </div>
            </PaneShell>
          </div>
        </div>
      </div>
    </FocusCtx.Provider>
  )
}
