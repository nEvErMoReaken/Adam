'use client'

import Pre from 'pliny/ui/Pre'
import { track } from '@/lib/umami'

type PreProps = React.ComponentProps<typeof Pre>

export default function TrackedPre(props: PreProps) {
  return (
    <div onClick={(e) => {
      if ((e.target as HTMLElement).closest('button')) {
        track('code-copy')
      }
    }}>
      <Pre {...props} />
    </div>
  )
}
