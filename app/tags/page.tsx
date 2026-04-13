import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Pane, PaneLayout } from '@/components/PaneLayout'

export const metadata = genPageMetadata({ title: '标签', description: '我写过的话题' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  return (
    <PaneLayout cols="grid-cols-1">
      <Pane title="tags" index={0}>
        <div className="p-4 font-mono">
          {tagKeys.length === 0 && <p className="text-xs text-[var(--c-subtext0)]">暂无标签</p>}
          <ul className="space-y-1">
            {sortedTags.map((t) => (
              <li key={t}>
                <Link
                  href={`/tags/${slug(t)}`}
                  className="flex items-center gap-2 px-2 py-1 text-xs transition-colors hover:bg-[var(--c-surface0)]"
                  aria-label={`查看标签 ${t} 下的文章`}
                >
                  <Tag text={t} />
                  <span className="text-[var(--c-overlay0)]">({tagCounts[t]})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Pane>
    </PaneLayout>
  )
}
