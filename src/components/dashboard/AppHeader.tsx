import Link from 'next/link'
import { LogOut, Plus } from 'lucide-react'
import { Wordmark } from '@/components/invitation/artwork'
import { buttonVariants } from '@/components/ui/button'

export function AppHeader({ name, email }: { name: string; email: string }) {
  const initials = name
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/dashboard" aria-label="Mis eventos">
          <Wordmark />
        </Link>
        <nav className="ml-6 hidden items-center gap-1 text-sm md:flex">
          <Link href="/dashboard" className="rounded-lg px-3 py-2 font-medium text-foreground/80 hover:bg-muted hover:text-foreground">
            Mis eventos
          </Link>
          <Link href="/#plantillas" className="rounded-lg px-3 py-2 font-medium text-foreground/80 hover:bg-muted hover:text-foreground">
            Plantillas
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/dashboard/create" className={buttonVariants({ size: 'lg', className: 'hidden h-9 px-3.5 sm:inline-flex' })}>
            <Plus /> Nuevo evento
          </Link>
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full p-0.5 pr-0.5 hover:bg-muted [&::-webkit-details-marker]:hidden" aria-label="Menú de cuenta">
              <span className="grid size-9 place-items-center rounded-full bg-ink text-xs font-semibold text-paper">{initials || '•'}</span>
            </summary>
            <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border bg-popover p-1.5 shadow-xl">
              <div className="px-3 py-2.5">
                <p className="truncate text-sm font-semibold">{name}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
              <div className="my-1 h-px bg-border" />
              <Link href="/dashboard/create" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted sm:hidden">
                <Plus className="size-4" /> Nuevo evento
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10">
                  <LogOut className="size-4" /> Cerrar sesión
                </button>
              </form>
            </div>
          </details>
        </div>
      </div>
    </header>
  )
}
