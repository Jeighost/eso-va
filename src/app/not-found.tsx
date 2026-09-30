import Link from 'next/link'
import { EnvelopeIllustration } from '@/components/brand/illustrations'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="paper-grain flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <EnvelopeIllustration className="h-36 w-auto" />
      <p className="mt-8 text-sm font-semibold text-coral">Error 404</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Esta página se perdió en el correo</h1>
      <p className="mt-3 max-w-md text-muted-foreground">El enlace que seguiste no existe o fue movido.</p>
      <Link href="/" className={buttonVariants({ className: 'mt-8 h-11 px-6' })}>
        Volver al inicio
      </Link>
    </main>
  )
}
