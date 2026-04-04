import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

const MAX_DISPLAY = 6

const quickLinks = [
  { index: 1, label: '浏览所有文章', href: '/blog' },
  { index: 2, label: '查看项目展示', href: '/projects' },
  { index: 3, label: '了解关于我', href: '/about' },
  { index: 4, label: '联系我', href: '/contact' },
]

const whoami = {
  职位: '全栈工程师',
  地点: '中国',
  关于: siteMetadata.description,
}

export default function Home({ posts }) {
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
                {'> '}{whoami.职位}
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
              <p className="mb-2 font-mono text-xs text-[var(--c-subtext0)]"># 最近文章</p>
              <ul className="space-y-1">
                {!posts.length && (
                  <li className="font-mono text-sm text-[var(--c-subtext0)]">暂无文章</li>
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
                  全部文章 →
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* 右 pane：快速开始 */}
        <section className="flex min-h-0 flex-col bg-[var(--c-base)]">
          <div className="pane-titlebar">
            <span className="font-semibold text-[var(--c-text)]">快速开始</span>
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
