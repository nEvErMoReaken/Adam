'use client'

import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import { Pane, PaneLayout } from '@/components/PaneLayout'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

const SKILLS = {
  Languages: ['Go', 'Java', 'Kotlin', 'Python', 'TypeScript', 'CSS'],
  DevOps:    ['Docker', 'K8s', 'Jenkins', 'Ansible', 'Grafana'],
  Infra:     ['Kafka', 'RocketMQ', 'Redis', 'MQTT', 'Consul'],
  DB:        ['MySQL', 'Postgres', 'MongoDB', 'InfluxDB', 'DuckDB'],
  LLM:       ['RAG', 'LangChain', 'LlamaIndex', 'MCP', 'Embedding'],
}

const PROJECTS = [
  { name: 'MSS / IoT Gateway',    role: 'Core Dev + Architect', status: 'RUNNING', since: '2023-07' },
  { name: 'BYD Smart Station',    role: 'PM + Algorithm Eng',   status: 'RUNNING', since: '2025-07' },
  { name: 'Shared EV Charging',   role: 'Backend Dev',          status: 'RUNNING', since: '2025-09' },
  { name: 'BYD Merchandise App',  role: 'Backend Dev',          status: 'DONE',    since: '2025-07' },
  { name: 'AFC Ticketing (CCT)',   role: 'Backend Dev',          status: 'DONE',    since: '2024-11' },
]

function Bar({ label, value, max = 100, color = 'var(--c-blue)' }: { label: string; value: number; max?: number; color?: string }) {
  const pct = Math.round((value / max) * 100)
  const filled = Math.round(pct / 5)
  const empty  = 20 - filled
  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <span className="w-28 shrink-0 text-[var(--c-subtext0)]">{label}</span>
      <span style={{ color }}>{'█'.repeat(filled)}{'░'.repeat(empty)}</span>
      <span className="text-[var(--c-overlay0)]">{pct}%</span>
    </div>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--c-overlay0)] select-none pt-1">
      <span>+{'-'.repeat(18)}+</span>
      <span className="uppercase tracking-widest">{label}</span>
      <span>+{'-'.repeat(18)}+</span>
    </div>
  )
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, occupation, company, github } = content

  return (
    <PaneLayout cols="grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">

      {/* 左 pane：nvidia-smi 风格 */}
      <Pane title="jimmy-smi" index={0}>
        <div className="p-4 space-y-3 font-mono text-xs overflow-x-auto">

          {/* 顶部框 */}
          <div className="text-[var(--c-overlay0)] select-none">
            <p>+{'─'.repeat(54)}+</p>
            <p>| Jimmy-SMI  v2026.04    Driver: BYD-21div            |</p>
            <p>+{'─'.repeat(26)}+{'─'.repeat(27)}+</p>
          </div>

          {/* 基本信息 */}
          <div className="space-y-0.5">
            {[
              ['Name',     name],
              ['Role',     occupation],
              ['Company',  company],
              ['Location', 'Shenzhen, Guangdong'],
              ['GitHub',   github?.replace('https://', '')],
              ['Contact',  'SleepRhino@linux.do'],
              ['Since',    '2023-07 @ BYD'],
            ].map(([k, v]) => (
              <p key={k} className="flex gap-2">
                <span className="w-20 shrink-0 text-[var(--c-subtext0)]">| {k}</span>
                <span className="text-[var(--c-subtext0)]">:</span>
                <span className="text-[var(--c-text)]">{v}</span>
              </p>
            ))}
          </div>

          <Divider label="processes" />

          {/* 项目进程表 */}
          <div className="space-y-0.5">
            <p className="text-[var(--c-overlay0)]">| {'NAME'.padEnd(24)}{'ROLE'.padEnd(20)}STATUS  SINCE</p>
            {PROJECTS.map((p) => (
              <p key={p.name} className="flex gap-1">
                <span className="text-[var(--c-overlay0)]">|</span>
                <span className="w-24 truncate text-[var(--c-blue)]">{p.name}</span>
                <span className="w-20 truncate text-[var(--c-text)]">{p.role}</span>
                <span style={{ color: p.status === 'RUNNING' ? 'var(--c-green)' : 'var(--c-subtext0)' }}>
                  {p.status.padEnd(8)}
                </span>
                <span className="text-[var(--c-overlay0)]">{p.since}</span>
              </p>
            ))}
          </div>

          <Divider label="skill utilization" />

          {/* 技能条 */}
          <div className="space-y-1">
            <Bar label="Go / Backend"   value={92} color="var(--c-blue)" />
            <Bar label="Java / Kotlin"  value={80} color="var(--c-blue)" />
            <Bar label="LLM Eng"        value={78} color="var(--c-mauve)" />
            <Bar label="IoT / Edge"     value={85} color="var(--c-green)" />
            <Bar label="DevOps / Infra" value={75} color="var(--c-yellow)" />
            <Bar label="Frontend"       value={65} color="var(--c-peach)" />
          </div>

          <Divider label="stack" />

          {/* 技术标签 */}
          <div className="space-y-1">
            {Object.entries(SKILLS).map(([category, items]) => (
              <p key={category} className="flex flex-wrap gap-x-2 gap-y-0.5">
                <span className="w-20 shrink-0 text-[var(--c-subtext0)]">| {category}</span>
                <span className="text-[var(--c-overlay0)]">:</span>
                {items.map((s) => (
                  <span key={s} className="text-[var(--c-text)]">{s}</span>
                ))}
              </p>
            ))}
          </div>

          <div className="text-[var(--c-overlay0)] select-none pt-1">
            <p>+{'─'.repeat(54)}+</p>
          </div>
        </div>
      </Pane>

      {/* 右 pane：关于内容 */}
      <Pane title="README.md" index={1}>
        <article className="prose dark:prose-invert max-w-none p-6 text-sm">
          {children}
        </article>
      </Pane>

    </PaneLayout>
  )
}
