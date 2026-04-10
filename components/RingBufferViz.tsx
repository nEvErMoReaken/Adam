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

const CX = 150, CY = 150, OUTER = 92, INNER = 56

/** Full pie wedge from center to outer radius for slot i */
function wedgePath(i: number): string {
  const startA = (i / SIZE) * 2 * Math.PI - Math.PI / 2
  const endA   = ((i + 1) / SIZE) * 2 * Math.PI - Math.PI / 2
  const x1 = CX + Math.cos(startA) * OUTER
  const y1 = CY + Math.sin(startA) * OUTER
  const x2 = CX + Math.cos(endA) * OUTER
  const y2 = CY + Math.sin(endA) * OUTER
  return `M ${CX} ${CY} L ${x1} ${y1} A ${OUTER} ${OUTER} 0 0 1 ${x2} ${y2} Z`
}

/** Point at radius r at the midpoint of slot i */
function mid(i: number, r: number) {
  const a = ((i + 0.5) / SIZE) * 2 * Math.PI - Math.PI / 2
  return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r, a }
}

/** Tick + dot + label outside the ring for a pointer at slot pos */
function tick(pos: number) {
  const { a } = mid(pos, OUTER)
  const ca = Math.cos(a), sa = Math.sin(a)
  return {
    x1: CX + ca * (OUTER + 4),  y1: CY + sa * (OUTER + 4),
    x2: CX + ca * (OUTER + 18), y2: CY + sa * (OUTER + 18),
    tx: CX + ca * (OUTER + 32), ty: CY + sa * (OUTER + 32),
    anchor: ca > 0.3 ? 'start' : ca < -0.3 ? 'end' : 'middle',
  }
}

// Catppuccin colours used in SVG (must be concrete values, not CSS vars,
// because SVG fill/stroke attrs are not CSS properties)
const C = {
  blue:      '#89b4fa',
  blueDim:   '#5b8fd4',
  mauve:     '#cba6f7',
  surface0:  '#313244',
  surface1:  '#45475a',
  overlay0:  '#6c7086',
  base:      '#1e1e2e',
  text:      '#cdd6f4',
  crust:     '#11111b',
}

export default function RingBufferViz() {
  const [step, setStep] = useState(0)
  const cur  = STEPS[step]
  const avail = cur.data.filter(Boolean).length
  const rTick = tick(cur.r)
  const wTick = tick(cur.w)

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

        {/* SVG ring */}
        <div className="flex justify-center">
          <svg width="300" height="300" viewBox="0 0 300 300">

            {/* ① Pie wedges — full sector from center, separated by stroke */}
            {cur.data.map((hasData, i) => {
              const isR = i === cur.r
              const isW = i === cur.w && !(isR && avail === SIZE) // both same slot when full
              const fill = isR ? C.blue
                         : isW ? C.mauve
                         : hasData ? C.blueDim
                         : C.surface1
              return (
                <path key={i} d={wedgePath(i)}
                  fill={fill}
                  stroke={C.base}
                  strokeWidth="3"
                  style={{ transition: 'fill 0.3s ease' }}
                />
              )
            })}

            {/* ② Center circle — masks the wedge tips to form a donut */}
            <circle cx={CX} cy={CY} r={INNER} fill={C.base} />

            {/* ③ Index labels in the ring band */}
            {cur.data.map((hasData, i) => {
              const { x, y } = mid(i, (INNER + OUTER) / 2)
              const isR = i === cur.r, isW = i === cur.w
              return (
                <text key={i} x={x} y={y}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="11" fontWeight="600"
                  fill={isR || isW || hasData ? C.crust : C.overlay0}>
                  {i}
                </text>
              )
            })}

            {/* ④ Read pointer */}
            <line x1={rTick.x1} y1={rTick.y1} x2={rTick.x2} y2={rTick.y2}
              stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={rTick.x2} cy={rTick.y2} r="4" fill={C.blue} />
            <text x={rTick.tx} y={rTick.ty}
              textAnchor={rTick.anchor} dominantBaseline="middle"
              fontSize="11" fontWeight="bold" fill={C.blue}>
              r={cur.r}
            </text>

            {/* ⑤ Write pointer */}
            <line x1={wTick.x1} y1={wTick.y1} x2={wTick.x2} y2={wTick.y2}
              stroke={C.mauve} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={wTick.x2} cy={wTick.y2} r="4" fill={C.mauve} />
            <text x={wTick.tx} y={wTick.ty}
              textAnchor={wTick.anchor} dominantBaseline="middle"
              fontSize="11" fontWeight="bold" fill={C.mauve}>
              w={cur.w}
            </text>

            {/* ⑥ Center stats */}
            <text x={CX} y={CY - 9} textAnchor="middle"
              fontSize="22" fontWeight="bold" fill={C.text}>{avail}</text>
            <text x={CX} y={CY + 11} textAnchor="middle"
              fontSize="9" fill={C.overlay0}>avail bytes</text>

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
              ↻ 写指针越过末尾自然回到索引 0，无需移动任何数据
            </div>
          )}
        </div>

        {/* Prev / Next */}
        <div className="flex justify-between">
          {[
            { label: '← 上一步', fn: () => setStep(s => s - 1), dis: step === 0,               color: 'var(--c-overlay0)' },
            { label: '下一步 →', fn: () => setStep(s => s + 1), dis: step === STEPS.length - 1, color: 'var(--c-green)'   },
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
