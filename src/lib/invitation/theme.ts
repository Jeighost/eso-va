/**
 * Invitation theme model.
 *
 * The theme is persisted as JSON inside `events.theme_id` (legacy column name).
 * `normalizeTheme` accepts anything — including the v1 shape
 * ({ color, font, borderRadius, ... }) — and always returns a complete,
 * validated theme so rendering code never has to guard against missing keys.
 */

export const LAYOUTS = ['classic', 'editorial', 'minimal', 'framed'] as const
export const PATTERNS = ['none', 'dots', 'grid', 'waves', 'confetti', 'leaves', 'deco', 'stars', 'hearts', 'linen'] as const
export const ORNAMENTS = ['none', 'line', 'flourish', 'leaves', 'deco', 'stars', 'hearts', 'diamond'] as const
export const FRAMES = ['none', 'thin', 'double', 'deco', 'floral'] as const
export const RADII = ['none', 'md', 'xl', 'full'] as const
export const SHADOWS = ['none', 'soft', 'strong'] as const
export const COVER_HEIGHTS = ['sm', 'md', 'lg'] as const
export const COVER_FOCUS = ['top', 'center', 'bottom'] as const
export const ALIGNMENTS = ['center', 'left'] as const
export const BUTTON_STYLES = ['solid', 'outline', 'soft'] as const
export const LANGUAGES = ['es', 'en', 'pt', 'fr', 'it'] as const
export const FONT_IDS = [
  'playfair',
  'cormorant',
  'cinzel',
  'fraunces',
  'dmSerif',
  'greatVibes',
  'dancing',
  'parisienne',
  'pacifico',
  'montserrat',
  'lato',
  'josefin',
  'oswald',
  'geist',
] as const

export type Layout = (typeof LAYOUTS)[number]
export type Pattern = (typeof PATTERNS)[number]
export type Ornament = (typeof ORNAMENTS)[number]
export type Frame = (typeof FRAMES)[number]
export type Radius = (typeof RADII)[number]
export type Shadow = (typeof SHADOWS)[number]
export type CoverHeight = (typeof COVER_HEIGHTS)[number]
export type CoverFocus = (typeof COVER_FOCUS)[number]
export type Alignment = (typeof ALIGNMENTS)[number]
export type ButtonStyle = (typeof BUTTON_STYLES)[number]
export type Language = (typeof LANGUAGES)[number]
export type FontId = (typeof FONT_IDS)[number]

export type ItineraryItem = { time: string; label: string }

export type InvitationTheme = {
  version: 2
  preset: string
  layout: Layout

  // Colour
  accent: string
  cardBg: string
  textColor: string
  pageBg: string
  pageBg2: string
  pageGradient: boolean

  // Typography
  headingFont: FontId
  bodyFont: FontId
  titleScale: number // percentage 70–150
  align: Alignment

  // Decoration
  pattern: Pattern
  patternOpacity: number // 0–100
  ornament: Ornament
  frame: Frame
  radius: Radius
  shadow: Shadow
  buttonStyle: ButtonStyle
  animate: boolean

  // Cover
  coverImage: string
  coverHeight: CoverHeight
  coverFocus: CoverFocus
  coverOverlay: number // 0–90

  // Content
  eyebrow: string
  customTitle: string
  hosts: string
  message: string
  dressCode: string
  giftInfo: string
  giftUrl: string
  mapUrl: string
  itinerary: ItineraryItem[]
  rsvpDeadline: string // YYYY-MM-DD
  maxPlusOnes: number
  rsvpButtonText: string

  // Sections
  showCountdown: boolean
  showCalendar: boolean
  showMap: boolean
  showItinerary: boolean

  // Regional
  language: Language
  timezone: string
  durationHours: number
}

export const DEFAULT_COVER = '/covers/ivory.svg'

export const DEFAULT_THEME: InvitationTheme = {
  version: 2,
  preset: 'marfil',
  layout: 'classic',

  accent: '#B08D57',
  cardBg: '#FFFDF8',
  textColor: '#2B2622',
  pageBg: '#F4EFE6',
  pageBg2: '#E8DFD0',
  pageGradient: true,

  headingFont: 'cormorant',
  bodyFont: 'lato',
  titleScale: 100,
  align: 'center',

  pattern: 'linen',
  patternOpacity: 40,
  ornament: 'flourish',
  frame: 'thin',
  radius: 'xl',
  shadow: 'soft',
  buttonStyle: 'solid',
  animate: true,

  coverImage: DEFAULT_COVER,
  coverHeight: 'md',
  coverFocus: 'center',
  coverOverlay: 25,

  eyebrow: '',
  customTitle: '',
  hosts: '',
  message: '',
  dressCode: '',
  giftInfo: '',
  giftUrl: '',
  mapUrl: '',
  itinerary: [],
  rsvpDeadline: '',
  maxPlusOnes: 3,
  rsvpButtonText: '',

  showCountdown: true,
  showCalendar: true,
  showMap: true,
  showItinerary: true,

  language: 'es',
  timezone: 'America/Mexico_City',
  durationHours: 5,
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

function pick<T extends readonly string[]>(list: T, value: unknown, fallback: T[number]): T[number] {
  return typeof value === 'string' && (list as readonly string[]).includes(value) ? (value as T[number]) : fallback
}
function color(value: unknown, fallback: string) {
  return typeof value === 'string' && HEX.test(value.trim()) ? value.trim() : fallback
}
function text(value: unknown, fallback = '', max = 600) {
  return typeof value === 'string' ? value.slice(0, max) : fallback
}
function num(value: unknown, fallback: number, min: number, max: number) {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, Math.round(n)))
}
function bool(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback
}
function url(value: unknown, fallback = '') {
  if (typeof value !== 'string') return fallback
  const v = value.trim()
  if (v === '') return ''
  return /^https?:\/\/[^\s"'()<>]+$/i.test(v) ? v.slice(0, 2000) : fallback
}
/** Remote images or the bundled cover artwork. */
function imageUrl(value: unknown, fallback: string) {
  if (value === '') return ''
  if (typeof value === 'string' && /^\/covers\/[\w-]+\.svg$/.test(value)) return value
  return url(value, fallback)
}
export function isValidTimeZone(tz: unknown): tz is string {
  if (typeof tz !== 'string' || !tz) return false
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

/** v1 font names → v2 font ids */
const LEGACY_FONTS: Record<string, FontId> = {
  'Playfair Display': 'playfair',
  Cinzel: 'cinzel',
  'Dancing Script': 'dancing',
  'Great Vibes': 'greatVibes',
  Montserrat: 'montserrat',
  Pacifico: 'pacifico',
  Lato: 'lato',
  Oswald: 'oswald',
  serif: 'playfair',
  sans: 'geist',
  mono: 'geist',
}

export function parseThemeJson(raw: unknown): Record<string, unknown> {
  if (!raw) return {}
  if (typeof raw === 'object') return raw as Record<string, unknown>
  if (typeof raw === 'string' && raw.trim().startsWith('{')) {
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  }
  return {}
}

export function normalizeTheme(input: unknown, base: InvitationTheme = DEFAULT_THEME): InvitationTheme {
  const raw = parseThemeJson(input)
  const isLegacy = raw.version !== 2 && Object.keys(raw).length > 0

  // Map v1 keys onto v2
  const legacy: Record<string, unknown> = {}
  if (isLegacy) {
    legacy.accent = raw.color
    legacy.headingFont = typeof raw.font === 'string' ? LEGACY_FONTS[raw.font] : undefined
    legacy.bodyFont = 'lato'
    legacy.radius = raw.borderRadius
    legacy.layout = 'classic'
    legacy.frame = 'none'
    legacy.ornament = 'line'
    legacy.pageGradient = false
    legacy.pageBg = '#F8FAFC'
    legacy.textColor = '#1F2937'
    legacy.preset = 'custom'
  }
  const r = { ...raw, ...Object.fromEntries(Object.entries(legacy).filter(([, v]) => v !== undefined)) }

  const itinerary = Array.isArray(r.itinerary)
    ? (r.itinerary as unknown[])
        .filter((i): i is Record<string, unknown> => !!i && typeof i === 'object')
        .slice(0, 12)
        .map((i) => ({ time: text(i.time, '', 20), label: text(i.label, '', 120) }))
    : base.itinerary

  return {
    version: 2,
    preset: text(r.preset, base.preset, 40),
    layout: pick(LAYOUTS, r.layout, base.layout),

    accent: color(r.accent, base.accent),
    cardBg: color(r.cardBg, base.cardBg),
    textColor: color(r.textColor, base.textColor),
    pageBg: color(r.pageBg, base.pageBg),
    pageBg2: color(r.pageBg2, base.pageBg2),
    pageGradient: bool(r.pageGradient, base.pageGradient),

    headingFont: pick(FONT_IDS, r.headingFont, base.headingFont),
    bodyFont: pick(FONT_IDS, r.bodyFont, base.bodyFont),
    titleScale: num(r.titleScale, base.titleScale, 70, 150),
    align: pick(ALIGNMENTS, r.align, base.align),

    pattern: pick(PATTERNS, r.pattern, base.pattern),
    patternOpacity: num(r.patternOpacity, base.patternOpacity, 0, 100),
    ornament: pick(ORNAMENTS, r.ornament, base.ornament),
    frame: pick(FRAMES, r.frame, base.frame),
    radius: pick(RADII, r.radius, base.radius),
    shadow: pick(SHADOWS, r.shadow, base.shadow),
    buttonStyle: pick(BUTTON_STYLES, r.buttonStyle, base.buttonStyle),
    animate: bool(r.animate, base.animate),

    coverImage: imageUrl(r.coverImage, base.coverImage),
    coverHeight: pick(COVER_HEIGHTS, r.coverHeight, base.coverHeight),
    coverFocus: pick(COVER_FOCUS, r.coverFocus, base.coverFocus),
    coverOverlay: num(r.coverOverlay, base.coverOverlay, 0, 90),

    eyebrow: text(r.eyebrow, base.eyebrow, 80),
    customTitle: text(r.customTitle, base.customTitle, 140),
    hosts: text(r.hosts, base.hosts, 140),
    message: text(r.message, base.message, 800),
    dressCode: text(r.dressCode, base.dressCode, 200),
    giftInfo: text(r.giftInfo, base.giftInfo, 400),
    giftUrl: url(r.giftUrl, base.giftUrl),
    mapUrl: url(r.mapUrl, base.mapUrl),
    itinerary,
    rsvpDeadline: typeof r.rsvpDeadline === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.rsvpDeadline) ? r.rsvpDeadline : r.rsvpDeadline === '' ? '' : base.rsvpDeadline,
    maxPlusOnes: num(r.maxPlusOnes, base.maxPlusOnes, 0, 10),
    rsvpButtonText: text(r.rsvpButtonText, base.rsvpButtonText, 40),

    showCountdown: bool(r.showCountdown, base.showCountdown),
    showCalendar: bool(r.showCalendar, base.showCalendar),
    showMap: bool(r.showMap, base.showMap),
    showItinerary: bool(r.showItinerary, base.showItinerary),

    language: pick(LANGUAGES, r.language, base.language),
    timezone: isValidTimeZone(r.timezone) ? r.timezone : base.timezone,
    durationHours: num(r.durationHours, base.durationHours, 1, 48),
  }
}

export function serializeTheme(theme: InvitationTheme) {
  return JSON.stringify(normalizeTheme(theme))
}

/** Keys that belong to the visual style (a preset overrides these, never content). */
export const STYLE_KEYS = [
  'layout',
  'accent',
  'cardBg',
  'textColor',
  'pageBg',
  'pageBg2',
  'pageGradient',
  'headingFont',
  'bodyFont',
  'titleScale',
  'align',
  'pattern',
  'patternOpacity',
  'ornament',
  'frame',
  'radius',
  'shadow',
  'buttonStyle',
  'coverImage',
  'coverOverlay',
] as const satisfies readonly (keyof InvitationTheme)[]

export type StyleKeys = (typeof STYLE_KEYS)[number]
export type ThemeStyle = Pick<InvitationTheme, StyleKeys>

/** Readable foreground (black/white) for a given background hex. */
export function contrastOn(hex: string) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const r = parseInt(full.slice(0, 2), 16) / 255
  const g = parseInt(full.slice(2, 4), 16) / 255
  const b = parseInt(full.slice(4, 6), 16) / 255
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  return L > 0.45 ? '#16110D' : '#FFFFFF'
}

/** Hex + alpha (0–1) → rgba() string. */
export function alpha(hex: string, a: number) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
