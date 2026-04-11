import TOCInline from 'pliny/ui/TOCInline'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import RingBufferViz from './RingBufferViz'
import GoGateBufferViz from './GoGateBufferViz'
import { Admonition } from './Admonition'
import { Tabs, TabItem } from './Tabs'
import TrackedPre from './TrackedPre'
import { ChangelogCard } from './ChangelogCard'
import { Mermaid } from './Mermaid'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: TrackedPre,
  table: TableWrapper,
  BlogNewsletterForm,
  RingBufferViz,
  GoGateBufferViz,
  Admonition,
  Tabs,
  TabItem,
  ChangelogCard,
  Mermaid,
}
