import type { FontId } from './theme'

export type FontOption = { id: FontId; label: string; mood: string; family: string; kind: 'serif' | 'script' | 'sans' | 'display' }

export const FONT_OPTIONS: FontOption[] = [
  { id: 'cormorant', label: 'Cormorant', mood: 'Editorial y refinada', family: 'var(--font-cormorant), Georgia, serif', kind: 'serif' },
  { id: 'playfair', label: 'Playfair', mood: 'Tradicional y romántica', family: 'var(--font-playfair), Georgia, serif', kind: 'serif' },
  { id: 'fraunces', label: 'Fraunces', mood: 'Moderna con carácter', family: 'var(--font-fraunces), Georgia, serif', kind: 'serif' },
  { id: 'dmSerif', label: 'DM Serif', mood: 'Contraste elegante', family: 'var(--font-dm-serif), Georgia, serif', kind: 'serif' },
  { id: 'cinzel', label: 'Cinzel', mood: 'Clásica y solemne', family: 'var(--font-cinzel), Georgia, serif', kind: 'display' },
  { id: 'greatVibes', label: 'Great Vibes', mood: 'Caligrafía de lujo', family: 'var(--font-great-vibes), cursive', kind: 'script' },
  { id: 'parisienne', label: 'Parisienne', mood: 'Manuscrita chic', family: 'var(--font-parisienne), cursive', kind: 'script' },
  { id: 'dancing', label: 'Dancing Script', mood: 'Cursiva alegre', family: 'var(--font-dancing), cursive', kind: 'script' },
  { id: 'pacifico', label: 'Pacifico', mood: 'Fiesta y diversión', family: 'var(--font-pacifico), cursive', kind: 'script' },
  { id: 'montserrat', label: 'Montserrat', mood: 'Geométrica y limpia', family: 'var(--font-montserrat), system-ui, sans-serif', kind: 'sans' },
  { id: 'josefin', label: 'Josefin Sans', mood: 'Vintage minimalista', family: 'var(--font-josefin), system-ui, sans-serif', kind: 'sans' },
  { id: 'lato', label: 'Lato', mood: 'Cálida y legible', family: 'var(--font-lato), system-ui, sans-serif', kind: 'sans' },
  { id: 'oswald', label: 'Oswald', mood: 'Condensada e impactante', family: 'var(--font-oswald), system-ui, sans-serif', kind: 'display' },
  { id: 'geist', label: 'Geist', mood: 'Neutra y contemporánea', family: 'var(--font-geist), system-ui, sans-serif', kind: 'sans' },
]

export function fontFamily(id: FontId) {
  return FONT_OPTIONS.find((f) => f.id === id)?.family ?? FONT_OPTIONS[0].family
}

export function isScript(id: FontId) {
  return FONT_OPTIONS.find((f) => f.id === id)?.kind === 'script'
}
