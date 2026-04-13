'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { Pane, PaneLayout } from '@/components/PaneLayout'
import { useLang } from '@/lib/i18n'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const { t } = useLang()
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <nav
      className="flex items-center justify-between px-4 py-3 font-mono text-xs"
      style={{ borderTop: '1px solid var(--c-split)' }}
    >
      {prevPage ? (
        <Link
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          rel="prev"
          className="text-[var(--c-blue)] hover:opacity-75"
        >
          {t.prevPage}
        </Link>
      ) : (
        <span className="text-[var(--c-subtext0)] opacity-30">{t.prevPage}</span>
      )}
      <span className="text-[var(--c-subtext0)]">
        {currentPage} / {totalPages}
      </span>
      {nextPage ? (
        <Link
          href={`/${basePath}/page/${currentPage + 1}`}
          rel="next"
          className="text-[var(--c-blue)] hover:opacity-75"
        >
          {t.nextPage}
        </Link>
      ) : (
        <span className="text-[var(--c-subtext0)] opacity-30">{t.nextPage}</span>
      )}
    </nav>
  )
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const { t } = useLang()
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <PaneLayout cols="grid-cols-1">
      <Pane title="search" index={0}>
        {/* Search input */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--c-split)' }}>
          <label className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[var(--c-green)]">$</span>
            <span className="text-[var(--c-subtext0)]">grep -r</span>
            <input
              aria-label={t.searchLabel}
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 bg-transparent text-[var(--c-text)] outline-none placeholder:text-[var(--c-overlay0)]"
            />
          </label>
        </div>

        <ul>
          {!filteredBlogPosts.length && (
            <li className="px-4 py-3 font-mono text-xs text-[var(--c-subtext0)]">{t.noResults}</li>
          )}
          {displayPosts.map((post) => {
            const { path, date, title, summary, tags } = post
            return (
              <li key={path} style={{ borderBottom: '1px solid var(--c-split)' }}>
                <div className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-[var(--c-surface0)]">
                  <div className="flex items-baseline gap-3 font-mono text-xs text-[var(--c-subtext0)]">
                    <span>-rw-r--r--</span>
                    <time dateTime={date} suppressHydrationWarning>
                      {formatDate(date, siteMetadata.locale)}
                    </time>
                  </div>
                  <Link
                    href={`/${path}`}
                    className="font-mono text-sm font-semibold text-[var(--c-text)] hover:text-[var(--c-blue)]"
                  >
                    {title}
                  </Link>
                  {summary && (
                    <p className="line-clamp-2 text-xs text-[var(--c-subtext0)]">{summary}</p>
                  )}
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        {pagination && pagination.totalPages > 1 && !searchValue && (
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        )}
      </Pane>
    </PaneLayout>
  )
}
