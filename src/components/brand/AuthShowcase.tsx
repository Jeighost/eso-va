import { Wordmark } from '@/components/invitation/artwork'
import { CardThumbnail } from '@/components/invitation/CardThumbnail'
import { sampleFor } from '@/lib/invitation/samples'
import Link from 'next/link'

export function AuthShowcase() {
  const a = sampleFor('noche')
  const b = sampleFor('marfil')
  const c = sampleFor('jardin')
  return (
    <aside className="relative hidden overflow-hidden bg-ink text-paper lg:flex lg:flex-col">
      <div className="absolute inset-0 opacity-[.35]" style={{ background: 'radial-gradient(80% 60% at 70% 30%, #2c4468 0%, transparent 70%), radial-gradient(60% 50% at 10% 90%, #f0564a33 0%, transparent 70%)' }} />
      <div className="relative z-10 p-10">
        <Link href="/">
          <Wordmark light />
        </Link>
      </div>
      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className="relative h-[520px] w-[520px]">
          <div className="absolute top-10 left-2 animate-float [--r:-8deg]" style={{ animationDelay: '-2s' }}>
            <CardThumbnail {...a} width={210} />
          </div>
          <div className="absolute top-24 right-0 animate-float [--r:7deg]" style={{ animationDelay: '-4s' }}>
            <CardThumbnail {...c} width={210} />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-float">
            <CardThumbnail {...b} width={250} />
          </div>
        </div>
      </div>
      <div className="relative z-10 max-w-md p-10">
        <p className="font-display text-3xl leading-snug">La elegancia del papel fino, con toda la magia de lo digital.</p>
        <p className="mt-3 text-sm tracking-wide text-paper/60">RSVP · Playlist colaborativa · Galería · 5 idiomas</p>
      </div>
    </aside>
  )
}
