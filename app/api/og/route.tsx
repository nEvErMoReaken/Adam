import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const MOCHA = {
  base: '#1e1e2e',
  mantle: '#181825',
  surface0: '#313244',
  text: '#cdd6f4',
  subtext0: '#a6adc8',
  blue: '#89b4fa',
  mauve: '#cba6f7',
  green: '#a6e3a1',
  peach: '#fab387',
  overlay0: '#6c7086',
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? "Jimmy's Blog"
  const date = searchParams.get('date') ?? ''
  const readingTime = searchParams.get('readingTime') ?? ''
  const tagsRaw = searchParams.get('tags') ?? ''
  const tags = tagsRaw ? tagsRaw.split(',').filter(Boolean).slice(0, 4) : []

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
      {/* 顶部装饰线 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: MOCHA.blue,
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
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f38ba8' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f9e2af' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: MOCHA.green }} />
        <div
          style={{
            marginLeft: '12px',
            color: MOCHA.overlay0,
            fontSize: '13px',
          }}
        >
          ~/blog/{title.toLowerCase().replace(/\s+/g, '-').slice(0, 40)}
        </div>
      </div>

      {/* 主标题 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: MOCHA.subtext0,
            fontSize: '15px',
            marginBottom: '16px',
            letterSpacing: '0.15em',
          }}
        >
          $ cat article.md
        </div>

        <div
          style={{
            color: MOCHA.text,
            fontSize: title.length > 30 ? '42px' : '52px',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '32px',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
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
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        )}

        {/* 元信息 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            color: MOCHA.subtext0,
            fontSize: '15px',
          }}
        >
          {date && <span>{date}</span>}
          {readingTime && (
            <>
              <span style={{ color: MOCHA.overlay0 }}>·</span>
              <span>{readingTime}</span>
            </>
          )}
        </div>
      </div>

      {/* 底部作者信息 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `1px solid ${MOCHA.surface0}`,
          paddingTop: '24px',
        }}
      >
        <div style={{ color: MOCHA.subtext0, fontSize: '14px' }}>sleeprhino.com</div>
        <div
          style={{
            color: MOCHA.blue,
            fontSize: '14px',
            letterSpacing: '0.05em',
          }}
        >
          Jimmy
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  )
}
