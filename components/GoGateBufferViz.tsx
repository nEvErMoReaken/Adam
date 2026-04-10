'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const SIZE = 32
const MASK = SIZE - 1
const CX = 110, CY = 110, R = 82

function hasData(i: number, readPos: number, writePos: number): boolean {
  const avail = writePos - readPos
  if (avail <= 0) return false
  if (avail >= SIZE) return true
  const rA = readPos & MASK, wA = writePos & MASK
  return rA < wA ? i >= rA && i < wA : i >= rA || i < wA
}

function dotPos(i: number) {
  const angle = (i / SIZE) * 2 * Math.PI - Math.PI / 2
  return { x: CX + Math.cos(angle) * R, y: CY + Math.sin(angle) * R }
}

export default function GoGateBufferViz() {
  const [readPos, setReadPos] = useState(0)
  const [writePos, setWritePos] = useState(10)
  const [isReading, setIsReading] = useState(false)
  const [isWriting, setIsWriting] = useState(false)
  const [readSpeed, setReadSpeed] = useState(150)
  const [writeSpeed, setWriteSpeed] = useState(100)
  const [logs, setLogs] = useState<string[]>([
    '❯ init  size=32  readPos=0  writePos=10',
    '  avail=10  free=22',
  ])

  const rpRef = useRef(readPos)
  const wpRef = useRef(writePos)
  const readBlockedRef = useRef(false)
  const writeBlockedRef = useRef(false)

  useEffect(() => { rpRef.current = readPos }, [readPos])
  useEffect(() => { wpRef.current = writePos }, [writePos])

  const addLog = useCallback((msg: string) => {
    setLogs(l => [...l.slice(-8), msg])
  }, [])

  // read interval
  useEffect(() => {
    if (!isReading) return
    const id = setInterval(() => {
      const rp = rpRef.current, wp = wpRef.current
      const avail = wp - rp
      if (avail > 0) {
        if (readBlockedRef.current) { readBlockedRef.current = false; addLog('  ↩ 恢复读取') }
        const newRp = rp + 1
        rpRef.current = newRp
        setReadPos(newRp)
        addLog(`  read()   idx[${rp & MASK}]  avail: ${avail} → ${avail - 1}`)
      } else {
        if (!readBlockedRef.current) { readBlockedRef.current = true; addLog('  ⚠ 无数据可读，等待写入...') }
      }
    }, readSpeed)
    return () => clearInterval(id)
  }, [isReading, readSpeed, addLog])

  // write interval
  useEffect(() => {
    if (!isWriting) return
    const id = setInterval(() => {
      const rp = rpRef.current, wp = wpRef.current
      const free = SIZE - (wp - rp)
      if (free > 0) {
        if (writeBlockedRef.current) { writeBlockedRef.current = false; addLog('  ↩ 恢复写入') }
        const newWp = wp + 1
        wpRef.current = newWp
        setWritePos(newWp)
        addLog(`  write()  idx[${wp & MASK}]  free: ${free} → ${free - 1}`)
      } else {
        if (!writeBlockedRef.current) { writeBlockedRef.current = true; addLog('  ⚠ 缓冲区已满，写操作自动阻塞') }
      }
    }, writeSpeed)
    return () => clearInterval(id)
  }, [isWriting, writeSpeed, addLog])

  const doReset = () => {
    setReadPos(0); setWritePos(10)
    rpRef.current = 0; wpRef.current = 10
    setIsReading(false); setIsWriting(false)
    readBlockedRef.current = false; writeBlockedRef.current = false
    setLogs(['❯ reset  size=32  readPos=0  writePos=10', '  avail=10  free=22'])
  }

  const avail = writePos - readPos
  const free = SIZE - avail
  const rA = readPos & MASK
  const wA = writePos & MASK

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
          GoGate RingBuffer — size={SIZE}  mask=0x{MASK.toString(16).padStart(2,'0')}
        </span>
      </div>

      <div className="space-y-3 p-4">

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: isReading ? '⏸ 停止读取' : '▶ 开始读取', action: () => setIsReading(r => !r), active: isReading, color: 'var(--c-blue)' },
            { label: isWriting ? '⏸ 停止写入' : '▶ 开始写入', action: () => setIsWriting(w => !w), active: isWriting, color: 'var(--c-mauve)' },
            { label: 'reset', action: doReset, active: false, color: 'var(--c-overlay0)' },
          ].map(({ label, action, active, color }) => (
            <button key={label} onClick={action}
              className="rounded px-3 py-1 text-[10px] transition-colors"
              style={{
                border: `1px solid ${active ? 'var(--c-red)' : color}`,
                background: 'var(--c-surface0)',
                color: active ? 'var(--c-red)' : color,
                cursor: 'pointer',
              }}>
              {label}
            </button>
          ))}

          <label className="ml-1 flex items-center gap-1.5">
            <span style={{ color: 'var(--c-blue)' }}>读速</span>
            <input type="range" min={50} max={400} value={readSpeed}
              onChange={e => setReadSpeed(+e.target.value)} style={{ width: 64 }} />
            <span style={{ color: 'var(--c-overlay0)' }}>{readSpeed}ms</span>
          </label>
          <label className="flex items-center gap-1.5">
            <span style={{ color: 'var(--c-mauve)' }}>写速</span>
            <input type="range" min={50} max={400} value={writeSpeed}
              onChange={e => setWriteSpeed(+e.target.value)} style={{ width: 64 }} />
            <span style={{ color: 'var(--c-overlay0)' }}>{writeSpeed}ms</span>
          </label>
        </div>

        {/* Ring + Log */}
        <div className="grid grid-cols-2 gap-3">

          {/* SVG Ring */}
          <div className="flex flex-col items-center">
            <svg width="220" height="220" viewBox="0 0 220 220">
              {Array.from({ length: SIZE }, (_, i) => {
                const { x, y } = dotPos(i)
                const filled = hasData(i, readPos, writePos)
                const isR = i === rA && avail > 0
                const isW = i === wA && avail < SIZE
                return (
                  <circle key={i} cx={x} cy={y} r={isR || isW ? 6 : 4.5}
                    style={{ transition: 'fill 0.12s ease' }}
                    fill={
                      isR ? 'var(--c-blue)'
                      : isW ? 'var(--c-mauve)'
                      : filled ? 'color-mix(in srgb, var(--c-blue) 50%, var(--c-surface0))'
                      : 'var(--c-surface1)'
                    }
                    stroke={isR ? 'var(--c-blue)' : isW ? 'var(--c-mauve)' : 'none'}
                    strokeWidth="1.5"
                  />
                )
              })}

              {/* Pointer spokes */}
              {[{ pos: rA, color: 'var(--c-blue)', show: avail > 0 }, { pos: wA, color: 'var(--c-mauve)', show: avail < SIZE }]
                .map(({ pos, color, show }) => {
                  if (!show) return null
                  const angle = (pos / SIZE) * 2 * Math.PI - Math.PI / 2
                  return (
                    <line key={color}
                      x1={CX} y1={CY}
                      x2={CX + Math.cos(angle) * (R - 16)}
                      y2={CY + Math.sin(angle) * (R - 16)}
                      stroke={color} strokeWidth="1.5" opacity="0.45" />
                  )
                })}

              {/* Center stats */}
              <text x={CX} y={CY - 10} textAnchor="middle" fontSize="15" fontWeight="bold"
                fill="var(--c-text)">{avail}</text>
              <text x={CX} y={CY + 5} textAnchor="middle" fontSize="8"
                fill="var(--c-overlay0)">avail</text>
              <text x={CX} y={CY + 17} textAnchor="middle" fontSize="8"
                fill="var(--c-overlay0)">{free} free</text>
            </svg>

            {/* Legend */}
            <div className="flex gap-3 text-[9px]" style={{ color: 'var(--c-overlay0)' }}>
              <span><span style={{ color: 'var(--c-blue)' }}>●</span> readPos[{rA}]</span>
              <span><span style={{ color: 'var(--c-mauve)' }}>●</span> writePos[{wA}]</span>
            </div>
          </div>

          {/* Log */}
          <div className="min-h-[180px] rounded px-3 py-2 leading-relaxed"
            style={{ background: 'var(--c-crust)' }}>
            <div className="mb-1.5 text-[9px] uppercase tracking-widest"
              style={{ color: 'var(--c-overlay0)' }}>OPERATION LOG</div>
            {logs.map((line, i) => (
              <div key={i} style={{
                color: i === logs.length - 1 ? 'var(--c-text)' : 'var(--c-overlay0)',
                lineHeight: 1.7,
              }}>
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Live bit-op */}
        <div className="rounded px-4 py-2.5 leading-loose" style={{ background: 'var(--c-surface0)' }}>
          <div className="mb-0.5 text-[9px] uppercase tracking-widest" style={{ color: 'var(--c-overlay0)' }}>
            位运算取模（实时）
          </div>
          <div style={{ color: 'var(--c-subtext0)' }}>
            <span style={{ color: 'var(--c-blue)' }}>readPos</span>
            {` = ${readPos}  →  ${readPos} & ${MASK} = `}
            <span className="font-bold" style={{ color: 'var(--c-blue)' }}>{rA}</span>
          </div>
          <div style={{ color: 'var(--c-subtext0)' }}>
            <span style={{ color: 'var(--c-mauve)' }}>writePos</span>
            {` = ${writePos}  →  ${writePos} & ${MASK} = `}
            <span className="font-bold" style={{ color: 'var(--c-mauve)' }}>{wA}</span>
            {writePos >= SIZE && (
              <span style={{ color: 'var(--c-green)' }}>  ← 已环绕，无 copy</span>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
