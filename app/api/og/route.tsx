import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const MOCHA = {
  base: '#1e1e2e',
  surface0: '#313244',
  text: '#cdd6f4',
  subtext0: '#a6adc8',
  blue: '#89b4fa',
  mauve: '#cba6f7',
  green: '#a6e3a1',
  overlay0: '#6c7086',
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? "Jimmy's Blog"
  const date = searchParams.get('date') ?? ''
  const readingTime = searchParams.get('readingTime') ?? ''
  const tagsRaw = searchParams.get('tags') ?? ''
  const tags = tagsRaw ? tagsRaw.split(',').filter(Boolean).slice(0, 4) : []

  const slug = `~/blog/${title.toLowerCase().replace(/\s+/g, '-').slice(0, 40)}`
  const meta = [date, readingTime].filter(Boolean).join('  ·  ')

  return new ImageResponse(
    <div
      style={{
        width: '1200px',
        height: '630px',
        backgroundColor: MOCHA.base,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'monospace',
        padding: '60px',
        position: 'relative',
      }}
    >
      {/* 顶部蓝色装饰线 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: MOCHA.blue,
          display: 'flex',
        }}
      />

      {/* 窗口标题栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#f38ba8',
            display: 'flex',
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#f9e2af',
            display: 'flex',
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: MOCHA.green,
            display: 'flex',
          }}
        />
        <div
          style={{ marginLeft: '12px', color: MOCHA.overlay0, fontSize: '13px', display: 'flex' }}
        >
          {slug}
        </div>
      </div>

      {/* 主体内容 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            color: MOCHA.subtext0,
            fontSize: '15px',
            marginBottom: '16px',
            letterSpacing: '0.15em',
            display: 'flex',
          }}
        >
          {'$ cat article.md'}
        </div>

        <div
          style={{
            color: MOCHA.text,
            fontSize: title.length > 30 ? '42px' : '52px',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '32px',
            maxWidth: '900px',
            display: 'flex',
          }}
        >
          {title}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  backgroundColor: MOCHA.surface0,
                  color: MOCHA.mauve,
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  border: `1px solid ${MOCHA.mauve}40`,
                  display: 'flex',
                }}
              >
                {`#${tag}`}
              </div>
            ))}
          </div>
        )}

        {/* 元信息 */}
        {meta && (
          <div style={{ display: 'flex', color: MOCHA.subtext0, fontSize: '15px' }}>{meta}</div>
        )}
      </div>

      {/* 底部 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `1px solid ${MOCHA.surface0}`,
          paddingTop: '24px',
        }}
      >
        <div style={{ color: MOCHA.subtext0, fontSize: '14px', display: 'flex' }}>
          {'sleeprhino.com'}
        </div>
        <div style={{ color: MOCHA.blue, fontSize: '14px', display: 'flex' }}>{'Jimmy'}</div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
