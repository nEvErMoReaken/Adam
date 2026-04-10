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
    push(`  fill() +${free}B  w:${writePos}→${newW} (idx ${wA}→${newW & MASK})  free→0`)
    setWritePos(newW)
  }
  const doReset = () => {
    setReadPos(3); setWritePos(9)
    setLog(['❯ ring-buffer reset', '  readPos=3  writePos=9  avail=6  free=2'])
  }

  const btns = [
    { label: '← read()',  action: doRead,  disabled: avail <= 0, color: 'text-[var(--c-blue)]   border-[var(--c-blue)]' },
    { label: 'write() →', action: doWrite, disabled: free <= 0,  color: 'text-[var(--c-mauve)]  border-[var(--c-mauve)]' },
    { label: 'fill() all',action: doFill,  disabled: free <= 0,  color: 'text-[var(--c-teal)]   border-[var(--c-teal)]' },
    { label: 'reset',     action: doReset, disabled: false,       color: 'text-[var(--c-overlay0)] border-[var(--c-surface1)]' },
  ]

  return (
    <div className="my-6 overflow-hidden rounded-md border border-[var(--c-split)] bg-[var(--c-base)] font-mono text-[11px]">

      {/* title bar */}
      <div className="flex items-center gap-1.5 border-b border-[var(--c-split)] bg-[var(--c-mantle)] px-4 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--c-red)] opacity-70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--c-yellow)] opacity-70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--c-green)] opacity-70" />
        <span className="ml-2 text-[var(--c-subtext0)]">InteractiveRingBuffer — size={SIZE}  mask=0b{MASK.toString(2).padStart(3,'0')}</span>
      </div>

      <div className="space-y-4 p-4">

        {/* cells */}
        <div className="flex justify-center gap-1">
          {cells.map((hasData, i) => {
            const isR = i === rA
            const isW = i === wA && avail < SIZE
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="h-3 text-[9px] font-bold text-[var(--c-blue)]">{isR ? 'r' : ''}</span>
                <div className={[
                  'flex h-9 w-12 items-center justify-center rounded text-sm transition-all duration-150',
                  hasData
                    ? 'border border-[var(--c-blue)] bg-[color-mix(in_srgb,var(--c-blue)_25%,var(--c-surface0))] text-[var(--c-blue)]'
                    : 'border border-[var(--c-surface1)] bg-[var(--c-surface0)] text-[var(--c-surface1)]',
                  isR ? 'ring-1 ring-[var(--c-blue)]' : '',
                  isW ? 'ring-1 ring-[var(--c-mauve)]' : '',
                ].join(' ')}>
                  {hasData ? '█' : '░'}
                </div>
                <span className="h-3 text-[9px] font-bold text-[var(--c-mauve)]">{isW ? 'w' : ''}</span>
                <span className="text-[9px] text-[var(--c-overlay0)]">[{i}]</span>
              </div>
            )
          })}
        </div>

        {/* stats */}
        <div className="grid grid-cols-4 gap-2 rounded bg-[var(--c-surface0)] px-3 py-2">
          {[
            { label: 'readPos',  val: readPos,         sub: `${readPos}&${MASK}=${rA}`,  color: 'text-[var(--c-blue)]'  },
            { label: 'writePos', val: writePos,        sub: `${writePos}&${MASK}=${wA}`, color: 'text-[var(--c-mauve)]' },
            { label: 'avail',    val: Math.max(0,avail), sub: '可读字节',                color: 'text-[var(--c-green)]' },
            { label: 'free',     val: Math.max(0,free),  sub: '可写字节',                color: 'text-[var(--c-peach)]' },
          ].map(({ label, val, sub, color }) => (
            <div key={label}>
              <div className="text-[var(--c-overlay0)]">{label}</div>
              <div className={`text-sm font-bold leading-none ${color}`}>{val}</div>
              <div className="mt-0.5 text-[9px] text-[var(--c-overlay0)]">{sub}</div>
            </div>
          ))}
        </div>

        {/* buttons */}
        <div className="flex flex-wrap gap-1.5">
          {btns.map(({ label, action, disabled, color }) => (
            <button
              key={label}
              onClick={action}
              disabled={disabled}
              className={`rounded border bg-[var(--c-surface0)] px-3 py-1 font-mono text-[10px] transition-opacity ${color} ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:opacity-80'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* log */}
        <div className="min-h-[58px] rounded bg-[var(--c-crust)] px-3 py-2 leading-relaxed text-[var(--c-overlay0)]">
          {log.map((line, i) => (
            <div key={i} className={i === log.length - 1 ? 'text-[var(--c-text)]' : 'text-[var(--c-overlay0)]'}>
              {line}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
