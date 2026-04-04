'use client'

import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { useLang } from '@/lib/i18n'
import { useLanyardWS } from 'use-lanyard'

const DISCORD_ID = '936154914843951104'

const MAX_DISPLAY = 6

const INFO = [
  { keyZh: '姓名',   keyEn: 'name',       val: 'Jimmy (姜鸣鹤)' },
  { keyZh: '职位',   keyEn: 'title',      val: 'Senior Software Engineer' },
  { keyZh: '城市',   keyEn: 'location',   val: 'Shenzhen, China' },
  { keyZh: '经验',   keyEn: 'experience', val: '3+ years @ BYD' },
  { keyZh: '专注',   keyEn: 'focus',      val: 'IoT · LLM Eng · Backend Infra' },
]

export default function Home({ posts }) {
  const { t, lang } = useLang()
  const data = useLanyardWS(DISCORD_ID)

  const statusColor: Record<string, string> = {
    online:    'var(--c-green)',
    idle:      'var(--c-yellow)',
    dnd:       'var(--c-red)',
    offline:   'var(--c-overlay0)',
  }
  const statusLabel: Record<string, { zh: string; en: string }> = {
    online:  { zh: '在线',    en: 'Online' },
    idle:    { zh: '挂机',    en: 'Idle' },
    dnd:     { zh: '请勿打扰', en: 'Do Not Disturb' },
    offline: { zh: '离线',    en: 'Offline' },
  }
  const status = data?.discord_status ?? 'offline'
  const color  = statusColor[status] ?? statusColor.offline
  const label  = (statusLabel[status] ?? statusLabel.offline)[lang]

  return (
    <div className="h-full">
      <div
        className="grid h-full grid-cols-1 gap-px lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,1fr)]"
        style={{ backgroundColor: 'var(--c-split)' }}
      >
        {/* 左 pane：最近文章 */}
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
                {'> '}Agentic Software Engineer
              </p>
              <p className="font-mono text-xs text-[var(--c-overlay0)] italic">
                {lang === 'zh'
                  ? '// 前端写完写后端，写完后端写运维，写完运维写 AI'
                  : '// Frontend. Backend. DevOps. AI. Yes, all of it.'}
              </p>
            </div>

            {/* KV 信息 — 两列网格，key/val 均浅色 */}
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
                <Link href="/llms-full.txt" className="hover:text-[var(--c-blue)] underline underline-offset-2">
                  llms-full.txt
                </Link>
              </p>
            </div>

            {/* Discord 状态 */}
            <div className="font-mono text-xs text-[var(--c-subtext0)] space-y-0.5">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span>Discord</span>
                <span className="text-[var(--c-overlay0)]">:</span>
                <span style={{ color }}>{label}</span>
              </div>
              {/* Spotify */}
              {data?.listening_to_spotify && data.spotify && (
                <div className="flex items-center gap-1 pl-4 text-[var(--c-overlay0)]">
                  <span className="text-[var(--c-green)]">♫</span>
                  <span className="truncate max-w-[16rem]">
                    {data.spotify.song} — {data.spotify.artist}
                  </span>
                </div>
              )}
              {/* 其他 activities（游戏、IDE 等） */}
              {!data?.listening_to_spotify && (data?.activities ?? []).filter(a => a.type !== 4).map((a, i) => (
                <div key={i} className="flex items-center gap-1 pl-4 text-[var(--c-overlay0)]">
                  <span className="text-[var(--c-mauve)]">▶</span>
                  <span className="truncate max-w-[16rem]">
                    {a.name}{a.details ? ` — ${a.details}` : ''}
                  </span>
                </div>
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
                <Link href="/blog" className="mt-2 inline-block font-mono text-xs text-[var(--c-blue)] hover:opacity-75">
                  {t.allPosts}
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* 右 pane：quick start + readme */}
        <section className="flex min-h-0 flex-col bg-[var(--c-base)]">
          <div className="pane-titlebar">
            <span className="font-semibold text-[var(--c-text)]">{t.quickStart}</span>
            <span>1</span>
          </div>
          <div className="flex-1 overflow-y-auto p-5 font-mono text-sm space-y-4">

            {/* 快速导航 */}
            <div className="space-y-1">
              {[
                { label: t.quickBlog,     href: '/blog' },
                { label: t.quickProjects, href: '/projects' },
                { label: t.quickAbout,    href: '/about' },
                { label: t.quickContact,  href: '/contact' },
              ].map(({ label, href }, i) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-[var(--c-surface0)]"
                >
                  <span className="text-[var(--c-blue)]">{i + 1})</span>
                  <span className="text-[var(--c-text)]">[{label}]</span>
                </Link>
              ))}
            </div>

            {/* 分隔 */}
            <div className="border-t" style={{ borderColor: 'var(--c-split)' }} />

            {/* README 提示 */}
            <div className="space-y-2 text-xs">
              <p className="text-[var(--c-subtext0)]">{t.smiRobotHint}</p>
              <ol className="space-y-1 text-[var(--c-text)]">
                {t.smiStartList.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[var(--c-blue)] shrink-0">{i + 1})</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
