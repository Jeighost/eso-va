import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Wordmark } from '@/components/invitation/artwork'
import { ResetForm } from './ResetForm'

export const metadata: Metadata = { title: 'Nueva contraseña' }

export default async function ResetPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?error=link')

  return (
    <main className="paper-grain flex min-h-dvh flex-col items-center justify-center gap-10 px-6">
      <Wordmark />
      <div className="w-full max-w-sm rounded-2xl border bg-card p-7 shadow-sm">
        <h1 className="font-display text-2xl text-ink">Crea una nueva contraseña</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">Para {user.email}</p>
        <ResetForm />
      </div>
    </main>
  )
}
