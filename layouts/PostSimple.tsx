import { ReactNode } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { Pane, PaneLayout } from '@/components/PaneLayout'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostSimple({ content, next, prev, children }: LayoutProps) {
  const { path, slug, date, title } = content
  const basePath = path.split('/')[0]

  return (
    <>
      <ScrollTopAndComment />
      <PaneLayout cols="grid-cols-1">
        <Pane title={title} index={0}>
          <article className="p-6">
            <p className="mb-6 font-mono text-xs text-[var(--c-subtext0)]">
              <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
            </p>

            <div className="prose dark:prose-invert max-w-none">{children}</div>

            {siteMetadata.comments && (
              <div className="mt-6" id="comment">
                <Comments slug={slug} />
              </div>
            )}

            <div className="mt-8 pt-4 font-mono text-xs" style={{ borderTop: '1px solid var(--c-split)' }}>
              <div className="flex justify-between">
                {prev && prev.path && (
                  <Link href={`/${prev.path}`} className="text-[var(--c-blue)] hover:opacity-75">
                    ← {prev.title}
                  </Link>
                )}
                {next && next.path && (
                  <Link href={`/${next.path}`} className="text-[var(--c-blue)] hover:opacity-75 ml-auto">
                    {next.title} →
                  </Link>
                )}
              </div>
              <Link
                href={`/${basePath}`}
                className="mt-3 block text-[var(--c-subtext0)] hover:text-[var(--c-blue)]"
              >
                ← 返回文章列表
              </Link>
            </div>
          </article>
        </Pane>
      </PaneLayout>
    </>
  )
}
