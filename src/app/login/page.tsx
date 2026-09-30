import type { Metadata } from 'next'
import Link from 'next/link'
import { Wordmark } from '@/components/invitation/artwork'
import { AuthShowcase } from '@/components/brand/AuthShowcase'
import { AuthForm } from './AuthForm'

export const metadata: Metadata = { title: 'Entrar' }

export default async function LoginPage(props: { searchParams: Promise<{ next?: string; error?: string; mode?: string }> }) {
  const sp = await props.searchParams
  const mode = sp.mode === 'signup' ? 'signup' : 'login'

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <AuthShowcase />
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Inicio" className="lg:invisible">
            <Wordmark />
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Volver al inicio
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <AuthForm initialMode={mode} next={sp.next ?? ''} linkError={sp.error === 'link'} />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Al continuar aceptas nuestros términos y la política de privacidad.
        </p>
      </main>
    </div>
  )
}
