'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { Pane, PaneLayout } from '@/components/PaneLayout'
import { useLang } from '@/lib/i18n'
import PageViews from '@/components/PageViews'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags } = content
  const basePath = path.split('/')[0]
  const router = useRouter()
  const { t } = useLang()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (document.activeElement as HTMLElement)?.tagName
      const editable = (document.activeElement as HTMLElement)?.isContentEditable
      if (tag === 'INPUT' || tag === 'TEXTAREA' || editable) return

      if (e.key === 'n' && next?.path) {
        router.push(`/${next.path}`)
      } else if (e.key === 'p' && prev?.path) {
        router.push(`/${prev.path}`)
      } else if (e.key === 'u') {
        router.push(`/${basePath}`)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, basePath, router])

  return (
    <>
      <ScrollTopAndComment />
      <PaneLayout cols="grid-cols-1 lg:grid-cols-[minmax(0,1fr)_200px]">
        {/* 主内容 pane */}
        <Pane title={title} index={0}>
          <article className="p-6">
            {/* 日期 */}
            <p className="mb-6 font-mono text-xs text-[var(--c-subtext0)]">
              <time dateTime={date}>
                {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
              </time>
              <PageViews slug={`/blog/${slug}/`} />
            </p>

            {/* 文章内容 */}
            <div className="prose dark:prose-invert max-w-none">{children}</div>

            {/* 底部操作链接 */}
            <div className="mt-8 pt-4 font-mono text-xs text-[var(--c-subtext0)]" style={{ borderTop: '1px solid var(--c-split)' }}>
              <Link href={discussUrl(path)} rel="nofollow" className="text-[var(--c-blue)] hover:opacity-75 mr-4">
                [在 X 上讨论]
              </Link>
              <Link href={editUrl(filePath)} className="text-[var(--c-blue)] hover:opacity-75">
                [在 GitHub 查看]
              </Link>
            </div>

            {/* 评论 */}
            {siteMetadata.comments && (
              <div className="mt-6" id="comment">
                <Comments slug={slug} />
              </div>
            )}
          </article>
        </Pane>

        {/* 侧边 pane：作者、标签、导航 */}
        <Pane title="meta" index={1}>
          <div className="p-4 space-y-6 font-mono text-sm">
            {/* 作者 */}
            {authorDetails.map((author) => (
              <div key={author.name} className="flex items-center gap-3">
                {author.avatar && (
                  <Image
                    src={author.avatar}
                    width={32}
                    height={32}
                    alt="avatar"
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div>
                  <p className="text-xs font-semibold text-[var(--c-text)]">{author.name}</p>
                  {author.twitter && (
                    <Link
                      href={author.twitter}
                      className="text-xs text-[var(--c-blue)] hover:opacity-75"
                    >
                      {author.twitter.replace('https://twitter.com/', '@').replace('https://x.com/', '@')}
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {/* 标签 */}
            {tags && tags.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs text-[var(--c-subtext0)]">{t.tagsLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => <Tag key={tag} text={tag} />)}
                </div>
              </div>
            )}

            {/* 上下篇 */}
            <div className="space-y-3 pt-2" style={{ borderTop: '1px solid var(--c-split)' }}>
              {prev && prev.path && (
                <div>
                  <p className="text-xs text-[var(--c-subtext0)]">{t.prevPost}</p>
                  <Link href={`/${prev.path}`} className="text-xs text-[var(--c-blue)] hover:opacity-75 line-clamp-2">
                    ← {prev.title}
                  </Link>
                </div>
              )}
              {next && next.path && (
                <div>
                  <p className="text-xs text-[var(--c-subtext0)]">{t.nextPost}</p>
                  <Link href={`/${next.path}`} className="text-xs text-[var(--c-blue)] hover:opacity-75 line-clamp-2">
                    {next.title} →
                  </Link>
                </div>
              )}
            </div>

            {/* 返回 */}
            <Link
              href={`/${basePath}`}
              className="block text-xs text-[var(--c-subtext0)] hover:text-[var(--c-blue)]"
            >
              {t.backToList}
            </Link>
          </div>
        </Pane>
      </PaneLayout>
    </>
  )
}
