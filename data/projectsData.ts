interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'MyRingbuffer_BenchMark',
    description: `Go 环形缓冲区专用实现：针对 IoT 网关单线程 TCP 流设计，位运算取模 + 零锁 + 懒汉式填充，大数据块吞吐较 bufio 快 61%，较 smallnest 快 156%。附完整五场景基准测试。`,
    href: 'https://github.com/nEvErMoReaken/MyRingbuffer_BenchMark',
  },
  {
    title: 'Adam',
    description: `个人技术博客，基于 Next.js + Tailwind CSS + Contentlayer 构建，Catppuccin 配色，支持 MDX 交互式组件。记录技术思考与项目经验。`,
    href: 'https://github.com/nEvErMoReaken/Adam',
  },
]

export default projectsData
