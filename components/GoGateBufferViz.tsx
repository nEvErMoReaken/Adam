export default function GoGateBufferViz() {
  const SIZE = 8
  const MASK = SIZE - 1
  const readPos = 3
  const writePos = 9
  const rA = readPos & MASK   // 3
  const wA = writePos & MASK  // 1

  const cells = Array.from({ length: SIZE }, (_, i) => {
    return rA < wA ? i >= rA && i < wA : i >= rA || i < wA
  })

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
            { field: 'ringSize', type: 'uint32', val: `${SIZE}`, note: '必须为 2 的幂',         valColor: 'var(--c-peach)' },
            { field: 'readPos ', type: 'uint32', val: `${readPos}`, note: `逻辑指针 → idx ${rA}`,  valColor: 'var(--c-blue)'  },
            { field: 'writePos', type: 'uint32', val: `${writePos}`, note: `逻辑指针 → idx ${wA}`, valColor: 'var(--c-mauve)' },
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
        <div className="flex justify-center gap-1">
          {cells.map((hasData, i) => {
            const isR = i === rA
            const isW = i === wA
            return (
              <div key={i} className="flex flex-col items-center" style={{ gap: 2 }}>
                <span className="flex h-3 items-center justify-center text-[9px] font-bold"
                  style={{ color: 'var(--c-blue)', visibility: isR ? 'visible' : 'hidden' }}>r</span>
                <div className="flex h-8 w-11 items-center justify-center rounded text-sm"
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

        {/* bit operation */}
        <div className="rounded px-4 py-3 leading-loose" style={{ background: 'var(--c-crust)' }}>
          <div className="mb-1 text-[9px] uppercase tracking-widest" style={{ color: 'var(--c-overlay0)' }}>
            位运算取模
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
            <span style={{ color: 'var(--c-green)' }}>  ← 自然环绕，无 copy</span>
          </div>
          <div style={{ color: 'var(--c-overlay0)' }}>
            {`avail = writePos - readPos = ${writePos} - ${readPos} = ${writePos - readPos}`}
          </div>
        </div>

      </div>
    </div>
  )
}
