import Link from 'next/link'
import { slug } from 'github-slugger'
import { track } from '@/lib/umami'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="font-mono text-xs text-[var(--c-mauve)] transition-opacity hover:opacity-75"
      onClick={() => track('tag-click', { tag: text })}
    >
      #{text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
