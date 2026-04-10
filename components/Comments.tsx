'use client'

import { useState } from 'react'
import type { DiscussionResult } from '@/app/api/comments/route'

function formatDate(iso: string) {
  return new Date(iso).toISOString().slice(0, 16).replace('T', ' ')
}

function shortHash() {
  return Math.random().toString(16).slice(2, 9)
}

export default function Comments({ slug }: { slug: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [data, setData] = useState<DiscussionResult | null>(null)

  const load = async () => {
    setState('loading')
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      const json: DiscussionResult = await res.json()
      setData(json)
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <div
      className="mt-8 overflow-hidden rounded-md border font-mono text-[11px]"
      style={{ borderColor: 'var(--c-split)', background: 'var(--c-base)' }}
    >
      {/* title bar */}
      <div
        className="flex items-center gap-1.5 border-b px-4 py-1.5"
        style={{ background: 'var(--c-mantle)', borderColor: 'var(--c-split)' }}
      >
        <span className="inline-block h-2.5 w-2.5 rounded-full opacity-70" style={{ background: 'var(--c-red)' }} />
        <span className="inline-block h-2.5 w-2.5 rounded-full opacity-70" style={{ background: 'var(--c-yellow)' }} />
        <span className="inline-block h-2.5 w-2.5 rounded-full opacity-70" style={{ background: 'var(--c-green)' }} />
        <span className="ml-2" style={{ color: 'var(--c-subtext0)' }}>
          git log --comments {slug}
        </span>
      </div>

      <div className="p-4 leading-relaxed" style={{ color: 'var(--c-text)' }}>

        {state === 'idle' && (
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--c-green)' }}>❯</span>
            <button
              onClick={load}
              style={{ color: 'var(--c-blue)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
            >
              git log --oneline --comments
            </button>
          </div>
        )}

        {state === 'loading' && (
          <div style={{ color: 'var(--c-overlay0)' }}>
            <span style={{ color: 'var(--c-green)' }}>❯</span> git log --oneline --comments
            <br />
            <span className="animate-pulse">fetching discussions…</span>
          </div>
        )}

        {state === 'error' && (
          <div>
            <span style={{ color: 'var(--c-green)' }}>❯</span> git log --oneline --comments
            <br />
            <span style={{ color: 'var(--c-red)' }}>error: could not fetch discussions</span>
          </div>
        )}

        {state === 'done' && data && (
          <div className="space-y-0">
            <div style={{ color: 'var(--c-overlay0)' }}>
              <span style={{ color: 'var(--c-green)' }}>❯</span> git log --oneline --comments
            </div>

            {data.comments.length === 0 ? (
              <div className="mt-3" style={{ color: 'var(--c-overlay0)' }}>
                (no commits yet — be the first)
              </div>
            ) : (
              <div className="mt-3 space-y-5">
                {data.comments.map((c, i) => (
                  <div key={i}>
                    <div style={{ color: 'var(--c-yellow)' }}>
                      commit {shortHash()}
                    </div>
                    <div style={{ color: 'var(--c-overlay0)' }}>
                      Author: <span style={{ color: 'var(--c-mauve)' }}>{c.author}</span>
                    </div>
                    <div style={{ color: 'var(--c-overlay0)' }}>
                      Date:   {formatDate(c.createdAt)}
                    </div>
                    <div className="mt-2 border-l-2 pl-4 whitespace-pre-wrap" style={{ borderColor: 'var(--c-surface1)', color: 'var(--c-text)' }}>
                      {c.body}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--c-split)' }}>
              {data.url ? (
                <div style={{ color: 'var(--c-overlay0)' }}>
                  <span style={{ color: 'var(--c-green)' }}>❯</span>{' '}
                  <a href={data.url} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--c-blue)' }}>
                    git commit --comment  <span style={{ color: 'var(--c-overlay0)' }}># reply on GitHub →</span>
                  </a>
                </div>
              ) : (
                <div style={{ color: 'var(--c-overlay0)' }}>
                  <span style={{ color: 'var(--c-green)' }}>❯</span>{' '}
                  <a
                    href={`https://github.com/nEvErMoReaken/Adam/discussions`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--c-blue)' }}>
                    git commit --comment  <span style={{ color: 'var(--c-overlay0)' }}># start discussion →</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
