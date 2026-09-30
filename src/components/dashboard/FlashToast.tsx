'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'

const MESSAGES: Record<string, { title: string; description?: string; type?: string }> = {
  created: { title: 'Evento creado', description: 'Ahora personaliza tu invitación.', type: 'success' },
  saved: { title: 'Cambios guardados', type: 'success' },
  deleted: { title: 'Evento eliminado', type: 'success' },
  password: { title: 'Contraseña actualizada', type: 'success' },
}

/** Shows a one-off toast for `?toast=<code>` and strips the param from the URL. */
export function FlashToast({ code }: { code: string }) {
  const router = useRouter()
  const pathname = usePathname()
  useEffect(() => {
    const m = MESSAGES[code]
    if (m) toast.add(m)
    router.replace(pathname, { scroll: false })
  }, [code, pathname, router])
  return null
}
