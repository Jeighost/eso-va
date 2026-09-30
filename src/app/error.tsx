'use client'

import { useEffect } from 'react'
import { LogoMark } from '@/components/invitation/artwork'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <LogoMark className="size-14" />
      <h1 className="font-display text-3xl text-ink">Algo salió mal</h1>
      <p className="max-w-sm text-muted-foreground">Tuvimos un problema al cargar esta página. Inténtalo de nuevo en unos segundos.</p>
      <Button onClick={reset} className="h-11 px-6">
        Reintentar
      </Button>
    </main>
  )
}
