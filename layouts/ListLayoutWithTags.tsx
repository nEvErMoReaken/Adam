'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import { Pane, PaneLayout } from '@/components/PaneLayout'
import { useLang } from '@/lib/i18n'
import { track } from '@/lib/umami'

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
    <nav className="flex items-center justify-between px-4 py-4 font-mono text-xs" style={{ borderTop: '1px solid var(--c-split)' }}>
      {prevPage ? (
        <Link href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`} rel="prev" className="py-1 px-2 text-[var(--c-blue)] hover:opacity-75">
          {t.prevPage}
        </Link>
      ) : (
        <span className="opacity-30 text-[var(--c-subtext0)]">{t.prevPage}</span>
      )}
      <span className="text-[var(--c-subtext0)]">{currentPage} / {totalPages}</span>
      {nextPage ? (
        <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next" className="py-1 px-2 text-[var(--c-blue)] hover:opacity-75">
          {t.nextPage}
        </Link>
      ) : (
        <span className="opacity-30 text-[var(--c-subtext0)]">{t.nextPage}</span>
      )}
    </nav>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLang()
  const [tagsOpen, setTagsOpen] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  const activeTag = sortedTags.find(
    (tag) => decodeURI(pathname.split('/tags/')[1]) === slug(tag)
  )

  // j/k/Enter/[/] keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (document.activeElement as HTMLElement)?.tagName
      const editable = (document.activeElement as HTMLElement)?.isContentEditable
      if (tag === 'INPUT' || tag === 'TEXTAREA' || editable) return

      if (e.key === 'j') {
        e.preventDefault()
        setSelectedIdx(i => Math.min(i + 1, displayPosts.length - 1))
      } else if (e.key === 'k') {
        e.preventDefault()
        setSelectedIdx(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && selectedIdx >= 0) {
        e.preventDefault()
        router.push(`/${displayPosts[selectedIdx].path}`)
      } else if (e.key === '[') {
        if (pagination && pagination.currentPage > 1) {
          const basePath = pathname.replace(/^\//, '').replace(/\/page\/\d+\/?$/, '').replace(/\/$/, '')
          const target = pagination.currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${pagination.currentPage - 1}`
          router.push(target)
        }
      } else if (e.key === ']') {
        if (pagination && pagination.currentPage < pagination.totalPages) {
          const basePath = pathname.replace(/^\//, '').replace(/\/page\/\d+\/?$/, '').replace(/\/$/, '')
          router.push(`/${basePath}/page/${pagination.currentPage + 1}`)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [displayPosts, selectedIdx, pagination, pathname, router])

  return (
    <PaneLayout cols="grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px]">
      {/* 主 pane：文章列表 */}
      <Pane title="writing" index={0}>
        {/* 手机端标签折叠栏 */}
        <div className="lg:hidden" style={{ borderBottom: '1px solid var(--c-split)' }}>
          <button
            onClick={() => setTagsOpen(o => !o)}
            className="flex w-full items-center justify-between px-4 py-2 font-mono text-xs transition-colors hover:bg-[var(--c-surface0)]"
            style={{ color: 'var(--c-subtext0)' }}
          >
            <span>
              <span style={{ color: 'var(--c-blue)' }}>#</span>
              {' '}{activeTag ?? t.tagsPane}
              {activeTag && <span style={{ color: 'var(--c-overlay0)' }}> ({tagCounts[activeTag]})</span>}
            </span>
            <span style={{ fontSize: 12 }}>{tagsOpen ? '▲' : '▼'}</span>
          </button>

          {tagsOpen && (
            <div className="px-4 pb-2">
              <Link
                href="/blog"
                onClick={() => setTagsOpen(false)}
                className={`mb-1 block px-2 py-1 font-mono text-xs transition-colors hover:bg-[var(--c-surface0)] ${
                  pathname === '/blog' ? 'text-[var(--c-blue)]' : 'text-[var(--c-subtext0)]'
                }`}
              >
                {t.allPostsTag} ({posts.length})
              </Link>
              <ul className="space-y-0.5">
                {sortedTags.map((tag) => {
                  const isActive = decodeURI(pathname.split('/tags/')[1]) === slug(tag)
                  return (
                    <li key={tag}>
                      <Link
                        href={`/tags/${slug(tag)}`}
                        onClick={() => setTagsOpen(false)}
                        className={`block px-2 py-1.5 font-mono text-xs transition-colors hover:bg-[var(--c-surface0)] ${
                          isActive ? 'text-[var(--c-blue)]' : 'text-[var(--c-subtext0)]'
                        }`}
                      >
                        #{tag} <span style={{ color: 'var(--c-overlay0)' }}>({tagCounts[tag]})</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        <ul>
          {displayPosts.map((post, idx) => {
            const { path, date, title, summary, tags } = post
            const isSelected = idx === selectedIdx
            return (
              <li key={path} className="group" style={{ borderBottom: '1px solid var(--c-split)' }}>
                <div
                  className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-[var(--c-surface0)]"
                  style={isSelected ? { backgroundColor: 'var(--c-surface0)', outline: '1px solid var(--c-blue)', outlineOffset: '-1px' } : {}}
                >
                  <div className="flex items-baseline gap-3 font-mono text-xs text-[var(--c-subtext0)]">
                    <span>-rw-r--r--</span>
                    <time dateTime={date} suppressHydrationWarning>
                      {formatDate(date, siteMetadata.locale)}
                    </time>
                  </div>
                  <Link href={`/${path}`} className="font-mono text-sm font-semibold text-[var(--c-text)] hover:text-[var(--c-blue)]"
                    onClick={() => track('article-click', { title, path })}>
                    {title}
                  </Link>
                  {summary && (
                    <p className="line-clamp-2 text-xs text-[var(--c-subtext0)]">{summary}</p>
                  )}
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {tags.map((tag) => <Tag key={tag} text={tag} />)}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        {pagination && pagination.totalPages > 1 && (
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        )}
      </Pane>

      {/* 侧边 pane：标签过滤（桌面端，手机端隐藏） */}
      <Pane title={t.tagsPane} index={1} className="hidden lg:flex">
        <div className="p-3">
          <Link
            href="/blog"
            className={`mb-2 block px-2 py-1 font-mono text-xs transition-colors hover:bg-[var(--c-surface0)] ${
              pathname === '/blog' ? 'text-[var(--c-blue)]' : 'text-[var(--c-subtext0)]'
            }`}
          >
            {t.allPostsTag} ({posts.length})
          </Link>
          <ul className="space-y-0.5">
            {sortedTags.map((tag) => {
              const isActive = decodeURI(pathname.split('/tags/')[1]) === slug(tag)
              return (
                <li key={tag}>
                  <Link
                    href={`/tags/${slug(tag)}`}
                    className={`block px-2 py-0.5 font-mono text-xs transition-colors hover:bg-[var(--c-surface0)] ${
                      isActive ? 'text-[var(--c-blue)]' : 'text-[var(--c-subtext0)]'
                    }`}
                    onClick={() => track('tag-filter', { tag })}
                  >
                    #{tag} <span style={{ color: 'var(--c-overlay0)' }}>({tagCounts[tag]})</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </Pane>
    </PaneLayout>
  )
}
