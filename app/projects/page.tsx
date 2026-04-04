import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'
import { Pane, PaneLayout } from '@/components/PaneLayout'

export const metadata = genPageMetadata({ title: '项目' })

export default function Projects() {
  return (
    <PaneLayout cols="grid-cols-1">
      <Pane title="projects" index={0}>
        <div className="flex flex-wrap p-2">
          {projectsData.map((d) => (
            <Card
              key={d.title}
              title={d.title}
              description={d.description}
              imgSrc={d.imgSrc}
              href={d.href}
            />
          ))}
        </div>
      </Pane>
    </PaneLayout>
  )
}
