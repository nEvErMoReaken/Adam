'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

interface MermaidProps {
  chart: string
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !ref.current) return

    const render = async () => {
      const mermaid = (await import('mermaid')).default
      const isDark = resolvedTheme !== 'latte'
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        themeVariables: isDark
          ? {
              background: '#1e1e2e',
              primaryColor: '#313244',
              primaryTextColor: '#cdd6f4',
              primaryBorderColor: '#585b70',
              lineColor: '#6c7086',
              secondaryColor: '#1e1e2e',
              tertiaryColor: '#181825',
              edgeLabelBackground: '#1e1e2e',
              clusterBkg: '#181825',
              titleColor: '#cdd6f4',
              nodeBorder: '#585b70',
              nodeTextColor: '#cdd6f4',
              sequenceNumberColor: '#1e1e2e',
              actorBkg: '#313244',
              actorBorder: '#585b70',
              actorTextColor: '#cdd6f4',
              activationBorderColor: '#89b4fa',
              activationBkgColor: '#313244',
              signalColor: '#cdd6f4',
              signalTextColor: '#cdd6f4',
              noteBkgColor: '#313244',
              noteBorderColor: '#585b70',
              noteTextColor: '#cdd6f4',
            }
          : {},
        fontFamily: 'ui-monospace, monospace',
        sequence: {
          diagramMarginX: 20,
          diagramMarginY: 10,
          actorMargin: 60,
          boxMargin: 10,
        },
      })

      const id = `mermaid-${Math.random().toString(36).slice(2)}`
      const { svg } = await mermaid.render(id, chart)
      if (ref.current) {
        ref.current.innerHTML = svg
      }
    }

    render().catch(console.error)
  }, [chart, resolvedTheme, mounted])

  if (!mounted) return null

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center overflow-x-auto rounded border border-[var(--c-surface1)] bg-[var(--c-base)] p-4"
    />
  )
}
