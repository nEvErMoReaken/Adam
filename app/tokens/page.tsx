import { genPageMetadata } from 'app/seo'
import IinaTokensPage from './IinaTokensPage'

export const metadata = genPageMetadata({ title: 'tokens' })

export default function Page() {
  return <IinaTokensPage />
}
