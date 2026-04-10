export default function GoGateBufferViz() {
  const SIZE = 8
  const MASK = SIZE - 1
  const readPos = 3
  const writePos = 9
  const rA = readPos & MASK   // 3
  const wA = writePos & MASK  // 1

  const cells = Array.from({ length: SIZE }, (_, i) => {
    const avail = writePos - readPos // 6
    if (rA < wA) return i >= rA && i < wA
    return i >= rA || i < wA
  })

  return (
    <div style={{
      margin: '1.5rem 0',
      background: 'var(--c-base)',
      border: '1px solid var(--c-split)',
      borderRadius: '6px',
      overflow: 'hidden',
      fontFamily: 'monospace',
      fontSize: '11px',
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
          GoGate RingBuffer — 位运算取模示意
        </span>
      </div>

      <div style={{ padding: '16px' }}>

        {/* struct fields */}
        <div style={{
          padding: '10px 14px',
          background: 'var(--c-surface0)',
          borderRadius: '4px',
          marginBottom: '16px',
          lineHeight: '1.8',
        }}>
          <div style={{ color: 'var(--c-overlay0)', fontSize: '9px', letterSpacing: '1px', marginBottom: '4px' }}>STRUCT FIELDS</div>
          {[
            { field: 'ringSize', type: 'uint32', val: `${SIZE}`, note: '2 的幂', color: 'var(--c-peach)' },
            { field: 'readPos ', type: 'uint32', val: `${readPos}`, note: `逻辑指针 → idx ${rA}`, color: 'var(--c-blue)' },
            { field: 'writePos', type: 'uint32', val: `${writePos}`, note: `逻辑指针 → idx ${wA}`, color: 'var(--c-mauve)' },
          ].map(({ field, type, val, note, color }) => (
            <div key={field} style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--c-overlay0)', width: '70px' }}>{field}</span>
              <span style={{ color: 'var(--c-green)', width: '56px' }}>{type}</span>
              <span style={{ color, fontWeight: 'bold', width: '24px' }}>{val}</span>
              <span style={{ color: 'var(--c-overlay0)', fontSize: '10px' }}>// {note}</span>
            </div>
          ))}
        </div>

        {/* buffer cells */}
        <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginBottom: '8px' }}>
          {cells.map((hasData, i) => {
            const isR = i === rA
            const isW = i === wA
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isR && <span style={{ fontSize: '9px', color: 'var(--c-blue)', fontWeight: 'bold' }}>r</span>}
                </div>
                <div style={{
                  width: 48,
                  height: 34,
                  borderRadius: '3px',
                  border: `1px solid ${isR ? 'var(--c-blue)' : isW ? 'var(--c-mauve)' : hasData ? 'color-mix(in srgb, var(--c-blue) 50%, transparent)' : 'var(--c-surface1)'}`,
                  background: hasData
                    ? 'color-mix(in srgb, var(--c-blue) 25%, var(--c-surface0))'
                    : 'var(--c-surface0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  color: hasData ? 'var(--c-blue)' : 'var(--c-surface1)',
                }}>
                  {hasData ? '█' : '░'}
                </div>
                <div style={{ height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isW && <span style={{ fontSize: '9px', color: 'var(--c-mauve)', fontWeight: 'bold' }}>w</span>}
                </div>
                <div style={{ fontSize: '9px', color: 'var(--c-overlay0)' }}>[{i}]</div>
              </div>
            )
          })}
        </div>

        {/* bit operation */}
        <div style={{
          marginTop: '14px',
          padding: '10px 14px',
          background: 'var(--c-crust)',
          borderRadius: '4px',
          lineHeight: '1.9',
          color: 'var(--c-subtext0)',
          fontSize: '10px',
        }}>
          <div style={{ color: 'var(--c-overlay0)', fontSize: '9px', letterSpacing: '1px', marginBottom: '4px' }}>位运算取模</div>
          <div>
            <span style={{ color: 'var(--c-blue)' }}>readPos</span>
            {` = ${readPos}  →  ${readPos} & (${SIZE}-1) = ${readPos} & ${MASK} = `}
            <span style={{ color: 'var(--c-blue)', fontWeight: 'bold' }}>{rA}</span>
          </div>
          <div>
            <span style={{ color: 'var(--c-mauve)' }}>writePos</span>
            {` = ${writePos}  →  ${writePos} & (${SIZE}-1) = ${writePos} & ${MASK} = `}
            <span style={{ color: 'var(--c-mauve)', fontWeight: 'bold' }}>{wA}</span>
            <span style={{ color: 'var(--c-green)' }}> ← 自然环绕，无 copy</span>
          </div>
          <div style={{ marginTop: '4px', color: 'var(--c-overlay0)' }}>
            {`avail = writePos - readPos = ${writePos} - ${readPos} = ${writePos - readPos}`}
          </div>
        </div>

      </div>
    </div>
  )
}
