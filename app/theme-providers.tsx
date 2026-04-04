'use client'

import { ThemeProvider } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'
import { LangProvider } from '@/lib/i18n'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme={siteMetadata.theme}
        themes={['latte', 'mocha', 'old-hope']}
        enableSystem={false}
      >
        {children}
      </ThemeProvider>
    </LangProvider>
  )
}
