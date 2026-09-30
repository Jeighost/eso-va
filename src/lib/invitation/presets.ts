import { DEFAULT_THEME, type InvitationTheme, type ThemeStyle, STYLE_KEYS } from './theme'

export type Preset = {
  id: string
  name: string
  tagline: string
  style: ThemeStyle
}

const cover = (name: string) => `/covers/${name}.svg`

export const PRESETS: Preset[] = [
  {
    id: 'marfil',
    name: 'Marfil & Oro',
    tagline: 'Clásico nupcial, papel texturizado y detalles dorados',
    style: {
      layout: 'classic',
      accent: '#B08D57',
      cardBg: '#FFFDF8',
      textColor: '#2B2622',
      pageBg: '#F4EFE6',
      pageBg2: '#E8DFD0',
      pageGradient: true,
      headingFont: 'cormorant',
      bodyFont: 'lato',
      titleScale: 105,
      align: 'center',
      pattern: 'linen',
      patternOpacity: 40,
      ornament: 'flourish',
      frame: 'thin',
      radius: 'xl',
      shadow: 'soft',
      buttonStyle: 'solid',
      coverImage: cover('ivory'),
      coverOverlay: 0,
    },
  },
  {
    id: 'noche',
    name: 'Noche Estrellada',
    tagline: 'Azul medianoche con brillo champagne',
    style: {
      layout: 'editorial',
      accent: '#E4C590',
      cardBg: '#0F1B33',
      textColor: '#F3EEE3',
      pageBg: '#0A1224',
      pageBg2: '#1B2B4F',
      pageGradient: true,
      headingFont: 'cinzel',
      bodyFont: 'montserrat',
      titleScale: 95,
      align: 'center',
      pattern: 'stars',
      patternOpacity: 55,
      ornament: 'stars',
      frame: 'double',
      radius: 'md',
      shadow: 'strong',
      buttonStyle: 'solid',
      coverImage: cover('night'),
      coverOverlay: 55,
    },
  },
  {
    id: 'jardin',
    name: 'Jardín Botánico',
    tagline: 'Verde salvia, hojas y luz natural',
    style: {
      layout: 'framed',
      accent: '#5E7B5A',
      cardBg: '#FBFAF4',
      textColor: '#2E3A2C',
      pageBg: '#E9EEE2',
      pageBg2: '#D5DEC9',
      pageGradient: true,
      headingFont: 'playfair',
      bodyFont: 'lato',
      titleScale: 100,
      align: 'center',
      pattern: 'leaves',
      patternOpacity: 45,
      ornament: 'leaves',
      frame: 'floral',
      radius: 'xl',
      shadow: 'soft',
      buttonStyle: 'solid',
      coverImage: cover('botanical'),
      coverOverlay: 15,
    },
  },
  {
    id: 'deco',
    name: 'Gran Gatsby',
    tagline: 'Art Déco en negro y oro, glamour de los años 20',
    style: {
      layout: 'framed',
      accent: '#D4AF37',
      cardBg: '#111111',
      textColor: '#F5ECD7',
      pageBg: '#060606',
      pageBg2: '#1E1A12',
      pageGradient: true,
      headingFont: 'cinzel',
      bodyFont: 'josefin',
      titleScale: 100,
      align: 'center',
      pattern: 'deco',
      patternOpacity: 50,
      ornament: 'deco',
      frame: 'deco',
      radius: 'none',
      shadow: 'strong',
      buttonStyle: 'outline',
      coverImage: cover('deco'),
      coverOverlay: 40,
    },
  },
  {
    id: 'terracota',
    name: 'Terracota',
    tagline: 'Boho cálido, tonos tierra y trazo a mano',
    style: {
      layout: 'classic',
      accent: '#B5543A',
      cardBg: '#FFF8F1',
      textColor: '#3D2A22',
      pageBg: '#F2E3D5',
      pageBg2: '#E5C9B0',
      pageGradient: true,
      headingFont: 'parisienne',
      bodyFont: 'josefin',
      titleScale: 120,
      align: 'center',
      pattern: 'waves',
      patternOpacity: 35,
      ornament: 'leaves',
      frame: 'none',
      radius: 'full',
      shadow: 'soft',
      buttonStyle: 'solid',
      coverImage: cover('terracotta'),
      coverOverlay: 20,
    },
  },
  {
    id: 'rosa',
    name: 'Rosa Empolvado',
    tagline: 'Romántico y delicado, ideal para XV años',
    style: {
      layout: 'classic',
      accent: '#C0748A',
      cardBg: '#FFFAFB',
      textColor: '#4A2E37',
      pageBg: '#F9E6EA',
      pageBg2: '#F0D0D8',
      pageGradient: true,
      headingFont: 'greatVibes',
      bodyFont: 'montserrat',
      titleScale: 125,
      align: 'center',
      pattern: 'hearts',
      patternOpacity: 35,
      ornament: 'hearts',
      frame: 'thin',
      radius: 'full',
      shadow: 'soft',
      buttonStyle: 'solid',
      coverImage: cover('blush'),
      coverOverlay: 15,
    },
  },
  {
    id: 'fiesta',
    name: 'Fiesta Pop',
    tagline: 'Colores vibrantes y confeti para celebrar',
    style: {
      layout: 'editorial',
      accent: '#FF4D6D',
      cardBg: '#FFFFFF',
      textColor: '#1B1340',
      pageBg: '#FFE66D',
      pageBg2: '#FF9F80',
      pageGradient: true,
      headingFont: 'pacifico',
      bodyFont: 'montserrat',
      titleScale: 100,
      align: 'center',
      pattern: 'confetti',
      patternOpacity: 70,
      ornament: 'stars',
      frame: 'none',
      radius: 'full',
      shadow: 'strong',
      buttonStyle: 'solid',
      coverImage: cover('confetti'),
      coverOverlay: 35,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Tipografía limpia, blanco y negro atemporal',
    style: {
      layout: 'minimal',
      accent: '#111111',
      cardBg: '#FFFFFF',
      textColor: '#111111',
      pageBg: '#F2F2F0',
      pageBg2: '#E6E6E3',
      pageGradient: false,
      headingFont: 'fraunces',
      bodyFont: 'geist',
      titleScale: 110,
      align: 'left',
      pattern: 'grid',
      patternOpacity: 25,
      ornament: 'line',
      frame: 'none',
      radius: 'none',
      shadow: 'none',
      buttonStyle: 'solid',
      coverImage: '',
      coverOverlay: 0,
    },
  },
  {
    id: 'lavanda',
    name: 'Lavanda',
    tagline: 'Suave, sereno y contemporáneo',
    style: {
      layout: 'classic',
      accent: '#7C6BB0',
      cardBg: '#FDFCFF',
      textColor: '#2F2A45',
      pageBg: '#ECE8F7',
      pageBg2: '#D9D1F0',
      pageGradient: true,
      headingFont: 'dmSerif',
      bodyFont: 'lato',
      titleScale: 100,
      align: 'center',
      pattern: 'dots',
      patternOpacity: 35,
      ornament: 'diamond',
      frame: 'thin',
      radius: 'xl',
      shadow: 'soft',
      buttonStyle: 'soft',
      coverImage: cover('lavender'),
      coverOverlay: 10,
    },
  },
  {
    id: 'corporativo',
    name: 'Ejecutivo',
    tagline: 'Sobrio y profesional para eventos corporativos',
    style: {
      layout: 'minimal',
      accent: '#1E5AA8',
      cardBg: '#FFFFFF',
      textColor: '#10223D',
      pageBg: '#E9EEF5',
      pageBg2: '#D6DFEC',
      pageGradient: true,
      headingFont: 'montserrat',
      bodyFont: 'geist',
      titleScale: 90,
      align: 'left',
      pattern: 'grid',
      patternOpacity: 30,
      ornament: 'line',
      frame: 'none',
      radius: 'md',
      shadow: 'soft',
      buttonStyle: 'solid',
      coverImage: cover('summit'),
      coverOverlay: 30,
    },
  },
]

/** Original cover artwork bundled with the app. */
export const COVER_LIBRARY = [
  { src: cover('ivory'), label: 'Mármol marfil' },
  { src: cover('botanical'), label: 'Botánico' },
  { src: cover('blush'), label: 'Acuarela rosa' },
  { src: cover('night'), label: 'Noche estrellada' },
  { src: cover('deco'), label: 'Art Déco' },
  { src: cover('terracotta'), label: 'Arcos boho' },
  { src: cover('lavender'), label: 'Lavanda' },
  { src: cover('confetti'), label: 'Confeti' },
  { src: cover('summit'), label: 'Red ejecutiva' },
  { src: cover('linework'), label: 'Arco minimal' },
]

export function getPreset(id: string) {
  return PRESETS.find((p) => p.id === id)
}

export function applyPreset(theme: InvitationTheme, preset: Preset): InvitationTheme {
  const next = { ...theme, preset: preset.id }
  for (const key of STYLE_KEYS) {
    ;(next as Record<string, unknown>)[key] = preset.style[key]
  }
  // Keep the user's own cover photo if they uploaded one.
  if (theme.coverImage && !theme.coverImage.startsWith('/covers/')) {
    next.coverImage = theme.coverImage
  }
  return next
}

export const EVENT_TYPES = [
  { id: 'boda', label: 'Boda', preset: 'marfil' },
  { id: 'quinceanero', label: 'XV Años', preset: 'rosa' },
  { id: 'cumpleanos', label: 'Cumpleaños', preset: 'fiesta' },
  { id: 'bautizo', label: 'Bautizo / Baby shower', preset: 'lavanda' },
  { id: 'graduacion', label: 'Graduación', preset: 'noche' },
  { id: 'aniversario', label: 'Aniversario', preset: 'deco' },
  { id: 'corporativo', label: 'Corporativo', preset: 'corporativo' },
  { id: 'otro', label: 'Otro', preset: 'minimal' },
] as const

export function eventTypeLabel(id: string | null | undefined) {
  return EVENT_TYPES.find((t) => t.id === id)?.label ?? 'Evento'
}

export function themeForEventType(eventType: string, overrides: Partial<InvitationTheme> = {}): InvitationTheme {
  const presetId = EVENT_TYPES.find((t) => t.id === eventType)?.preset ?? 'marfil'
  const preset = getPreset(presetId) ?? PRESETS[0]
  return { ...applyPreset(DEFAULT_THEME, preset), ...overrides }
}
