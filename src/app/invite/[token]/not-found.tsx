import Link from 'next/link'
import { LogoMark } from '@/components/invitation/artwork'

export default function InviteNotFound() {
  return (
    <main className="paper-grain flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <LogoMark className="size-14" />
      <div className="space-y-2">
        <h1 className="font-display text-3xl text-ink">Esta invitación no existe</h1>
        <p className="max-w-sm text-muted-foreground">Es posible que el enlace esté incompleto o que el anfitrión haya eliminado el evento. Pide el enlace nuevamente.</p>
      </div>
      <Link href="/" className="text-sm font-semibold text-coral underline-offset-4 hover:underline">
        Conoce Eso Va →
      </Link>
    </main>
  )
}
