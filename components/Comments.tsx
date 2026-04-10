'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface GiscusComment {
  author: string
  body: string
  createdAt: string
  url: string
}

interface DiscussionResult {
  id: string | null
  url: string | null
  totalCount: number
  comments: GiscusComment[]
}

interface User {
  login: string
  avatar: string
}

function formatDate(iso: string) {
  return iso.slice(0, 16).replace('T', ' ')
}

function hash() {
  return Math.random().toString(16).slice(2, 9)
}

export default function Comments({ slug }: { slug: string }) {
  const pathname = usePathname()
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [data, setData] = useState<DiscussionResult | null>(null)
  const [user, setUser] = useState<User | null | undefined>(undefined) // undefined = not fetched
  const [input, setInput] = useState('')
  const [submitState, setSubmitState] = useState<'idle' | 'posting' | 'error'>('idle')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // fetch current user
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  const loadComments = async () => {
    setLoadState('loading')
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      setData(await res.json())
      setLoadState('done')
    } catch {
      setLoadState('error')
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  const submit = async () => {
    if (!input.trim()) return
    setSubmitState('posting')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, body: input.trim() }),
      })
      if (!res.ok) throw new Error()
      const newComment: GiscusComment = await res.json()
      setData(prev => prev ? {
        ...prev,
        totalCount: prev.totalCount + 1,
        comments: [...prev.comments, newComment],
      } : prev)
      setInput('')
      setSubmitState('idle')
    } catch {
      setSubmitState('error')
    }
  }

  const S = { color: 'var(--c-subtext0)' }

  return (
    <div
      className="mt-8 overflow-hidden rounded-md border font-mono text-[11px]"
      style={{ borderColor: 'var(--c-split)', background: 'var(--c-base)' }}
    >
      {/* title bar */}
      <div className="flex items-center gap-1.5 border-b px-4 py-1.5"
        style={{ background: 'var(--c-mantle)', borderColor: 'var(--c-split)' }}>
        {['var(--c-red)', 'var(--c-yellow)', 'var(--c-green)'].map(c => (
          <span key={c} className="inline-block h-2.5 w-2.5 rounded-full opacity-70" style={{ background: c }} />
        ))}
        <span className="ml-2" style={{ color: 'var(--c-subtext0)' }}>
          git log --comments {slug}
        </span>
      </div>

      <div className="space-y-4 p-4 leading-relaxed">

        {/* load comments */}
        {loadState === 'idle' && (
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--c-green)' }}>❯</span>
            <button onClick={loadComments}
              style={{ color: 'var(--c-blue)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
              git log --oneline --comments
            </button>
          </div>
        )}

        {loadState === 'loading' && (
          <div style={{ color: 'var(--c-overlay0)' }}>
            <span style={{ color: 'var(--c-green)' }}>❯</span> git log --oneline --comments
            <br /><span className="animate-pulse">fetching…</span>
          </div>
        )}

        {loadState === 'error' && (
          <div>
            <span style={{ color: 'var(--c-red)' }}>error: could not fetch discussions</span>
          </div>
        )}

        {loadState === 'done' && data && (
          <>
            <div style={{ color: 'var(--c-overlay0)' }}>
              <span style={{ color: 'var(--c-green)' }}>❯</span> git log --oneline --comments
            </div>

            {data.comments.length === 0
              ? <div style={{ color: 'var(--c-overlay0)' }}>  (no commits yet)</div>
              : <div className="space-y-5">
                  {data.comments.map((c, i) => (
                    <div key={i}>
                      <div style={{ color: 'var(--c-yellow)' }}>commit {hash()}</div>
                      <div style={{ color: 'var(--c-overlay0)' }}>
                        Author: <span style={{ color: 'var(--c-mauve)' }}>{c.author}</span>
                      </div>
                      <div style={{ color: 'var(--c-overlay0)' }}>Date:   {formatDate(c.createdAt)}</div>
                      <div className="mt-2 border-l-2 pl-3 whitespace-pre-wrap"
                        style={{ borderColor: 'var(--c-surface1)', color: 'var(--c-text)' }}>
                        {c.body}
                      </div>
                    </div>
                  ))}
                </div>
            }
          </>
        )}

        {/* divider */}
        {loadState === 'done' && (
          <div style={{ borderTop: '1px solid var(--c-split)' }} />
        )}

        {/* auth + compose */}
        {loadState === 'done' && (
          <>
            {user === undefined && null}

            {user === null && (
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--c-green)' }}>❯</span>
                <a href={`/api/auth/github?redirect=${encodeURIComponent(pathname)}`}
                  style={{ color: 'var(--c-blue)' }}>
                  git auth login
                </a>
                <span style={{ color: 'var(--c-overlay0)' }}># GitHub 账号登录后可留言</span>
              </div>
            )}

            {user && (
              <div className="space-y-2">
                <div style={{ color: 'var(--c-overlay0)' }}>
                  <span style={{ color: 'var(--c-green)' }}>❯</span>
                  {' git commit -m '}
                  <span style={{ color: 'var(--c-mauve)' }}>{user.login}</span>
                  <button onClick={logout} className="ml-3"
                    style={{ color: 'var(--c-overlay0)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', textDecoration: 'underline' }}>
                    logout
                  </button>
                </div>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
                  placeholder="> type your comment…"
                  rows={4}
                  className="w-full resize-none rounded border px-3 py-2 outline-none"
                  style={{
                    background: 'var(--c-surface0)',
                    borderColor: 'var(--c-split)',
                    color: 'var(--c-text)',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                  }}
                />

                <div className="flex items-center gap-3">
                  <button
                    onClick={submit}
                    disabled={submitState === 'posting' || !input.trim()}
                    className="rounded px-3 py-1 transition-colors"
                    style={{
                      border: '1px solid var(--c-blue)',
                      background: 'var(--c-surface0)',
                      color: submitState === 'posting' ? 'var(--c-overlay0)' : 'var(--c-blue)',
                      cursor: submitState === 'posting' || !input.trim() ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      opacity: !input.trim() ? 0.5 : 1,
                    }}>
                    {submitState === 'posting' ? 'posting…' : 'git push'}
                  </button>
                  <span style={{ color: 'var(--c-overlay0)' }}>⌘↵ / Ctrl↵</span>
                  {submitState === 'error' && (
                    <span style={{ color: 'var(--c-red)' }}>error: push failed</span>
                  )}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}
