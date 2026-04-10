export default function GoGateBufferViz() {
  const SIZE = 8
  const MASK = SIZE - 1
  const readPos = 3
  const writePos = 9
  const rA = readPos & MASK   // 3
  const wA = writePos & MASK  // 1

  const cells = Array.from({ length: SIZE }, (_, i) => {
    const rAc = readPos & MASK
    const wAc = writePos & MASK
    return rAc < wAc ? i >= rAc && i < wAc : i >= rAc || i < wAc
  })

  return (
    <div className="my-6 overflow-hidden rounded-md border border-[var(--c-split)] bg-[var(--c-base)] font-mono text-[11px]">

      {/* title bar */}
      <div className="flex items-center gap-1.5 border-b border-[var(--c-split)] bg-[var(--c-mantle)] px-4 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--c-red)] opacity-70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--c-yellow)] opacity-70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--c-green)] opacity-70" />
        <span className="ml-2 text-[var(--c-subtext0)]">GoGate RingBuffer — 位运算取模示意</span>
      </div>

      <div className="space-y-4 p-4">

        {/* struct fields */}
        <div className="rounded bg-[var(--c-surface0)] px-4 py-3 leading-loose">
          <div className="mb-1 text-[9px] uppercase tracking-widest text-[var(--c-overlay0)]">STRUCT FIELDS</div>
          {[
            { field: 'ringSize', type: 'uint32', val: `${SIZE}`, note: '必须为 2 的幂',        color: 'text-[var(--c-peach)]'  },
            { field: 'readPos ', type: 'uint32', val: `${readPos}`, note: `逻辑指针 → idx ${rA}`, color: 'text-[var(--c-blue)]'   },
            { field: 'writePos', type: 'uint32', val: `${writePos}`, note: `逻辑指针 → idx ${wA}`, color: 'text-[var(--c-mauve)]'  },
          ].map(({ field, type, val, note, color }) => (
            <div key={field} className="flex items-baseline gap-2">
              <span className="w-16 text-[var(--c-overlay0)]">{field}</span>
              <span className="w-14 text-[var(--c-green)]">{type}</span>
              <span className={`w-6 font-bold ${color}`}>{val}</span>
              <span className="text-[9px] text-[var(--c-overlay0)]">// {note}</span>
            </div>
          ))}
        </div>

        {/* buffer cells */}
        <div className="flex justify-center gap-1">
          {cells.map((hasData, i) => {
            const isR = i === rA
            const isW = i === wA
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="h-3 text-[9px] font-bold text-[var(--c-blue)]">{isR ? 'r' : ''}</span>
                <div className={[
                  'flex h-8 w-11 items-center justify-center rounded text-sm',
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

        {/* bit operation */}
        <div className="rounded bg-[var(--c-crust)] px-4 py-3 leading-loose text-[var(--c-subtext0)]">
          <div className="mb-1 text-[9px] uppercase tracking-widest text-[var(--c-overlay0)]">位运算取模</div>
          <div>
            <span className="text-[var(--c-blue)]">readPos</span>
            {` = ${readPos}  →  ${readPos} & (${SIZE}−1) = ${readPos} & ${MASK} = `}
            <span className="font-bold text-[var(--c-blue)]">{rA}</span>
          </div>
          <div>
            <span className="text-[var(--c-mauve)]">writePos</span>
            {` = ${writePos}  →  ${writePos} & (${SIZE}−1) = ${writePos} & ${MASK} = `}
            <span className="font-bold text-[var(--c-mauve)]">{wA}</span>
            <span className="text-[var(--c-green)]">  ← 自然环绕，无 copy</span>
          </div>
          <div className="text-[var(--c-overlay0)]">
            {`avail = writePos − readPos = ${writePos} − ${readPos} = ${writePos - readPos}`}
          </div>
        </div>

      </div>
    </div>
  )
}
