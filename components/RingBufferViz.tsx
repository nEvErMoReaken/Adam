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
    push(`  fill() +${free}B  w:${writePos}→${newW} (idx ${wA}→${newW & MASK})  free:0`)
    setWritePos(newW)
  }

  const doReset = () => {
    setReadPos(3); setWritePos(9)
    setLog(['❯ ring-buffer reset', '  readPos=3  writePos=9  avail=6  free=2'])
  }

  const btns = [
    { label: '← read()', action: doRead, disabled: avail <= 0, color: 'var(--c-blue)' },
    { label: 'write() →', action: doWrite, disabled: free <= 0, color: 'var(--c-mauve)' },
    { label: 'fill() all', action: doFill, disabled: free <= 0, color: 'var(--c-teal)' },
    { label: 'reset', action: doReset, disabled: false, color: 'var(--c-overlay0)' },
  ]

  return (
    <div style={{
      margin: '1.5rem 0',
      background: 'var(--c-base)',
      border: '1px solid var(--c-split)',
      borderRadius: '6px',
      overflow: 'hidden',
      fontFamily: 'monospace',
    }}>
      {/* title bar */}
      <div style={{
        background: 'var(--c-mantle)',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        borderBottom: '1px solid var(--c-split)',
      }}>
        {(['var(--c-red)', 'var(--c-yellow)', 'var(--c-green)'] as const).map((c) => (
          <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7, display: 'inline-block' }} />
        ))}
        <span style={{ fontSize: '11px', color: 'var(--c-subtext0)', marginLeft: '8px' }}>
          InteractiveRingBuffer — size={SIZE}  mask=0b{MASK.toString(2).padStart(3, '0')}
        </span>
      </div>

      <div style={{ padding: '20px 16px 16px' }}>

        {/* cells */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', position: 'relative' }}>
          {cells.map((hasData, i) => {
            const isR = i === rA
            const isW = i === wA && avail < SIZE
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                {/* r label above */}
                <div style={{ height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isR && (
                    <span style={{ fontSize: '9px', color: 'var(--c-blue)', fontWeight: 'bold' }}>r</span>
                  )}
                </div>

                <div style={{
                  width: 50,
                  height: 38,
                  borderRadius: '3px',
                  border: `1px solid ${isR ? 'var(--c-blue)' : isW ? 'var(--c-mauve)' : hasData ? 'color-mix(in srgb, var(--c-blue) 60%, transparent)' : 'var(--c-surface1)'}`,
                  background: hasData
                    ? 'color-mix(in srgb, var(--c-blue) 25%, var(--c-surface0))'
                    : 'var(--c-surface0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: hasData ? 'var(--c-blue)' : 'var(--c-surface1)',
                  transition: 'all 0.15s ease',
                  boxShadow: isR ? '0 0 0 1px var(--c-blue)' : isW ? '0 0 0 1px var(--c-mauve)' : 'none',
                }}>
                  {hasData ? '█' : '░'}
                </div>

                {/* w label below */}
                <div style={{ height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isW && (
                    <span style={{ fontSize: '9px', color: 'var(--c-mauve)', fontWeight: 'bold' }}>w</span>
                  )}
                </div>

                <div style={{ fontSize: '9px', color: 'var(--c-overlay0)', marginTop: '2px' }}>[{i}]</div>
              </div>
            )
          })}
        </div>

        {/* stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginTop: '16px',
          padding: '10px 12px',
          background: 'var(--c-surface0)',
          borderRadius: '4px',
          fontSize: '10px',
        }}>
          {[
            { label: 'readPos', val: readPos, sub: `${readPos} & ${MASK} = ${rA}`, color: 'var(--c-blue)' },
            { label: 'writePos', val: writePos, sub: `${writePos} & ${MASK} = ${wA}`, color: 'var(--c-mauve)' },
            { label: 'avail', val: Math.max(0, avail), sub: '可读字节', color: 'var(--c-green)' },
            { label: 'free', val: Math.max(0, free), sub: '可写字节', color: 'var(--c-peach)' },
          ].map(({ label, val, sub, color }) => (
            <div key={label}>
              <div style={{ color: 'var(--c-overlay0)', marginBottom: '2px' }}>{label}</div>
              <div style={{ color, fontWeight: 'bold', fontSize: '14px', lineHeight: 1 }}>{val}</div>
              <div style={{ color: 'var(--c-overlay0)', marginTop: '3px' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* buttons */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
          {btns.map(({ label, action, disabled, color }) => (
            <button
              key={label}
              onClick={action}
              disabled={disabled}
              style={{
                padding: '4px 12px',
                fontSize: '10px',
                fontFamily: 'monospace',
                background: 'var(--c-surface0)',
                color: disabled ? 'var(--c-overlay0)' : color,
                border: `1px solid ${disabled ? 'var(--c-surface1)' : color}`,
                borderRadius: '3px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                transition: 'opacity 0.1s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* log */}
        <div style={{
          marginTop: '10px',
          padding: '10px 12px',
          background: 'var(--c-crust)',
          borderRadius: '4px',
          fontSize: '10px',
          lineHeight: '1.7',
          minHeight: '62px',
        }}>
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
