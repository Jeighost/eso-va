import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EventForm } from '@/components/dashboard/EventForm'
import { buttonVariants } from '@/components/ui/button'
import { createEvent } from './actions'

export const metadata: Metadata = { title: 'Nuevo evento' }

export default function CreateEventPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Mis eventos
      </Link>
      <div className="mb-8">
        <p className="text-sm font-semibold text-coral">Paso 1 de 2</p>
        <h1 className="font-display text-4xl tracking-tight text-ink">Cuéntanos de tu evento</h1>
        <p className="mt-2 text-muted-foreground">Después elegirás el diseño. Podrás editar todo en cualquier momento.</p>
      </div>
      <div className="rounded-3xl border bg-card p-5 sm:p-8">
        <EventForm
          action={createEvent}
          submitLabel="Continuar al diseño →"
          detectTimeZone
          initial={{ title: '', event_type: 'boda', local_date: '', timezone: 'America/Mexico_City', location: '', language: 'es', allow_photos: true, allow_songs: true }}
        >
          <Link href="/dashboard" className={buttonVariants({ variant: 'ghost', className: 'h-11' })}>
            Cancelar
          </Link>
        </EventForm>
      </div>
    </main>
  )
}
