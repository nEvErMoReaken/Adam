'use client'

import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import { Pane, PaneLayout } from '@/components/PaneLayout'
import { useLang } from '@/lib/i18n'

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
  AI:        ['Claude Code', 'OpenCode', '...whatever is interesting'],
}

const PROJECTS = [
  { nameZh: 'MSS / IoT网关',   nameEn: 'MSS / IoT Gateway',   roleZh: '核心开发+架构', roleEn: 'Core Dev + Arch', running: true,  since: '2023-07' },
  { nameZh: 'BYD充电站智能化', nameEn: 'BYD Smart Station',   roleZh: 'PM+算法工程化', roleEn: 'PM + Algo Eng',   running: true,  since: '2025-07' },
  { nameZh: '迪电共享充电桩',  nameEn: 'Shared EV Charging',  roleZh: '后端开发',      roleEn: 'Backend Dev',     running: true,  since: '2025-09' },
  { nameZh: '纯正用品商城',    nameEn: 'BYD Merchandise App', roleZh: '后端开发',      roleEn: 'Backend Dev',     running: false, since: '2025-07' },
  { nameZh: 'AFC售检票系统',   nameEn: 'AFC Ticketing (CCT)', roleZh: '后端开发',      roleEn: 'Backend Dev',     running: false, since: '2024-11' },
]

const BARS = [
  { labelZh: 'Go / 后端',       labelEn: 'Go / Backend',   value: 92, color: 'var(--c-blue)' },
  { labelZh: 'Java / Kotlin',   labelEn: 'Java / Kotlin',  value: 80, color: 'var(--c-blue)' },
  { labelZh: 'LLM 工程化',      labelEn: 'LLM Eng',        value: 78, color: 'var(--c-mauve)' },
  { labelZh: 'IoT / 边缘',      labelEn: 'IoT / Edge',     value: 85, color: 'var(--c-green)' },
  { labelZh: '运维 / 基础设施', labelEn: 'DevOps / Infra', value: 75, color: 'var(--c-yellow)' },
  { labelZh: '前端',             labelEn: 'Frontend',       value: 65, color: 'var(--c-peach)' },
]

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  const filled = Math.round(value / 5)
  const empty  = 20 - filled
  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <span className="w-28 shrink-0 text-[var(--c-subtext0)]">{label}</span>
      <span style={{ color }}>{'█'.repeat(filled)}{'░'.repeat(empty)}</span>
      <span className="text-[var(--c-overlay0)]">{value}%</span>
    </div>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1 font-mono text-[10px] text-[var(--c-overlay0)] select-none py-1">
      <span>+-{'-'.repeat(14)}-+</span>
      <span className="uppercase tracking-widest shrink-0">{label}</span>
      <span>+-{'-'.repeat(14)}-+</span>
    </div>
  )
}

export default function AuthorLayout({ children, content }: Props) {
  const { t, lang } = useLang()
  const { name, occupation, company, github } = content

  return (
    <PaneLayout cols="grid-cols-1">
      <Pane title={t.smiTitle} index={0}>
        <div className="p-4 space-y-2 font-mono text-xs overflow-x-auto">

          {/* 顶部框 */}
          <div className="text-[var(--c-overlay0)] select-none">
            <p>+{'─'.repeat(54)}+</p>
            <p>| Jimmy-SMI  v2026.04    {t.smiDriver.padEnd(30)}|</p>
            <p>+{'─'.repeat(26)}+{'─'.repeat(27)}+</p>
          </div>

          {/* 基本信息 */}
          <div className="space-y-0.5">
            {([
              [t.smiName,     name],
              [t.smiRole,     occupation],
              [t.smiCompany,  company],
              [t.smiLocation, 'Shenzhen, Guangdong'],
              [t.smiContact,  'SleepRhino@linux.do'],
              ['GitHub',      github?.replace('https://', '')],
              [t.smiSince,    '2023-07 @ BYD'],
            ] as [string, string][]).map(([k, v]) => (
              <p key={k} className="flex gap-2">
                <span className="w-20 shrink-0 text-[var(--c-subtext0)]">| {k}</span>
                <span className="text-[var(--c-subtext0)]">:</span>
                <span className="text-[var(--c-text)]">{v}</span>
              </p>
            ))}
          </div>

          <Divider label={t.smiProcesses} />

          {/* 项目 */}
          <div className="space-y-0.5">
            {PROJECTS.map((p) => (
              <p key={p.nameEn} className="flex gap-1">
                <span className="text-[var(--c-overlay0)]">|</span>
                <span className="w-24 truncate text-[var(--c-blue)]">{lang === 'zh' ? p.nameZh : p.nameEn}</span>
                <span className="w-20 truncate text-[var(--c-text)]">{lang === 'zh' ? p.roleZh : p.roleEn}</span>
                <span style={{ color: p.running ? 'var(--c-green)' : 'var(--c-subtext0)' }} className="w-16 shrink-0">
                  {p.running ? t.smiStatusRunning : t.smiStatusDone}
                </span>
                <span className="text-[var(--c-overlay0)]">{p.since}</span>
              </p>
            ))}
          </div>

          <Divider label={t.smiSkillUtil} />

          {/* 技能条 */}
          <div className="space-y-1">
            {BARS.map((b) => (
              <Bar key={b.labelEn} label={lang === 'zh' ? b.labelZh : b.labelEn} value={b.value} color={b.color} />
            ))}
          </div>

          <Divider label={t.smiStack} />

          {/* 技术栈 */}
          <div className="space-y-0.5">
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
    </PaneLayout>
  )
}
