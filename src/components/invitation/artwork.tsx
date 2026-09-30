import type { Frame, Ornament, Pattern } from '@/lib/invitation/theme'

/* -------------------------------------------------------------------------- */
/* Dividers                                                                    */
/* -------------------------------------------------------------------------- */

const MIRROR = 'translate(240 0) scale(-1 1)'

function Mirrored({ children }: { children: React.ReactNode }) {
  return (
    <>
      <g>{children}</g>
      <g transform={MIRROR}>{children}</g>
    </>
  )
}

export function Divider({ kind, className, style }: { kind: Ornament; className?: string; style?: React.CSSProperties }) {
  if (kind === 'none') return null
  return (
    <svg
      viewBox="0 0 240 24"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === 'line' && (
        <>
          <path d="M64 12H108M132 12H176" />
          <circle cx="120" cy="12" r="2.2" fill="currentColor" stroke="none" />
        </>
      )}

      {kind === 'flourish' && (
        <>
          <Mirrored>
            <path d="M111 12c-7 0-10.5-5-17-5-5.5 0-7.5 5-4 7.8 2.6 2 6.3.4 5.6-2.6" />
            <path d="M94 7c-13 0-22 9-36 9-11 0-17-4-34-4" />
            <circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none" />
          </Mirrored>
          <path d="M120 5.5 125.5 12 120 18.5 114.5 12Z" fill="currentColor" stroke="none" />
        </>
      )}

      {kind === 'leaves' && (
        <>
          <Mirrored>
            <path d="M112 12H22" strokeWidth={1} />
            <path d="M98 12c-3.5-5.6-10.5-7.2-15.5-6.2 1.8 4 7.6 7 15.5 6.2Z" fill="currentColor" stroke="none" opacity={0.9} />
            <path d="M84 12c-3.5 5.6-10.5 7.2-15.5 6.2 1.8-4 7.6-7 15.5-6.2Z" fill="currentColor" stroke="none" opacity={0.7} />
            <path d="M68 12c-3-4.8-9-6.1-13.2-5.3 1.5 3.4 6.5 6 13.2 5.3Z" fill="currentColor" stroke="none" opacity={0.55} />
            <circle cx="40" cy="12" r="1.2" fill="currentColor" stroke="none" />
          </Mirrored>
          <circle cx="120" cy="12" r="3.2" fill="currentColor" stroke="none" />
        </>
      )}

      {kind === 'deco' && (
        <>
          <Mirrored>
            <path d="M109 12H40" />
            <path d="M105 8H64M105 16H64" strokeWidth={0.8} />
            <path d="M40 8.5v7M36 10v4" />
          </Mirrored>
          <path d="M120 3 129 12 120 21 111 12Z" />
          <path d="M120 8 124 12 120 16 116 12Z" fill="currentColor" stroke="none" />
        </>
      )}

      {kind === 'stars' && (
        <>
          <Mirrored>
            <path d="M104 12H44" strokeWidth={0.9} opacity={0.7} />
            <path d="M88 7.5 89.2 10.8 92.5 12 89.2 13.2 88 16.5 86.8 13.2 83.5 12 86.8 10.8Z" fill="currentColor" stroke="none" />
            <circle cx="36" cy="12" r="1.3" fill="currentColor" stroke="none" />
            <circle cx="66" cy="8" r="0.9" fill="currentColor" stroke="none" />
          </Mirrored>
          <path d="M120 1.5 122.9 9.1 130.5 12 122.9 14.9 120 22.5 117.1 14.9 109.5 12 117.1 9.1Z" fill="currentColor" stroke="none" />
        </>
      )}

      {kind === 'hearts' && (
        <>
          <Mirrored>
            <path d="M106 12H34" strokeWidth={0.9} />
            <path d="M90 14.6c-2.6-1.9-4-3.2-3.4-4.5.6-1.2 2.3-1 3.4.3 1.1-1.3 2.8-1.5 3.4-.3.6 1.3-.8 2.6-3.4 4.5Z" fill="currentColor" stroke="none" opacity={0.7} />
            <circle cx="28" cy="12" r="1.2" fill="currentColor" stroke="none" />
          </Mirrored>
          <path d="M120 20.5c-7-4.8-10.6-8.4-9-11.8 1.6-3.2 5.8-2.7 9 .9 3.2-3.6 7.4-4.1 9-.9 1.6 3.4-2 7-9 11.8Z" fill="currentColor" stroke="none" />
        </>
      )}

      {kind === 'diamond' && (
        <>
          <Mirrored>
            <path d="M108 12H48" />
            <circle cx="100" cy="12" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="42" cy="12" r="1" fill="currentColor" stroke="none" />
          </Mirrored>
          <path d="M120 4 128 12 120 20 112 12Z" />
          <circle cx="120" cy="12" r="2.2" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Frames                                                                      */
/* -------------------------------------------------------------------------- */

function DecoCorner() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="square" aria-hidden="true" className="h-full w-full">
      <path d="M4 76V4h72" />
      <path d="M11 58V11h47" strokeWidth={0.9} />
      <path d="M18 38V18h20" strokeWidth={0.9} />
      <path d="M4 30a26 26 0 0 1 26-26" strokeWidth={0.8} />
      <path d="M24 18l6-6 6 6-6 6z" fill="currentColor" stroke="none" transform="translate(-6 -0)" />
    </svg>
  )
}

const LEAF = 'M0 0c3.2-4.6 9.6-6.4 14-5.2-2.2 3.8-7.8 6.6-14 5.2Z'

function FloralCorner() {
  const leaves: [number, number, number, number][] = [
    // x, y, rotation, opacity
    [7, 62, -80, 0.9],
    [9, 50, -125, 0.75],
    [13, 40, -65, 0.9],
    [18, 31, -110, 0.75],
    [25, 23, -45, 0.9],
    [33, 17, -95, 0.75],
    [43, 12, -25, 0.9],
    [54, 9, -75, 0.7],
  ]
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" aria-hidden="true" className="h-full w-full">
      <path d="M5 76C6 44 28 12 72 6" />
      {leaves.map(([x, y, r, o], i) => (
        <path key={i} d={LEAF} transform={`translate(${x} ${y}) rotate(${r})`} fill="currentColor" stroke="none" opacity={o} />
      ))}
      <circle cx="70" cy="6.5" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="64" cy="3.5" r="1.3" fill="currentColor" stroke="none" opacity={0.7} />
      <circle cx="4" cy="70" r="1.3" fill="currentColor" stroke="none" opacity={0.7} />
    </svg>
  )
}

const CORNER_TRANSFORMS = ['', 'scaleX(-1)', 'scaleY(-1)', 'scale(-1,-1)']
const CORNER_POS = ['left-0 top-0', 'right-0 top-0', 'left-0 bottom-0', 'right-0 bottom-0']

export function FrameOverlay({ kind, color, inset = 10, radius = 0 }: { kind: Frame; color: string; inset?: number; radius?: number }) {
  if (kind === 'none') return null
  const common = 'pointer-events-none absolute z-20'
  if (kind === 'thin') {
    return <div className={common} style={{ inset, border: `1px solid ${color}`, borderRadius: Math.max(0, radius - inset / 2), opacity: 0.55 }} />
  }
  if (kind === 'double') {
    return (
      <>
        <div className={common} style={{ inset, border: `1px solid ${color}`, borderRadius: Math.max(0, radius - inset / 2), opacity: 0.7 }} />
        <div className={common} style={{ inset: inset + 5, border: `1px solid ${color}`, borderRadius: Math.max(0, radius - inset), opacity: 0.4 }} />
      </>
    )
  }
  const Corner = kind === 'deco' ? DecoCorner : FloralCorner
  const size = kind === 'deco' ? 64 : 76
  return (
    <div className={common} style={{ inset: inset - 2, color }}>
      {kind === 'deco' && <div className="absolute inset-[10px] border opacity-30" style={{ borderColor: color }} />}
      {CORNER_POS.map((pos, i) => (
        <div key={pos} className={`absolute ${pos}`} style={{ width: size, height: size, transform: CORNER_TRANSFORMS[i], opacity: 0.85 }}>
          <Corner />
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Background patterns (SVG tiles as data URIs)                                */
/* -------------------------------------------------------------------------- */

function tile(svg: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export function patternBackground(kind: Pattern, color: string): React.CSSProperties {
  const c = color
  switch (kind) {
    case 'dots':
      return { backgroundImage: tile(`<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22'><circle cx='11' cy='11' r='1.4' fill='${c}'/></svg>`) }
    case 'grid':
      return { backgroundImage: tile(`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><path d='M32 0H0V32' fill='none' stroke='${c}' stroke-width='0.6'/></svg>`) }
    case 'waves':
      return {
        backgroundImage: tile(
          `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='22'><path d='M0 11c8-7 24-7 32 0s24 7 32 0' fill='none' stroke='${c}' stroke-width='1'/></svg>`
        ),
      }
    case 'confetti':
      return {
        backgroundImage: tile(
          `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' fill='${c}'>` +
            `<rect x='12' y='18' width='8' height='3' rx='1.5' transform='rotate(35 16 19)'/>` +
            `<rect x='70' y='10' width='7' height='3' rx='1.5' transform='rotate(-20 73 11)' opacity='.6'/>` +
            `<circle cx='95' cy='48' r='2.6' opacity='.8'/>` +
            `<rect x='40' y='60' width='9' height='3' rx='1.5' transform='rotate(70 44 61)' opacity='.7'/>` +
            `<path d='M18 90l3 5 3-5' fill='none' stroke='${c}' stroke-width='1.6' stroke-linecap='round' opacity='.8'/>` +
            `<circle cx='58' cy='30' r='1.8' opacity='.5'/>` +
            `<rect x='96' y='92' width='8' height='3' rx='1.5' transform='rotate(-45 100 93)'/>` +
            `<path d='M74 100c3-3 6 3 9 0' fill='none' stroke='${c}' stroke-width='1.5' stroke-linecap='round' opacity='.6'/>` +
            `<circle cx='30' cy='50' r='1.5' opacity='.9'/>` +
            `</svg>`
        ),
      }
    case 'leaves':
      return {
        backgroundImage: tile(
          `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' fill='${c}'>` +
            `<g transform='translate(14 22) rotate(-30)'><path d='M0 0c4-6 12-8 18-6.5-3 5-10 8.4-18 6.5Z'/><path d='M0 0c6 1 12-1 18-6.5' fill='none' stroke='${c}' stroke-width='.6' opacity='.5'/></g>` +
            `<g transform='translate(50 58) rotate(150)'><path d='M0 0c4-6 12-8 18-6.5-3 5-10 8.4-18 6.5Z' opacity='.7'/></g>` +
            `<circle cx='56' cy='16' r='1.6' opacity='.6'/>` +
            `</svg>`
        ),
      }
    case 'deco':
      return {
        backgroundImage: tile(
          `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='none' stroke='${c}' stroke-width='0.8'>` +
            `<path d='M0 48a24 24 0 0 1 48 0M8 48a16 16 0 0 1 32 0M16 48a8 8 0 0 1 16 0'/>` +
            `<path d='M-24 24a24 24 0 0 1 48 0M24 24a24 24 0 0 1 48 0'/>` +
            `<path d='M24 48V40'/>` +
            `</svg>`
        ),
      }
    case 'stars':
      return {
        backgroundImage: tile(
          `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90' fill='${c}'>` +
            `<path d='M20 12l1.6 4.4L26 18l-4.4 1.6L20 24l-1.6-4.4L14 18l4.4-1.6Z'/>` +
            `<path d='M66 52l1 2.8 2.8 1-2.8 1-1 2.8-1-2.8-2.8-1 2.8-1Z' opacity='.8'/>` +
            `<circle cx='48' cy='20' r='1' opacity='.7'/><circle cx='80' cy='14' r='.8'/>` +
            `<circle cx='12' cy='62' r='1.2' opacity='.6'/><circle cx='38' cy='78' r='.8'/>` +
            `<circle cx='86' cy='82' r='1' opacity='.5'/>` +
            `</svg>`
        ),
      }
    case 'hearts':
      return {
        backgroundImage: tile(
          `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' fill='${c}'>` +
            `<path d='M14 20c-4-2.8-6.2-4.9-5.2-6.9.9-1.9 3.4-1.6 5.2.5 1.8-2.1 4.3-2.4 5.2-.5 1 2-1.2 4.1-5.2 6.9Z'/>` +
            `<path d='M42 46c-3-2.1-4.6-3.7-3.9-5.2.7-1.4 2.6-1.2 3.9.4 1.3-1.6 3.2-1.8 3.9-.4.7 1.5-.9 3.1-3.9 5.2Z' opacity='.6'/>` +
            `</svg>`
        ),
      }
    case 'linen':
      return {
        backgroundImage: tile(
          `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><path d='M0 8L8 0M-2 2L2-2M6 10l4-4' stroke='${c}' stroke-width='0.5'/></svg>`
        ),
      }
    default:
      return {}
  }
}

/* -------------------------------------------------------------------------- */
/* Brand                                                                       */
/* -------------------------------------------------------------------------- */

export function LogoMark({ className, title = 'Eso Va' }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label={title}>
      <path
        d="M12 9h24a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8v-2.6a4.4 4.4 0 0 0 0-8.8V17a8 8 0 0 1 8-8Z"
        fill="var(--brand-ink, #10284A)"
      />
      <path d="M15.5 14v20" stroke="#FBF7F1" strokeOpacity={0.45} strokeWidth={1.6} strokeDasharray="2 3" strokeLinecap="round" />
      <path d="M21 24.5l5.2 5.2L37 18" fill="none" stroke="var(--brand-coral, #F0564A)" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Wordmark({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`} style={light ? ({ '--brand-ink': '#FBF8F3' } as React.CSSProperties) : undefined}>
      <LogoMark className="size-8 shrink-0" />
      <span className={`font-display text-[1.35rem] font-semibold leading-none tracking-tight ${light ? 'text-paper' : 'text-ink'}`}>
        Eso<span className="italic text-coral"> Va</span>
      </span>
    </span>
  )
}
