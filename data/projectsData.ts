interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: '项目名称一',
    description: `这里是项目描述，介绍这个项目的背景、功能和技术栈。`,
    imgSrc: '/static/images/google.png',
    href: 'https://www.google.com',
  },
  {
    title: '项目名称二',
    description: `这里是另一个项目的描述，你可以替换为真实的项目信息。`,
    imgSrc: '/static/images/time-machine.jpg',
    href: '/blog/the-time-machine',
  },
]

export default projectsData
