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

export default function GoGateBufferViz() {
  const [readPos, setReadPos] = useState(3)
  const [writePos, setWritePos] = useState(9)

  const avail = writePos - readPos
  const free = SIZE - avail
  const rA = readPos & MASK
  const wA = writePos & MASK
  const cells = getDataCells(readPos, writePos)

  const doRead  = () => { if (avail > 0) setReadPos((r) => r + 1) }
  const doWrite = () => { if (free > 0) setWritePos((w) => w + 1) }
  const doReset = () => { setReadPos(3); setWritePos(9) }

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
          GoGate RingBuffer — 位运算取模示意
        </span>
      </div>

      <div className="space-y-4 p-4">

        {/* struct fields */}
        <div className="rounded px-4 py-3" style={{ background: 'var(--c-surface0)' }}>
          <div className="mb-1.5 text-[9px] uppercase tracking-widest" style={{ color: 'var(--c-overlay0)' }}>
            STRUCT FIELDS
          </div>
          {[
            { field: 'ringSize', type: 'uint32', val: `${SIZE}`,     note: '必须为 2 的幂',         valColor: 'var(--c-peach)' },
            { field: 'readPos ', type: 'uint32', val: `${readPos}`,  note: `逻辑指针 → idx ${rA}`,  valColor: 'var(--c-blue)'  },
            { field: 'writePos', type: 'uint32', val: `${writePos}`, note: `逻辑指针 → idx ${wA}`,  valColor: 'var(--c-mauve)' },
          ].map(({ field, type, val, note, valColor }) => (
            <div key={field} className="flex items-baseline gap-3 leading-loose">
              <span className="w-16" style={{ color: 'var(--c-overlay0)' }}>{field}</span>
              <span className="w-14" style={{ color: 'var(--c-green)' }}>{type}</span>
              <span className="w-5 font-bold" style={{ color: valColor }}>{val}</span>
              <span className="text-[9px]" style={{ color: 'var(--c-overlay0)' }}>// {note}</span>
            </div>
          ))}
        </div>

        {/* buffer cells */}
        <div className="rounded px-4 py-3" style={{ background: 'var(--c-surface0)' }}>
          <div className="mb-3 text-[9px] uppercase tracking-widest" style={{ color: 'var(--c-overlay0)' }}>
            BUFFER SLOTS
          </div>
          <div className="flex justify-center gap-1.5">
            {cells.map((hasData, i) => {
              const isR = i === rA
              const isW = i === wA && avail < SIZE
              const borderColor = isR
                ? 'var(--c-blue)'
                : isW
                  ? 'var(--c-mauve)'
                  : hasData
                    ? 'var(--c-blue)'
                    : 'var(--c-surface2)'
              const bg = hasData
                ? 'color-mix(in srgb, var(--c-blue) 28%, var(--c-surface0))'
                : 'var(--c-base)'
              return (
                <div key={i} className="flex flex-col items-center" style={{ gap: 3 }}>
                  {/* r pointer */}
                  <div className="flex h-3.5 w-10 items-center justify-center rounded-sm text-[9px] font-bold"
                    style={{
                      background: isR ? 'color-mix(in srgb, var(--c-blue) 18%, transparent)' : 'transparent',
                      color: 'var(--c-blue)',
                      visibility: isR ? 'visible' : 'hidden',
                    }}>
                    r
                  </div>

                  {/* cell */}
                  <div className="flex h-9 w-10 flex-col items-center justify-center gap-0.5 rounded"
                    style={{
                      border: `1.5px solid ${borderColor}`,
                      background: bg,
                      outline: isR ? '2px solid var(--c-blue)' : isW ? '2px solid var(--c-mauve)' : 'none',
                      outlineOffset: 2,
                    }}>
                    <div className="h-1.5 w-5 rounded-full"
                      style={{ background: hasData ? 'var(--c-blue)' : 'var(--c-surface2)' }} />
                    <div className="h-1.5 w-5 rounded-full"
                      style={{ background: hasData ? 'color-mix(in srgb, var(--c-blue) 60%, transparent)' : 'var(--c-surface1)' }} />
                  </div>

                  {/* w pointer */}
                  <div className="flex h-3.5 w-10 items-center justify-center rounded-sm text-[9px] font-bold"
                    style={{
                      background: isW ? 'color-mix(in srgb, var(--c-mauve) 18%, transparent)' : 'transparent',
                      color: 'var(--c-mauve)',
                      visibility: isW ? 'visible' : 'hidden',
                    }}>
                    w
                  </div>

                  {/* index */}
                  <span className="text-[9px]" style={{ color: 'var(--c-overlay0)' }}>[{i}]</span>
                </div>
              )
            })}
          </div>

          {/* legend */}
          <div className="mt-3 flex justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-4 rounded-full" style={{ background: 'var(--c-blue)' }} />
              <span style={{ color: 'var(--c-overlay0)' }}>occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-4 rounded-full" style={{ background: 'var(--c-surface2)' }} />
              <span style={{ color: 'var(--c-overlay0)' }}>free</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm" style={{ border: '2px solid var(--c-blue)' }} />
              <span style={{ color: 'var(--c-overlay0)' }}>readPos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm" style={{ border: '2px solid var(--c-mauve)' }} />
              <span style={{ color: 'var(--c-overlay0)' }}>writePos</span>
            </div>
          </div>
        </div>

        {/* bit operation — updates live */}
        <div className="rounded px-4 py-3 leading-loose" style={{ background: 'var(--c-crust)' }}>
          <div className="mb-1 text-[9px] uppercase tracking-widest" style={{ color: 'var(--c-overlay0)' }}>
            位运算取模（实时）
          </div>
          <div style={{ color: 'var(--c-subtext0)' }}>
            <span style={{ color: 'var(--c-blue)' }}>readPos</span>
            {` = ${readPos}  →  ${readPos} & (${SIZE}-1) = ${readPos} & ${MASK} = `}
            <span className="font-bold" style={{ color: 'var(--c-blue)' }}>{rA}</span>
          </div>
          <div style={{ color: 'var(--c-subtext0)' }}>
            <span style={{ color: 'var(--c-mauve)' }}>writePos</span>
            {` = ${writePos}  →  ${writePos} & (${SIZE}-1) = ${writePos} & ${MASK} = `}
            <span className="font-bold" style={{ color: 'var(--c-mauve)' }}>{wA}</span>
            {writePos >= SIZE && (
              <span style={{ color: 'var(--c-green)' }}>  ← 环绕，无 copy</span>
            )}
          </div>
          <div style={{ color: 'var(--c-overlay0)' }}>
            {`avail = writePos - readPos = ${writePos} - ${readPos} = ${avail}  |  free = ${SIZE} - ${avail} = ${free}`}
          </div>
        </div>

        {/* buttons */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: '← read()',  action: doRead,  disabled: avail <= 0, color: 'var(--c-blue)'    },
            { label: 'write() →', action: doWrite, disabled: free <= 0,  color: 'var(--c-mauve)'   },
            { label: 'reset',     action: doReset, disabled: false,      color: 'var(--c-overlay0)' },
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

      </div>
    </div>
  )
}
