'use client'

import { useEffect, useState } from 'react'

export default function PageViews({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    fetch(`/api/umami?type=pageviews&slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setViews(d.views ?? null))
      .catch(() => {})
  }, [slug])

  if (views === null) return null

  return (
    <span className="font-mono text-xs" style={{ color: 'var(--c-overlay0)' }}>
      {views.toLocaleString()} views
    </span>
  )
}
