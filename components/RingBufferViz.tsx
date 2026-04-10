'use client'
import { useState } from 'react'

const SIZE = 8
const MASK = SIZE - 1

function getDataCells(readPos: number, writePos: number): boolean[] {
  return Array.from({ length: SIZE }, (_, i) => {
    const avail = writePos - readPos
    if (avail <= 0) return false
    if (avail >= SIZE) return true
    const rA = readPos & MASK
    const wA = writePos & MASK
    return rA < wA ? i >= rA && i < wA : i >= rA || i < wA
  })
}

export default function RingBufferViz() {
  const [readPos, setReadPos] = useState(3)
  const [writePos, setWritePos] = useState(9)
  const [log, setLog] = useState<string[]>([
    '❯ ring-buffer init --size=8 --mask=0b0111',
    '  readPos=3  writePos=9  avail=6  free=2',
  ])

  const avail = writePos - readPos
  const free = SIZE - avail
  const rA = readPos & MASK
  const wA = writePos & MASK
  const cells = getDataCells(readPos, writePos)

  const push = (msg: string) => setLog((l) => [...l.slice(-7), msg])

  const doRead = () => {
    if (avail <= 0) { push('  error: buffer empty'); return }
    const newR = readPos + 1
    push(`  read 1B  r:${readPos}→${newR} (idx ${rA}→${newR & MASK})  avail:${avail}→${avail - 1}`)
    setReadPos(newR)
  }
  const doWrite = () => {
    if (free <= 0) { push('  error: buffer full'); return }
    const newW = writePos + 1
    push(`  write 1B  w:${writePos}→${newW} (idx ${wA}→${newW & MASK})  free:${free}→${free - 1}`)
    setWritePos(newW)
  }
  const doFill = () => {
    if (free <= 0) { push('  error: buffer full'); return }
    const newW = writePos + free
    push(`  fill() +${free}B  w:${writePos}→${newW} (idx ${wA}→${newW & MASK})  free->0`)
    setWritePos(newW)
  }
  const doReset = () => {
    setReadPos(3); setWritePos(9)
    setLog(['❯ ring-buffer reset', '  readPos=3  writePos=9  avail=6  free=2'])
  }

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
          InteractiveRingBuffer — size={SIZE}  mask=0b{MASK.toString(2).padStart(3, '0')}
        </span>
      </div>

      <div className="space-y-4 p-4">

        {/* cells */}
        <div className="flex justify-center gap-1">
          {cells.map((hasData, i) => {
            const isR = i === rA
            const isW = i === wA && avail < SIZE
            return (
              <div key={i} className="flex flex-col items-center" style={{ gap: 2 }}>
                <span className="flex h-3 items-center justify-center text-[9px] font-bold"
                  style={{ color: 'var(--c-blue)', visibility: isR ? 'visible' : 'hidden' }}>r</span>

                <div className="flex h-9 w-12 items-center justify-center rounded text-sm transition-colors"
                  style={{
                    border: `1px solid ${isR ? 'var(--c-blue)' : isW ? 'var(--c-mauve)' : hasData ? 'var(--c-blue)' : 'var(--c-surface1)'}`,
                    background: hasData
                      ? 'color-mix(in srgb, var(--c-blue) 22%, var(--c-surface0))'
                      : 'var(--c-surface0)',
                    color: hasData ? 'var(--c-blue)' : 'var(--c-surface1)',
                    outline: isR ? '2px solid var(--c-blue)' : isW ? '2px solid var(--c-mauve)' : 'none',
                    outlineOffset: 1,
                  }}>
                  {hasData ? '█' : '░'}
                </div>

                <span className="flex h-3 items-center justify-center text-[9px] font-bold"
                  style={{ color: 'var(--c-mauve)', visibility: isW ? 'visible' : 'hidden' }}>w</span>
                <span className="text-[9px]" style={{ color: 'var(--c-overlay0)' }}>[{i}]</span>
              </div>
            )
          })}
        </div>

        {/* stats */}
        <div className="grid grid-cols-4 gap-2 rounded px-3 py-2"
          style={{ background: 'var(--c-surface0)' }}>
          {[
            { label: 'readPos',  val: readPos,            sub: `${readPos}&${MASK}=${rA}`,  color: 'var(--c-blue)'  },
            { label: 'writePos', val: writePos,           sub: `${writePos}&${MASK}=${wA}`, color: 'var(--c-mauve)' },
            { label: 'avail',    val: Math.max(0, avail), sub: '可读字节',                   color: 'var(--c-green)' },
            { label: 'free',     val: Math.max(0, free),  sub: '可写字节',                   color: 'var(--c-peach)' },
          ].map(({ label, val, sub, color }) => (
            <div key={label}>
              <div className="text-[9px]" style={{ color: 'var(--c-overlay0)' }}>{label}</div>
              <div className="text-sm font-bold leading-none" style={{ color }}>{val}</div>
              <div className="mt-0.5 text-[9px]" style={{ color: 'var(--c-overlay0)' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* buttons */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: '← read()',   action: doRead,  disabled: avail <= 0, color: 'var(--c-blue)'    },
            { label: 'write() →',  action: doWrite, disabled: free <= 0,  color: 'var(--c-mauve)'   },
            { label: 'fill() all', action: doFill,  disabled: free <= 0,  color: 'var(--c-teal)'    },
            { label: 'reset',      action: doReset, disabled: false,      color: 'var(--c-overlay0)' },
          ].map(({ label, action, disabled, color }) => (
            <button
              key={label}
              onClick={action}
              disabled={disabled}
              className="rounded px-3 py-1 font-mono text-[10px] transition-opacity"
              style={{
                border: `1px solid ${disabled ? 'var(--c-surface1)' : color}`,
                background: 'var(--c-surface0)',
                color: disabled ? 'var(--c-overlay0)' : color,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.4 : 1,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* log */}
        <div className="min-h-[60px] rounded px-3 py-2 leading-relaxed"
          style={{ background: 'var(--c-crust)' }}>
          {log.map((line, i) => (
            <div key={i} style={{ color: i === log.length - 1 ? 'var(--c-text)' : 'var(--c-overlay0)' }}>
              {line}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
