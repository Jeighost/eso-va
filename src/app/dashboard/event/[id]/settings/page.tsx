import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getOwnedEvent } from '@/lib/data'
import { normalizeTheme } from '@/lib/invitation/theme'
import { utcToZonedLocal } from '@/lib/invitation/datetime'
import { EventForm } from '@/components/dashboard/EventForm'
import { buttonVariants } from '@/components/ui/button'
import { updateEvent } from '../actions'
import { DeleteEvent } from './DeleteEvent'

export const metadata: Metadata = { title: 'Ajustes del evento' }

export default async function EventSettingsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const event = await getOwnedEvent(id)
  const theme = normalizeTheme(event.theme_id)

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <div>
        <Link href={`/dashboard/event/${event.id}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {event.title}
        </Link>
        <h1 className="font-display text-4xl tracking-tight text-ink">Ajustes del evento</h1>
        <p className="mt-2 text-muted-foreground">Actualiza los datos principales. Tu invitación se actualiza al instante.</p>
      </div>

      <div className="rounded-3xl border bg-card p-5 sm:p-8">
        <EventForm
          action={updateEvent.bind(null, event.id)}
          submitLabel="Guardar cambios"
          initial={{
            title: event.title,
            event_type: event.event_type ?? 'otro',
            local_date: utcToZonedLocal(event.event_date, theme.timezone),
            timezone: theme.timezone,
            location: event.location ?? '',
            language: theme.language,
            allow_photos: !!event.allow_photos,
            allow_songs: !!event.allow_songs,
          }}
        >
          <Link href={`/dashboard/event/${event.id}`} className={buttonVariants({ variant: 'ghost', className: 'h-11' })}>
            Cancelar
          </Link>
        </EventForm>
      </div>

      <section className="rounded-3xl border border-destructive/30 p-5 sm:p-8">
        <h2 className="font-display text-xl text-destructive">Zona de peligro</h2>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">Eliminar el evento borra la invitación, las respuestas, canciones y fotos. No se puede deshacer.</p>
        <DeleteEvent eventId={event.id} title={event.title} />
      </section>
    </main>
  )
}
