'use client'
import { useState } from 'react'

const SIZE = 10
const STEPS = [
  {
    title: '初始状态',
    desc: '数组长度10，r=5，w=8，可读数据3字节（位置 5、6、7）',
    r: 5, w: 8,
    data: [0,0,0,0,0,1,1,1,0,0] as number[],
  },
  {
    title: 'read(4) 请求',
    desc: '需要4字节但只有3字节可用，触发 fill() 从网络补充数据',
    r: 5, w: 8,
    data: [0,0,0,0,0,1,1,1,0,0] as number[],
  },
  {
    title: '写指针自然环绕',
    desc: '写指针 8→9→0→1→2→3→4→5 自然回绕，无需 memmove，整个缓冲区填满',
    r: 5, w: 5,
    data: [1,1,1,1,1,1,1,1,1,1] as number[],
  },
  {
    title: '返回4字节',
    desc: '数据充足，返回4字节，读指针 r: 5→9，位置 5~8 变为空闲',
    r: 9, w: 5,
    data: [1,1,1,1,1,0,0,0,0,1] as number[],
  },
]

const CX = 130, CY = 130, OUTER = 88, INNER = 58

function slicePath(i: number): string {
  const gap = 0.08
  const startA = (i / SIZE) * 2 * Math.PI - Math.PI / 2 + gap
  const endA = ((i + 1) / SIZE) * 2 * Math.PI - Math.PI / 2 - gap
  const x1o = CX + Math.cos(startA) * OUTER, y1o = CY + Math.sin(startA) * OUTER
  const x2o = CX + Math.cos(endA) * OUTER,   y2o = CY + Math.sin(endA) * OUTER
  const x1i = CX + Math.cos(startA) * INNER, y1i = CY + Math.sin(startA) * INNER
  const x2i = CX + Math.cos(endA) * INNER,   y2i = CY + Math.sin(endA) * INNER
  return `M ${x1o} ${y1o} A ${OUTER} ${OUTER} 0 0 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${INNER} ${INNER} 0 0 0 ${x1o} ${y1o} Z`
}

function labelPos(i: number) {
  const midA = ((i + 0.5) / SIZE) * 2 * Math.PI - Math.PI / 2
  const r = (OUTER + INNER) / 2
  return { x: CX + Math.cos(midA) * r, y: CY + Math.sin(midA) * r }
}

function pointerLine(pos: number, label: string, color: string) {
  const midA = ((pos + 0.5) / SIZE) * 2 * Math.PI - Math.PI / 2
  return {
    x1: CX + Math.cos(midA) * (INNER - 8),
    y1: CY + Math.sin(midA) * (INNER - 8),
    x2: CX + Math.cos(midA) * (OUTER + 14),
    y2: CY + Math.sin(midA) * (OUTER + 14),
    tx: CX + Math.cos(midA) * (OUTER + 30),
    ty: CY + Math.sin(midA) * (OUTER + 30),
    color, label,
  }
}

export default function RingBufferViz() {
  const [step, setStep] = useState(0)
  const cur = STEPS[step]
  const rPtr = pointerLine(cur.r, `r=${cur.r}`, 'var(--c-blue)')
  const wPtr = pointerLine(cur.w, `w=${cur.w}`, 'var(--c-mauve)')
  const avail = cur.data.filter(Boolean).length

  return (
    <div className="my-6 overflow-hidden rounded-md border font-mono text-[11px]"
      style={{ borderColor: 'var(--c-split)', background: 'var(--c-base)' }}>

      {/* title bar */}
      <div className="flex items-center gap-1.5 border-b px-4 py-1.5"
        style={{ background: 'var(--c-mantle)', borderColor: 'var(--c-split)' }}>
        <span className="inline-block h-2.5 w-2.5 rounded-full opacity-70" style={{ background: 'var(--c-red)' }} />
        <span className="inline-block h-2.5 w-2.5 rounded-full opacity-70" style={{ background: 'var(--c-yellow)' }} />
        <span className="inline-block h-2.5 w-2.5 rounded-full opacity-70" style={{ background: 'var(--c-green)' }} />
        <span className="ml-2" style={{ color: 'var(--c-subtext0)' }}>
          InteractiveRingBuffer — size={SIZE}
        </span>
      </div>

      <div className="space-y-3 p-4">

        {/* Step selector */}
        <div className="flex flex-wrap gap-1.5">
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => setStep(i)}
              className="rounded px-2.5 py-1 text-[10px] transition-colors"
              style={{
                background: i === step
                  ? 'color-mix(in srgb, var(--c-blue) 18%, var(--c-surface0))'
                  : 'var(--c-surface0)',
                border: `1px solid ${i === step ? 'var(--c-blue)' : 'var(--c-surface2)'}`,
                color: i === step ? 'var(--c-blue)' : 'var(--c-subtext0)',
                cursor: 'pointer',
              }}>
              {i + 1}. {s.title}
            </button>
          ))}
        </div>

        {/* SVG Ring */}
        <div className="flex justify-center">
          <svg width="280" height="280" viewBox="20 20 220 220">
            {/* Slices */}
            {cur.data.map((hasData, i) => (
              <path key={i} d={slicePath(i)}
                style={{ transition: 'fill 0.3s ease' }}
                fill={hasData
                  ? 'color-mix(in srgb, var(--c-blue) 60%, var(--c-surface0))'
                  : 'var(--c-surface0)'}
                stroke="var(--c-base)"
                strokeWidth="1.5"
              />
            ))}

            {/* Index labels inside slices */}
            {cur.data.map((hasData, i) => {
              const { x, y } = labelPos(i)
              return (
                <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                  fontSize="9" fontWeight="500"
                  fill={hasData ? 'var(--c-base)' : 'var(--c-overlay0)'}>
                  {i}
                </text>
              )
            })}

            {/* Read pointer */}
            <line x1={rPtr.x1} y1={rPtr.y1} x2={rPtr.x2} y2={rPtr.y2}
              stroke="var(--c-blue)" strokeWidth="2" />
            <circle cx={rPtr.x2} cy={rPtr.y2} r="3.5" fill="var(--c-blue)" />
            <text x={rPtr.tx} y={rPtr.ty} textAnchor="middle" dominantBaseline="middle"
              fontSize="10" fontWeight="bold" fill="var(--c-blue)">{rPtr.label}</text>

            {/* Write pointer */}
            <line x1={wPtr.x1} y1={wPtr.y1} x2={wPtr.x2} y2={wPtr.y2}
              stroke="var(--c-mauve)" strokeWidth="2" />
            <circle cx={wPtr.x2} cy={wPtr.y2} r="3.5" fill="var(--c-mauve)" />
            <text x={wPtr.tx} y={wPtr.ty} textAnchor="middle" dominantBaseline="middle"
              fontSize="10" fontWeight="bold" fill="var(--c-mauve)">{wPtr.label}</text>

            {/* Center */}
            <text x={CX} y={CY - 9} textAnchor="middle" fontSize="18" fontWeight="bold"
              fill="var(--c-text)">{avail}</text>
            <text x={CX} y={CY + 9} textAnchor="middle" fontSize="9"
              fill="var(--c-overlay0)">avail</text>
          </svg>
        </div>

        {/* Step description */}
        <div className="rounded px-4 py-3" style={{ background: 'var(--c-surface0)' }}>
          <div className="mb-1 font-bold" style={{ color: 'var(--c-blue)' }}>
            步骤 {step + 1}：{cur.title}
          </div>
          <div style={{ color: 'var(--c-subtext0)' }}>{cur.desc}</div>
          {step === 2 && (
            <div className="mt-1.5" style={{ color: 'var(--c-green)' }}>
              ← 写指针越过末尾后自然回到索引 0，无需移动任何数据
            </div>
          )}
        </div>

        {/* Prev / Next */}
        <div className="flex justify-between">
          {[
            { label: '← 上一步', fn: () => setStep(s => s - 1), dis: step === 0, color: 'var(--c-overlay0)' },
            { label: '下一步 →', fn: () => setStep(s => s + 1), dis: step === STEPS.length - 1, color: 'var(--c-green)' },
          ].map(({ label, fn, dis, color }) => (
            <button key={label} onClick={fn} disabled={dis}
              className="rounded px-4 py-1.5 font-mono text-[10px]"
              style={{
                border: `1px solid ${dis ? 'var(--c-surface1)' : color}`,
                background: 'var(--c-surface0)',
                color: dis ? 'var(--c-overlay0)' : color,
                cursor: dis ? 'not-allowed' : 'pointer',
                opacity: dis ? 0.4 : 1,
              }}>
              {label}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
