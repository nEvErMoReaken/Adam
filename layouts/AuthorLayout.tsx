import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { Pane, PaneLayout } from '@/components/PaneLayout'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  const kvData = [
    { key: 'name', value: name },
    { key: 'role', value: occupation },
    { key: 'company', value: company },
  ].filter((item) => item.value)

  return (
    <PaneLayout>
      {/* 左 pane：settings.ini 风格 */}
      <Pane title="settings.ini" index={0}>
        <div className="p-4 space-y-4">
          {avatar && (
            <Image
              src={avatar}
              alt="avatar"
              width={80}
              height={80}
              className="h-20 w-20 rounded-full"
            />
          )}
          <div className="space-y-1.5">
            {kvData.map(({ key, value }) => (
              <p key={key} className="font-mono text-sm">
                <span className="kv-key">{key}</span>
                <span className="text-[var(--c-subtext0)]"> = </span>
                <span className="kv-value">{value}</span>
              </p>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            {email && <SocialIcon kind="mail" href={`mailto:${email}`} size={5} />}
            {github && <SocialIcon kind="github" href={github} size={5} />}
            {linkedin && <SocialIcon kind="linkedin" href={linkedin} size={5} />}
            {twitter && <SocialIcon kind="x" href={twitter} size={5} />}
            {bluesky && <SocialIcon kind="bluesky" href={bluesky} size={5} />}
          </div>
        </div>
      </Pane>

      {/* 右 pane：关于内容 */}
      <Pane title="how i work" index={1}>
        <article className="prose dark:prose-invert max-w-none p-6 text-sm">
          {children}
        </article>
      </Pane>
    </PaneLayout>
  )
}
