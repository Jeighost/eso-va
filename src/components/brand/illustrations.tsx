/**
 * Eso Va illustration set. Duotone line art on a 48px grid:
 * ink strokes, coral highlights, soft sand fills. All paths hand-authored.
 */

type P = { className?: string }

const INK = 'var(--brand-ink)'
const CORAL = 'var(--brand-coral)'
const SAND = 'var(--brand-sand)'
const GOLD = 'var(--brand-gold)'

function Icon({ className, children }: P & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  )
}

export function IconDesign({ className }: P) {
  return (
    <Icon className={className}>
      <rect x="7" y="9" width="24" height="31" rx="3" fill={SAND} />
      <path d="M12 17h14M12 22h10M14 29.5h10" />
      <path d="M19 13.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3Z" fill={CORAL} stroke="none" />
      <path d="M39.5 13.5l2.8 2.8-12.6 12.6-4.1 1.3 1.3-4.1Z" fill="#fff" />
      <path d="M36.8 16.2l2.8 2.8" stroke={CORAL} />
    </Icon>
  )
}

export function IconRsvp({ className }: P) {
  return (
    <Icon className={className}>
      <rect x="9" y="7" width="30" height="34" rx="3.5" fill={SAND} />
      <circle cx="16.5" cy="17" r="3.2" fill={CORAL} stroke="none" />
      <path d="M15 17l1.1 1.1 2-2.2" stroke="#fff" strokeWidth={1.4} />
      <path d="M23 15.5h10M23 19h6" />
      <circle cx="16.5" cy="28" r="3.2" fill="#fff" />
      <path d="M23 26.5h10M23 30h7" />
      <path d="M15 36.5h18" strokeDasharray="1 3" />
    </Icon>
  )
}

export function IconMusic({ className }: P) {
  return (
    <Icon className={className}>
      <circle cx="21" cy="26" r="14" fill={SAND} />
      <circle cx="21" cy="26" r="9.5" strokeOpacity={0.35} />
      <circle cx="21" cy="26" r="4" fill={CORAL} stroke="none" />
      <circle cx="21" cy="26" r="1.2" fill="#fff" stroke="none" />
      <path d="M36 8v15.5" />
      <path d="M36 8l6 2.5v4L36 12" fill={CORAL} stroke={CORAL} />
      <circle cx="33.5" cy="24" r="2.8" fill="#fff" />
    </Icon>
  )
}

export function IconPhotos({ className }: P) {
  return (
    <Icon className={className}>
      <rect x="6" y="12" width="24" height="28" rx="2" transform="rotate(-8 18 26)" fill="#fff" />
      <rect x="16" y="8" width="26" height="30" rx="2" fill={SAND} />
      <rect x="19.5" y="11.5" width="19" height="17" rx="1" fill="#fff" />
      <path d="M19.5 25.5l5.5-5.5 4 4 3-3 6.5 6.5" stroke={INK} />
      <circle cx="33.5" cy="16" r="2" fill={CORAL} stroke="none" />
      <path d="M22 33h9" />
    </Icon>
  )
}

export function IconShare({ className }: P) {
  return (
    <Icon className={className}>
      <path d="M6 22.5 41 8l-7.5 32-9.5-9.5Z" fill={SAND} />
      <path d="M41 8 24 30.5l-2 9.5-4.5-10.5Z" fill="#fff" />
      <path d="M41 8 17.5 29.5" />
      <path d="M22 40l4.5-6" stroke={CORAL} />
      <path d="M6 33.5c3-1 5 .5 6 2.5M4 40c3-1.5 6-.5 7.5 1.5" stroke={CORAL} strokeDasharray="0.1 3.2" strokeWidth={2} />
    </Icon>
  )
}

export function IconGlobe({ className }: P) {
  return (
    <Icon className={className}>
      <circle cx="21" cy="25" r="14" fill={SAND} />
      <path d="M7 25h28M21 11c-4.5 4-6.5 9-6.5 14s2 10 6.5 14M21 11c4.5 4 6.5 9 6.5 14s-2 10-6.5 14" />
      <path d="M31 6h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6l-4 3.5V17h-2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" fill={CORAL} stroke={CORAL} />
      <path d="M34 11.5h6" stroke="#fff" />
    </Icon>
  )
}

export function IconCalendar({ className }: P) {
  return (
    <Icon className={className}>
      <rect x="7" y="10" width="34" height="31" rx="4" fill="#fff" />
      <path d="M7 18h34" />
      <path d="M7 14a4 4 0 0 1 4-4h26a4 4 0 0 1 4 4v4H7Z" fill={CORAL} stroke={CORAL} />
      <path d="M15 6.5v6M33 6.5v6" />
      <path d="M24 35.5c-4.6-3.2-7-5.6-5.9-7.9 1-2.1 3.8-1.8 5.9.6 2.1-2.4 4.9-2.7 5.9-.6 1.1 2.3-1.3 4.7-5.9 7.9Z" fill={GOLD} stroke="none" />
    </Icon>
  )
}

export function IconQr({ className }: P) {
  return (
    <Icon className={className}>
      <rect x="6" y="6" width="36" height="36" rx="5" fill={SAND} />
      <rect x="11" y="11" width="10" height="10" rx="1.5" fill="#fff" />
      <rect x="27" y="11" width="10" height="10" rx="1.5" fill="#fff" />
      <rect x="11" y="27" width="10" height="10" rx="1.5" fill="#fff" />
      <rect x="14" y="14" width="4" height="4" fill={INK} stroke="none" />
      <rect x="30" y="14" width="4" height="4" fill={INK} stroke="none" />
      <rect x="14" y="30" width="4" height="4" fill={INK} stroke="none" />
      <path d="M27 27h4v4M35 27h2M27 35h2v2M33 33h4v4" stroke={CORAL} strokeWidth={2} />
    </Icon>
  )
}

export function IconChart({ className }: P) {
  return (
    <Icon className={className}>
      <rect x="6" y="8" width="36" height="32" rx="4" fill="#fff" />
      <path d="M13 32V24M20 32V18M27 32V21M34 32V14" strokeWidth={3.2} />
      <path d="M34 32V14" stroke={CORAL} strokeWidth={3.2} />
      <path d="M11 36h26" strokeOpacity={0.4} />
    </Icon>
  )
}

/** Empty-state art: an envelope releasing an invitation card. */
export function EnvelopeIllustration({ className }: P) {
  return (
    <svg viewBox="0 0 240 180" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <ellipse cx="120" cy="164" rx="78" ry="7" fill={SAND} stroke="none" />
      <g transform="rotate(-6 120 70)">
        <rect x="74" y="18" width="92" height="104" rx="6" fill="#fff" />
        <path d="M96 42h48" stroke={GOLD} />
        <path d="M100 56h40M92 66h56" strokeOpacity={0.5} />
        <path d="M104 80c6-5 10 5 16 0s10 5 16 0" stroke={CORAL} />
        <path d="M110 96h20" strokeOpacity={0.5} />
      </g>
      <path d="M52 86h136v66a6 6 0 0 1-6 6H58a6 6 0 0 1-6-6Z" fill={SAND} />
      <path d="M52 88l68 44 68-44" fill="#fff" />
      <path d="M52 156l52-38M188 156l-52-38" strokeOpacity={0.5} />
      <circle cx="120" cy="132" r="10" fill={CORAL} stroke="none" />
      <path d="M115.5 132l3 3 6-6.5" stroke="#fff" strokeWidth={2.2} />
      <path d="M40 40l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5Z" fill={GOLD} stroke="none" />
      <path d="M200 28l1.8 4.2 4.2 1.8-4.2 1.8-1.8 4.2-1.8-4.2-4.2-1.8 4.2-1.8Z" fill={CORAL} stroke="none" />
      <circle cx="206" cy="78" r="3" fill={INK} stroke="none" />
      <circle cx="30" cy="100" r="2.4" fill={CORAL} stroke="none" />
    </svg>
  )
}

/** Event-type pictograms (24px grid, ink line + coral accent). */
export function EventTypeIcon({ type, className }: { type: string; className?: string }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: INK, strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className, 'aria-hidden': true }
  switch (type) {
    case 'boda':
      return (
        <svg {...common}>
          <circle cx="12" cy="15" r="6" />
          <path d="M9.5 6.5 12 9l2.5-2.5L13 4h-2Z" fill={CORAL} stroke={CORAL} />
        </svg>
      )
    case 'quinceanero':
      return (
        <svg {...common}>
          <path d="M4 17 3 8l5 4 4-7 4 7 5-4-1 9Z" fill={SAND} />
          <path d="M4 20h16" />
          <circle cx="12" cy="13" r="1.4" fill={CORAL} stroke="none" />
        </svg>
      )
    case 'cumpleanos':
      return (
        <svg {...common}>
          <rect x="4" y="12" width="16" height="8" rx="1.5" fill={SAND} />
          <path d="M4 15.5c2 1.2 3.3 1.2 5.3 0s3.4-1.2 5.4 0 3.3 1.2 5.3 0" />
          <path d="M12 12V8.5" />
          <path d="M12 3.5c1.2 1.4 1.2 2.8 0 3.6-1.2-.8-1.2-2.2 0-3.6Z" fill={CORAL} stroke={CORAL} />
        </svg>
      )
    case 'bautizo':
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="5" fill={SAND} />
          <path d="m12.5 12.5 6.5 6.5" />
          <circle cx="19.5" cy="19.5" r="1.5" fill={CORAL} stroke={CORAL} />
          <path d="M7 9h4M9 7v4" stroke={CORAL} />
        </svg>
      )
    case 'graduacion':
      return (
        <svg {...common}>
          <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5Z" fill={SAND} />
          <path d="M6.5 11v4.5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3V11" />
          <path d="M21.5 9v5.5" stroke={CORAL} />
          <circle cx="21.5" cy="15.5" r="1" fill={CORAL} stroke="none" />
        </svg>
      )
    case 'aniversario':
      return (
        <svg {...common}>
          <path d="M5 3h5l-.5 5a2 2 0 0 1-4 0Z" fill={SAND} />
          <path d="M14.5 3h5L19 8a2 2 0 0 1-4 0Z" fill={SAND} />
          <path d="M7.5 10v8M5 21h5M17 10v8M14.5 21h5" />
          <path d="m12.2 5.5.6-1.2M12 8h1.4" stroke={CORAL} />
        </svg>
      )
    case 'corporativo':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="12" rx="2" fill={SAND} />
          <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12h18" />
          <rect x="10.5" y="10.5" width="3" height="3" rx=".5" fill={CORAL} stroke={CORAL} />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" fill={SAND} />
          <path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7Z" fill={CORAL} stroke="none" />
        </svg>
      )
  }
}
