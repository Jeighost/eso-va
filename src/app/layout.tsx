import type { Metadata, Viewport } from 'next'
import { Toaster } from '@/components/ui/toast'
import { fontVariables } from './fonts'
import { siteUrl } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: 'Eso Va — Invitaciones digitales que se sienten de papel fino',
    template: '%s · Eso Va',
  },
  description:
    'Diseña invitaciones digitales de lujo para bodas, XV años, cumpleaños y eventos corporativos. Confirmaciones RSVP, playlist colaborativa y galería de fotos en un solo enlace.',
  applicationName: 'Eso Va',
  keywords: ['invitaciones digitales', 'RSVP', 'boda', 'XV años', 'invitación WhatsApp', 'digital invitations'],
  openGraph: {
    type: 'website',
    siteName: 'Eso Va',
    title: 'Eso Va — Invitaciones digitales premium',
    description: 'Invitaciones interactivas con RSVP, música y fotos. Compártelas en segundos.',
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/icon.svg' },
}

export const viewport: Viewport = {
  themeColor: '#10284A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Toaster>{children}</Toaster>
      </body>
    </html>
  )
}
