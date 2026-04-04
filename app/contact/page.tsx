import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'
import { Pane, PaneLayout } from '@/components/PaneLayout'

export const metadata = genPageMetadata({ title: '联系' })

export default function ContactPage() {
  return (
    <PaneLayout cols="grid-cols-1">
      <Pane title="contact" index={0}>
        <div className="p-6 space-y-4 font-mono text-sm">
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
                <a href={siteMetadata.github} target="_blank" rel="noopener noreferrer" className="terminal-link">
                  {siteMetadata.github}
                </a>
              </li>
            )}
            {siteMetadata.x && (
              <li>
                <span className="text-[var(--c-blue)]">x / twitter</span>
                <span className="text-[var(--c-subtext0)]"> = </span>
                <a href={siteMetadata.x} target="_blank" rel="noopener noreferrer" className="terminal-link">
                  {siteMetadata.x}
                </a>
              </li>
            )}
          </ul>
        </div>
      </Pane>
    </PaneLayout>
  )
}
