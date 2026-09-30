import {
  Cinzel,
  Cormorant_Garamond,
  Dancing_Script,
  DM_Serif_Display,
  Fraunces,
  Geist,
  Geist_Mono,
  Great_Vibes,
  Josefin_Sans,
  Lato,
  Montserrat,
  Oswald,
  Pacifico,
  Parisienne,
  Playfair_Display,
} from 'next/font/google'

// Brand fonts (preloaded)
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', axes: ['SOFT', 'opsz'] })

// Invitation fonts: declared globally so any card can use them, but not
// preloaded — the browser only downloads the ones a card actually renders.
const playfair = Playfair_Display({ subsets: ['latin', 'latin-ext'], preload: false, display: 'swap', variable: '--font-playfair', style: ['normal', 'italic'] })
const cormorant = Cormorant_Garamond({ subsets: ['latin', 'latin-ext'], preload: false, display: 'swap', variable: '--font-cormorant', weight: ['400', '500', '600', '700'], style: ['normal', 'italic'] })
const cinzel = Cinzel({ subsets: ['latin', 'latin-ext'], preload: false, display: 'swap', variable: '--font-cinzel' })
const dmSerif = DM_Serif_Display({ subsets: ['latin', 'latin-ext'], preload: false, display: 'swap', variable: '--font-dm-serif', weight: '400', style: ['normal', 'italic'] })
const greatVibes = Great_Vibes({ subsets: ['latin', 'latin-ext'], preload: false, display: 'swap', variable: '--font-great-vibes', weight: '400' })
const dancing = Dancing_Script({ subsets: ['latin', 'latin-ext'], preload: false, display: 'swap', variable: '--font-dancing' })
const parisienne = Parisienne({ subsets: ['latin', 'latin-ext'], preload: false, display: 'swap', variable: '--font-parisienne', weight: '400' })
const pacifico = Pacifico({ subsets: ['latin', 'latin-ext'], preload: false, display: 'swap', variable: '--font-pacifico', weight: '400' })
const montserrat = Montserrat({ subsets: ['latin', 'latin-ext'], preload: false, display: 'swap', variable: '--font-montserrat' })
const lato = Lato({ subsets: ['latin', 'latin-ext'], preload: false, display: 'swap', variable: '--font-lato', weight: ['300', '400', '700'] })
const josefin = Josefin_Sans({ subsets: ['latin', 'latin-ext'], preload: false, display: 'swap', variable: '--font-josefin' })
const oswald = Oswald({ subsets: ['latin', 'latin-ext'], preload: false, display: 'swap', variable: '--font-oswald' })

export const fontVariables = [
  geist,
  geistMono,
  fraunces,
  playfair,
  cormorant,
  cinzel,
  dmSerif,
  greatVibes,
  dancing,
  parisienne,
  pacifico,
  montserrat,
  lato,
  josefin,
  oswald,
]
  .map((f) => f.variable)
  .join(' ')
