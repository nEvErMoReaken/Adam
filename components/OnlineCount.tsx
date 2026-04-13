'use client'

import { useEffect, useState } from 'react'

export default function OnlineCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const fetch_ = () =>
      fetch('/api/umami?type=active')
        .then((r) => r.json())
        .then((d) => setCount(d.count ?? null))
        .catch(() => {})

    fetch_()
    const id = setInterval(fetch_, 30_000)
    return () => clearInterval(id)
  }, [])

  if (!count) return null

  return (
    <span
      className="flex items-center gap-1.5 font-mono text-[10px]"
      style={{ color: 'var(--c-overlay0)' }}
    >
      <span
        className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
        style={{ background: count > 0 ? 'var(--c-green)' : 'var(--c-overlay0)' }}
      />
      {count} online
    </span>
  )
}
