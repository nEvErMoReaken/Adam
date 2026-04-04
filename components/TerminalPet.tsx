'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLang } from '@/lib/i18n'

// ── 数据 ─────────────────────────────────────────────────────────────

const EYES = ['·', '✦', '×', '◉', '@', '°']

const RARITY_COLOR: Record<string, string> = {
  common:    '#9ca3af',
  uncommon:  '#4ade80',
  rare:      '#60a5fa',
  epic:      '#c084fc',
  legendary: '#fbbf24',
}
const RARITY_STARS: Record<string, string> = {
  common: '★', uncommon: '★★', rare: '★★★', epic: '★★★★', legendary: '★★★★★',
}
const RARITY_ZH: Record<string, string> = {
  common: '普通', uncommon: '稀有', rare: '精良', epic: '史诗', legendary: '传说',
}

const RARITY_WEIGHT = [
  { name: 'legendary', w: 1 },
  { name: 'epic',      w: 4 },
  { name: 'rare',      w: 10 },
  { name: 'uncommon',  w: 25 },
  { name: 'common',    w: 60 },
]

const HAT_TOPS: Record<string, string> = {
  none:      '',
  crown:     '   \\^^^/    ',
  tophat:    '   [___]    ',
  propeller: '    -+-     ',
  halo:      '   (   )    ',
  wizard:    '    /^\\     ',
  beanie:    '   (___)    ',
  tinyduck:  '    ,>      ',
}
const HAT_ZH: Record<string, string> = {
  none:'无', crown:'王冠', tophat:'大礼帽', propeller:'螺旋帽',
  halo:'光环', wizard:'巫师帽', beanie:'毛线帽', tinyduck:'小鸭帽',
}
const HATS = Object.keys(HAT_TOPS)

const STAT_NAMES = ['DEBUGGING', 'PATIENCE', 'CHAOS', 'WISDOM', 'SNARK'] as const
const STAT_ZH: Record<string, string> = {
  DEBUGGING: '调试', PATIENCE: '耐心', CHAOS: '混沌', WISDOM: '智慧', SNARK: '毒舌',
}
const STAT_COLORS: Record<string, string> = {
  DEBUGGING: '#e06c60',
  PATIENCE:  '#58a6ff',
  CHAOS:     '#af87ff',
  WISDOM:    '#ffc107',
  SNARK:     '#4eba65',
}

function spriteFrames(...rawFrames: string[]): string[][] {
  return rawFrames.map((f) => f.split('¦').map((l) => l.trimEnd()))
}

const SPECIES_ASCII: Record<string, string[][]> = {
  duck: spriteFrames(
    '            ¦    __      ¦  <({E} )___  ¦   (  ._>   ¦    `--´    ',
    '            ¦    __      ¦  <({E} )___  ¦   (  ._>   ¦    `--´~   ',
    '            ¦    __      ¦  <({E} )___  ¦   (  .__>  ¦    `--´    ',
  ),
  goose: spriteFrames(
    '            ¦     ({E}>    ¦     ||     ¦   _(__)_   ¦    ^^^^    ',
    '            ¦    ({E}>     ¦     ||     ¦   _(__)_   ¦    ^^^^    ',
    '            ¦     ({E}>>   ¦     ||     ¦   _(__)_   ¦    ^^^^    ',
  ),
  blob: spriteFrames(
    '            ¦   .----.   ¦  ( {E}  {E} )  ¦  (      )  ¦   `----´   ',
    '            ¦  .------.  ¦ (  {E}  {E}  ) ¦ (        ) ¦  `------´  ',
    '            ¦    .--.    ¦   ({E}  {E})   ¦   (    )   ¦    `--´    ',
  ),
  cat: spriteFrames(
    '            ¦   /\\_/\\    ¦  ( {E}   {E})  ¦  (  ω  )   ¦  (")_(")   ',
    '            ¦   /\\_/\\    ¦  ( {E}   {E})  ¦  (  ω  )   ¦  (")_(")~  ',
    '            ¦   /\\-/\\    ¦  ( {E}   {E})  ¦  (  ω  )   ¦  (")_(")   ',
  ),
  dragon: spriteFrames(
    '            ¦  /^\\  /^\\  ¦ <  {E}  {E}  > ¦ (   ~~   ) ¦  `-vvvv-´  ',
    '            ¦  /^\\  /^\\  ¦ <  {E}  {E}  > ¦ (        ) ¦  `-vvvv-´  ',
    '   ~    ~   ¦  /^\\  /^\\  ¦ <  {E}  {E}  > ¦ (   ~~   ) ¦  `-vvvv-´  ',
  ),
  octopus: spriteFrames(
    '            ¦   .----.   ¦  ( {E}  {E} )  ¦  (______)  ¦  /\\/\\/\\/\\  ',
    '            ¦   .----.   ¦  ( {E}  {E} )  ¦  (______)  ¦  \\/\\/\\/\\/  ',
    '     o      ¦   .----.   ¦  ( {E}  {E} )  ¦  (______)  ¦  /\\/\\/\\/\\  ',
  ),
  owl: spriteFrames(
    '            ¦   /\\  /\\   ¦  (({E})({E}))  ¦  (  ><  )  ¦   `----´   ',
    '            ¦   /\\  /\\   ¦  (({E})({E}))  ¦  (  ><  )  ¦   .----.   ',
    '            ¦   /\\  /\\   ¦  (({E})(- ))  ¦  (  ><  )  ¦   `----´   ',
  ),
  penguin: spriteFrames(
    '            ¦  .---.     ¦  ({E}>{E})     ¦ /(   )\\    ¦  `---´     ',
    '            ¦  .---.     ¦  ({E}>{E})     ¦ |(   )|    ¦  `---´     ',
    '  .---.     ¦  ({E}>{E})     ¦ /(   )\\    ¦  `---´     ¦   ~ ~      ',
  ),
  turtle: spriteFrames(
    '            ¦   _,--._   ¦  ( {E}  {E} )  ¦ /[______]\\ ¦  ``    ``  ',
    '            ¦   _,--._   ¦  ( {E}  {E} )  ¦ /[______]\\ ¦   ``  ``   ',
    '            ¦   _,--._   ¦  ( {E}  {E} )  ¦ /[======]\\ ¦  ``    ``  ',
  ),
  snail: spriteFrames(
    '            ¦ {E}    .--.  ¦  \\  ( @ )  ¦   \\_`--´   ¦  ~~~~~~~   ',
    '            ¦  {E}   .--.  ¦  |  ( @ )  ¦   \\_`--´   ¦  ~~~~~~~   ',
    '            ¦ {E}    .--.  ¦  \\  ( @  ) ¦   \\_`--´   ¦   ~~~~~~   ',
  ),
  ghost: spriteFrames(
    '            ¦   .----.   ¦  / {E}  {E} \\  ¦  |      |  ¦  ~`~``~`~  ',
    '            ¦   .----.   ¦  / {E}  {E} \\  ¦  |      |  ¦  `~`~~`~`  ',
    '    ~  ~    ¦   .----.   ¦  / {E}  {E} \\  ¦  |      |  ¦  ~~`~~`~~  ',
  ),
  axolotl: spriteFrames(
    '            ¦}~(______)~{¦}~({E} .. {E})~{¦  ( .--. )  ¦  (_/  \\_)  ',
    '            ¦~}(______){~¦~}({E} .. {E}){~¦  ( .--. )  ¦  (_/  \\_)  ',
    '            ¦}~(______)~{¦}~({E} .. {E})~{¦  (  --  )  ¦  ~_/  \\_~  ',
  ),
  capybara: spriteFrames(
    '            ¦  n______n  ¦ ( {E}    {E} ) ¦ (   oo   ) ¦  `------´  ',
    '            ¦  n______n  ¦ ( {E}    {E} ) ¦ (   Oo   ) ¦  `------´  ',
    '    ~  ~    ¦  u______n  ¦ ( {E}    {E} ) ¦ (   oo   ) ¦  `------´  ',
  ),
  cactus: spriteFrames(
    '            ¦ n  ____  n ¦ | |{E}  {E}| | ¦ |_|    |_| ¦   |    |   ',
    '            ¦    ____    ¦ n |{E}  {E}| n ¦ |_|    |_| ¦   |    |   ',
    ' n        n ¦ |  ____  | ¦ | |{E}  {E}| | ¦ |_|    |_| ¦   |    |   ',
  ),
  robot: spriteFrames(
    '            ¦   .[||].   ¦  [ {E}  {E} ]  ¦  [ ==== ]  ¦  `------´  ',
    '            ¦   .[||].   ¦  [ {E}  {E} ]  ¦  [ -==- ]  ¦  `------´  ',
    '     *      ¦   .[||].   ¦  [ {E}  {E} ]  ¦  [ ==== ]  ¦  `------´  ',
  ),
  rabbit: spriteFrames(
    '            ¦   (\\__/)   ¦  ( {E}  {E} )  ¦ =(  ..  )= ¦  (")__(")  ',
    '            ¦   (|__/)   ¦  ( {E}  {E} )  ¦ =(  ..  )= ¦  (")__(")  ',
    '            ¦   (\\__/)   ¦  ( {E}  {E} )  ¦ =( .  . )= ¦  (")__(")  ',
  ),
  mushroom: spriteFrames(
    '            ¦ .-o-OO-o-. ¦(__________)¦   |{E}  {E}|   ¦   |____|   ',
    '            ¦ .-O-oo-O-. ¦(__________)¦   |{E}  {E}|   ¦   |____|   ',
    '   . o  .   ¦ .-o-OO-o-. ¦(__________)¦   |{E}  {E}|   ¦   |____|   ',
  ),
  chonk: spriteFrames(
    '            ¦  /\\    /\\  ¦ ( {E}    {E} ) ¦ (   ..   ) ¦  `------´  ',
    '            ¦  /\\    /|  ¦ ( {E}    {E} ) ¦ (   ..   ) ¦  `------´  ',
    '            ¦  /\\    /\\  ¦ ( {E}    {E} ) ¦ (   ..   ) ¦  `------´~ ',
  ),
}

const SPECIES_NAMES: Record<string, string> = {
  duck:'鸭子', goose:'鹅', blob:'团子', cat:'猫', dragon:'龙', octopus:'章鱼',
  owl:'猫头鹰', penguin:'企鹅', turtle:'乌龟', snail:'蜗牛', ghost:'幽灵',
  axolotl:'美西螈', capybara:'水豚', cactus:'仙人掌', robot:'机器人',
  rabbit:'兔子', mushroom:'蘑菇', chonk:'胖团子',
}

const IDLE_SEQUENCE = [0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 2, 0, 0, 0]
const SPECIES_LIST  = Object.keys(SPECIES_ASCII)

const QUOTES = [
  '> hello world', '编译中...', 'git commit -m "."', '404: 灵感未找到',
  '> sudo !!', 'rm -rf bugs/', '再来一杯咖啡', '一切都是 0 和 1',
  '> sleep(Infinity)', '嗨！', 'TODO: 睡觉', '> npm install',
]

// ── 孵化动画帧（蛋 → 破壳）─────────────────────────────────────────

const EGG_FRAMES = [
  // 静止的蛋
  [
    '   _..._  ',
    '  /     \\ ',
    ' |       |',
    '  \\_____/ ',
  ],
  // 轻微摇晃
  [
    '   _..._  ',
    '  /     \\ ',
    ' |       |',
    '  \\_____/ ',
    '    ~~~   ',
  ],
  // 裂缝出现
  [
    '   _..._  ',
    '  / * * \\ ',
    ' |  ***  |',
    '  \\_____/ ',
  ],
  // 更多裂缝
  [
    '  _.*.*._  ',
    ' /*  *  *\\ ',
    '|* * * * *|',
    ' \\*_____*/ ',
  ],
  // 顶部破开
  [
    '  * * * *  ',
    '  _/   \\_ ',
    ' /* * * *\\ ',
    '  \\_____/  ',
  ],
  // 完全破壳（空，切换到宠物）
  [
    ' * * * * * ',
    '   \\   /   ',
    '  * * * *  ',
  ],
]

// ── 生成 ──────────────────────────────────────────────────────────────

function pickRarity() {
  const roll = Math.random() * 100
  let acc = 0
  for (const { name, w } of RARITY_WEIGHT) {
    acc += w
    if (roll < acc) return name
  }
  return 'common'
}

function generateStats(rarity: string) {
  const floor = { common: 5, uncommon: 15, rare: 25, epic: 35, legendary: 50 }[rarity] ?? 5
  const shuffled = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5)
  const peak = shuffled[0], dump = shuffled[1]
  return Object.fromEntries(
    STAT_NAMES.map((s, i) => {
      let v: number
      if (i === peak)      v = Math.min(100, floor + 50 + Math.floor(Math.random() * 30))
      else if (i === dump) v = Math.max(1, floor - 10 + Math.floor(Math.random() * 14))
      else                 v = floor + Math.floor(Math.random() * 40)
      return [s, v]
    })
  ) as Record<string, number>
}

function generateBuddy() {
  const rarity  = pickRarity()
  const shiny   = Math.random() < 0.01
  const species = SPECIES_LIST[Math.floor(Math.random() * SPECIES_LIST.length)]
  const eye     = EYES[Math.floor(Math.random() * EYES.length)]
  const hat     = rarity === 'common' ? 'none' : HATS[Math.floor(Math.random() * HATS.length)]
  const stats   = generateStats(rarity)
  const name    = `${SPECIES_NAMES[species]}-${Math.floor(Math.random() * 9000 + 1000)}`
  return { rarity, shiny, species, eye, hat, stats, name }
}

type Buddy = ReturnType<typeof generateBuddy>

// ── Stat Card ─────────────────────────────────────────────────────────

function StatBar({ value }: { value: number }) {
  const filled = Math.round(value / 10)
  return <span style={{ letterSpacing: 1 }}>{'█'.repeat(filled)}{'░'.repeat(10 - filled)}</span>
}

function StatCard({ buddy, dir, anchorX, anchorY }: {
  buddy: Buddy; dir: 'right' | 'left'
  anchorX: number; anchorY: number
}) {
  const { lang } = useLang()
  const color = RARITY_COLOR[buddy.rarity]
  const isZh  = lang === 'zh'
  const cardW = 210
  // card 左边：朝右时对齐宠物左边，朝左时右对齐
  const left  = dir === 'right'
    ? Math.min(anchorX, window.innerWidth - cardW - 8)
    : Math.max(8, anchorX - cardW + 80)

  return (
    <div style={{
      position: 'fixed',
      left: left,
      bottom: window.innerHeight - anchorY + 6,
      width: cardW,
      background: 'var(--c-mantle)',
      border: `1px solid ${color}`,
      borderRadius: 3,
      padding: '8px 10px',
      fontFamily: 'var(--font-jetbrains-mono), monospace',
      fontSize: 11,
      color: 'var(--c-text)',
      animation: 'petpop .15s ease-out',
      zIndex: 50,
      boxShadow: `0 0 12px ${color}33`,
    }}>
      {/* 名字 + 星级 */}
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, paddingBottom:4, borderBottom:'1px solid var(--c-split)' }}>
        <span style={{ color, fontWeight:'bold' }}>{buddy.shiny ? '✦ ' : ''}{buddy.name}</span>
        <span style={{ color }}>{RARITY_STARS[buddy.rarity]}</span>
      </div>

      {/* 描述行 */}
      <div style={{ color:'var(--c-subtext0)', marginBottom:6, fontSize:10 }}>
        {isZh
          ? `${RARITY_ZH[buddy.rarity]} ${SPECIES_NAMES[buddy.species]}${buddy.hat !== 'none' ? ` · ${HAT_ZH[buddy.hat]}` : ''}${buddy.shiny ? ' · 闪光' : ''}`
          : `${buddy.rarity} ${buddy.species}${buddy.hat !== 'none' ? ` · ${buddy.hat}` : ''}${buddy.shiny ? ' · shiny' : ''}`
        }
      </div>

      {/* Stats */}
      {STAT_NAMES.map(s => (
        <div key={s} style={{ display:'flex', justifyContent:'space-between', gap:6, marginBottom:2 }}>
          <span style={{ color: STAT_COLORS[s], minWidth: isZh ? 36 : 72, fontSize: isZh ? 11 : 10 }}>
            {isZh ? STAT_ZH[s] : s}
          </span>
          <span style={{ color: STAT_COLORS[s] }}><StatBar value={buddy.stats[s]} /></span>
        </div>
      ))}

      {/* 孵化按钮 */}
      <div style={{ display:'flex', marginTop:6, paddingTop:5, borderTop:'1px solid var(--c-split)' }}>
        <button
          id="hatch-btn"
          style={{
            background:'none', border:`1px solid ${color}`, color, borderRadius:2,
            padding:'1px 6px', fontSize:10, cursor:'pointer', fontFamily:'inherit',
          }}
          onMouseDown={(e) => { e.stopPropagation(); document.getElementById('hatch-trigger')?.click() }}
        >
          {isZh ? '重新孵化' : 'reroll'}
        </button>
      </div>
    </div>
  )
}

// ── 主组件 ────────────────────────────────────────────────────────────

const WALK_SPEED = 0.8

export default function WalkingPet() {
  const [buddy,   setBuddy]   = useState<Buddy | null>(null)
  const [seqIdx,  setSeqIdx]  = useState(0)
  const [xPx,     setXPx]     = useState(120)
  const [dir,     setDir]     = useState<'right' | 'left'>('right')
  const [quote,   setQuote]   = useState<string | null>(null)
  const [hovered, setHovered] = useState(false)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [footerTop, setFooterTop] = useState<number | null>(null)

  // 孵化状态：初始就是 hatching
  const [hatchPhase, setHatchPhase] = useState<'idle' | 'hatching' | 'born'>('hatching')
  const [eggFrame,   setEggFrame]   = useState(0)
  const pendingBuddy = useRef<Buddy | null>(null)

  const xRef    = useRef(120)
  const dirRef  = useRef<1 | -1>(1)
  const maxXRef = useRef(typeof window !== 'undefined' ? window.innerWidth - 130 : 1000)

  // footer 位置追踪
  useEffect(() => {
    const update = () => {
      const footer = document.querySelector('footer')
      if (footer) setFooterTop(footer.getBoundingClientRect().top)
      maxXRef.current = window.innerWidth - 130
    }
    update()
    window.addEventListener('resize', update)
    const obs = new ResizeObserver(update)
    const footer = document.querySelector('footer')
    if (footer) obs.observe(footer)
    return () => { window.removeEventListener('resize', update); obs.disconnect() }
  }, [])

  // 行走主循环（孵化中暂停）
  useEffect(() => {
    if (hatchPhase !== 'idle') return
    const loop = setInterval(() => {
      xRef.current += WALK_SPEED * dirRef.current
      if (xRef.current >= maxXRef.current) {
        xRef.current = maxXRef.current; dirRef.current = -1; setDir('left')
      } else if (xRef.current <= 0) {
        xRef.current = 0; dirRef.current = 1; setDir('right')
      }
      setXPx(Math.round(xRef.current))
      setSeqIdx(i => (i + 1) % IDLE_SEQUENCE.length)
    }, 150)
    return () => clearInterval(loop)
  }, [hatchPhase])

  // 孵化动画（初次 mount 自动触发）
  const startHatch = useCallback(() => {
    pendingBuddy.current = generateBuddy()
    setHatchPhase('hatching')
    setHovered(false)
    setEggFrame(0)

    const delays = [0, 400, 800, 1200, 1600, 2000]
    delays.forEach((delay, i) => {
      setTimeout(() => {
        setEggFrame(i)
        if (i === delays.length - 1) {
          setTimeout(() => {
            if (pendingBuddy.current) setBuddy(pendingBuddy.current)
            setHatchPhase('born')
            setTimeout(() => setHatchPhase('idle'), 600)
          }, 400)
        }
      }, delay)
    })
  }, [])

  // 页面加载后延迟一点再开始孵化（等 footer 位置稳定）
  useEffect(() => {
    const t = setTimeout(startHatch, 300)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 说话
  useEffect(() => {
    const schedule = (): ReturnType<typeof setTimeout> =>
      setTimeout(() => {
        if (hatchPhase === 'idle') setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
        setTimeout(() => setQuote(null), 2800)
        timer = schedule()
      }, 7000 + Math.random() * 10000)
    let timer = schedule()
    return () => clearTimeout(timer)
  }, [hatchPhase])

  // 渲染帧（buddy 为 null 时用占位）
  const frameIdx   = IDLE_SEQUENCE[seqIdx]
  const isBlinking = frameIdx === -1
  const frames     = buddy ? SPECIES_ASCII[buddy.species] : null
  const rawRows    = frames ? (frames[isBlinking ? 0 : frameIdx] ?? frames[0]) : []
  const eye        = isBlinking ? '-' : (buddy?.eye ?? '·')
  const rows       = rawRows.map(l => l.replaceAll('{E}', eye))
  const displayRows = [...rows]
  if (buddy?.hat && buddy.hat !== 'none' && HAT_TOPS[buddy.hat]) {
    if (!displayRows[0]?.trim()) displayRows[0] = HAT_TOPS[buddy.hat]
    else displayRows.unshift(HAT_TOPS[buddy.hat])
  }

  const color = buddy ? RARITY_COLOR[buddy.rarity] : '#9ca3af'
  const glow  = buddy?.shiny ? `0 0 12px ${color}99, 0 0 24px ${color}44` : `0 0 6px ${color}33`
  const topPx = footerTop != null ? footerTop - 84 : null

  return (
    <>
      {/* 隐藏触发器 */}
      <button id="hatch-trigger" style={{ display:'none' }} onClick={startHatch} />

      {/* footer 位置未就绪前不渲染任何可见元素 */}
      {topPx != null && (<>
      {/* Stat Card：fixed 定位，独立于宠物容器，用相同的 leaveTimer 保持 hover */}
      {hovered && hatchPhase === 'idle' && buddy && (
        <div
          style={{ position:'fixed', zIndex:46, pointerEvents:'auto' }}
          onMouseEnter={() => { if (leaveTimer.current) clearTimeout(leaveTimer.current); setHovered(true) }}
          onMouseLeave={() => { leaveTimer.current = setTimeout(() => setHovered(false), 80) }}
        >
          <StatCard buddy={buddy} dir={dir} anchorX={xPx} anchorY={topPx} />
        </div>
      )}

      <div
        style={{
          position: 'fixed',
          left: xPx,
          top: topPx,
          zIndex: 45,
          userSelect: 'none',
          pointerEvents: 'auto',
          cursor: 'default',
        }}
        onMouseEnter={() => {
          if (leaveTimer.current) clearTimeout(leaveTimer.current)
          setHovered(true)
        }}
        onMouseLeave={() => {
          leaveTimer.current = setTimeout(() => setHovered(false), 80)
        }}
      >
        {/* 说话气泡 */}
        {quote && !hovered && hatchPhase === 'idle' && (
          <div style={{
            position: 'absolute', bottom: '108%',
            left: dir === 'right' ? 0 : 'auto',
            right: dir === 'left' ? 0 : 'auto',
            whiteSpace: 'nowrap',
            background: 'var(--c-mantle)',
            border: '1px solid var(--c-split)',
            borderRadius: 3, padding: '2px 8px',
            fontSize: 11, fontFamily: 'var(--font-jetbrains-mono), monospace',
            color: 'var(--c-text)', animation: 'petpop .15s ease-out',
            pointerEvents: 'none',
          }}>
            {quote}
            <span style={{
              position:'absolute', bottom:-6,
              left: dir === 'right' ? 10 : 'auto',
              right: dir === 'left' ? 10 : 'auto',
              width:0, height:0,
              borderLeft:'5px solid transparent',
              borderRight:'5px solid transparent',
              borderTop:'6px solid var(--c-split)',
            }} />
          </div>
        )}

        {/* 孵化中：显示蛋动画 */}
        {hatchPhase === 'hatching' && (
          <pre style={{
            margin: 0, fontSize: 12, lineHeight: 1.4,
            fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
            color: RARITY_COLOR[pendingBuddy.current?.rarity ?? 'common'],
            textShadow: `0 0 8px ${RARITY_COLOR[pendingBuddy.current?.rarity ?? 'common']}66`,
            animation: eggFrame === 1 ? 'eggrattle 0.3s ease-in-out' : undefined,
            pointerEvents: 'none',
          }}>
            {EGG_FRAMES[eggFrame].join('\n')}
          </pre>
        )}

        {/* 正常行走 */}
        {hatchPhase !== 'hatching' && (
          <pre style={{
            margin: 0, fontSize: 12, lineHeight: 1.4,
            fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
            color,
            textShadow: glow,
            transform: dir === 'left' ? 'scaleX(-1)' : 'none',
            animation: hatchPhase === 'born'
              ? 'bornpop 0.5s ease-out'
              : buddy.shiny ? 'petshine 2s ease-in-out infinite' : undefined,
            pointerEvents: 'none',
          }}>
            {displayRows.join('\n')}
          </pre>
        )}

        <style>{`
          @keyframes petpop {
            from { opacity:0; transform:scale(.85) translateY(3px); }
            to   { opacity:1; transform:scale(1) translateY(0); }
          }
          @keyframes petshine {
            0%,100% { opacity:1; }
            50%      { opacity:.75; }
          }
          @keyframes eggrattle {
            0%,100% { transform: rotate(0deg); }
            25%      { transform: rotate(-8deg); }
            75%      { transform: rotate(8deg); }
          }
          @keyframes bornpop {
            0%   { opacity:0; transform: scale(0.3); }
            60%  { transform: scale(1.2); }
            100% { opacity:1; transform: scale(1); }
          }
        `}</style>
      </div>
      </>)}
    </>
  )
}
