import Link from 'next/link'
import { slug } from 'github-slugger'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="font-mono text-xs text-[var(--c-mauve)] transition-opacity hover:opacity-75"
    >
      #{text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
