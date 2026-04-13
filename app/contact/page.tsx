import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'
import { Pane, PaneLayout } from '@/components/PaneLayout'

export const metadata = genPageMetadata({ title: '联系' })

export default function ContactPage() {
  return (
    <PaneLayout cols="grid-cols-1">
      <Pane title="contact" index={0}>
        <div className="space-y-4 p-6 font-mono text-sm">
          <p className="text-[var(--c-subtext0)]">$ contact --list</p>
          <ul className="space-y-2">
            {siteMetadata.email && (
              <li>
                <span className="text-[var(--c-blue)]">email</span>
                <span className="text-[var(--c-subtext0)]"> = </span>
                <a href={`mailto:${siteMetadata.email}`} className="terminal-link">
                  {siteMetadata.email}
                </a>
              </li>
            )}
            {siteMetadata.github && (
              <li>
                <span className="text-[var(--c-blue)]">github</span>
                <span className="text-[var(--c-subtext0)]"> = </span>
                <a
                  href={siteMetadata.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-link"
                >
                  {siteMetadata.github}
                </a>
              </li>
            )}
          </ul>
        </div>
      </Pane>
    </PaneLayout>
  )
}
