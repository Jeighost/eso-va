import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CalendarDays, MapPin, Paintbrush, Plus, Users } from 'lucide-react'
import { getProfileName, requireUser, summarize, type EventRow } from '@/lib/data'
import { normalizeTheme } from '@/lib/invitation/theme'
import { eventTypeLabel } from '@/lib/invitation/presets'
import { formatShortDate } from '@/lib/invitation/datetime'
import { buttonVariants } from '@/components/ui/button'
import { CardThumbnail } from '@/components/invitation/CardThumbnail'
import { EnvelopeIllustration, IconChart, IconRsvp, IconCalendar } from '@/components/brand/illustrations'
import { FlashToast } from '@/components/dashboard/FlashToast'

export const metadata: Metadata = { title: 'Mis eventos' }

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
}

/** Events still to come (including today) vs. already past, each in display order. */
function splitByTime(events: EventRow[]) {
  const cutoff = Date.now() - 86_400_000
  return {
    upcoming: events.filter((e) => new Date(e.event_date).getTime() >= cutoff),
    past: events.filter((e) => new Date(e.event_date).getTime() < cutoff).reverse(),
  }
}

export default async function DashboardPage(props: { searchParams: Promise<{ toast?: string }> }) {
  const { toast } = await props.searchParams
  const { supabase, user } = await requireUser()
  const name = await getProfileName()

  const { data } = await supabase.from('events').select('*').eq('user_id', user.id).order('event_date', { ascending: true })
  const events = (data ?? []) as EventRow[]

  const ids = events.map((e) => e.id)
  const { data: guestRows } = ids.length
    ? await supabase.from('guests').select('event_id, status, plus_ones').in('event_id', ids)
    : { data: [] as { event_id: string; status: string; plus_ones: number | null }[] }
  const guests = guestRows ?? []

  const { upcoming, past } = splitByTime(events)
  const total = summarize(guests)
  const next = upcoming[0]

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 sm:py-12">
      {toast && <FlashToast code={toast} />}

      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-coral">Hola de nuevo,</p>
          <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">{name}</h1>
          <p className="mt-2 text-muted-foreground">
            {events.length === 0
              ? 'Tu primera invitación está a unos minutos de distancia.'
              : next
                ? `Tu próximo evento es en ${Math.max(0, daysUntil(next.event_date))} días.`
                : 'No tienes eventos próximos.'}
          </p>
        </div>
        <Link href="/dashboard/create" className={buttonVariants({ size: 'lg', className: 'h-11 px-5 text-[15px]' })}>
          <Plus /> Crear evento
        </Link>
      </section>

      {events.length > 0 && (
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat icon={<IconCalendar className="size-10" />} label="Eventos próximos" value={upcoming.length} />
          <Stat icon={<IconRsvp className="size-10" />} label="Respuestas recibidas" value={total.responses} />
          <Stat icon={<IconChart className="size-10" />} label="Confirmados" value={total.accepted} />
          <Stat icon={<Users className="size-7 text-ink" strokeWidth={1.6} />} label="Asistentes totales" value={total.attendees} hint="incluye acompañantes" />
        </section>
      )}

      {events.length === 0 ? (
        <section className="flex flex-col items-center rounded-3xl border border-dashed bg-card px-6 py-16 text-center">
          <EnvelopeIllustration className="h-40 w-auto" />
          <h2 className="mt-6 font-display text-3xl text-ink">Crea tu primera invitación</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Elige una plantilla, personalízala a tu gusto y compártela por WhatsApp. Tus invitados confirman, piden canciones y comparten fotos desde el mismo enlace.
          </p>
          <Link href="/dashboard/create" className={buttonVariants({ size: 'lg', className: 'mt-8 h-11 px-6 text-[15px]' })}>
            <Plus /> Empezar ahora
          </Link>
        </section>
      ) : (
        <>
          <EventGrid title="Próximos" events={upcoming} guests={guests} />
          {past.length > 0 && <EventGrid title="Pasados" events={past} guests={guests} muted />}
        </>
      )}
    </main>
  )
}

function Stat({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: number; hint?: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-4 sm:p-5">
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-muted">{icon}</div>
      <div className="min-w-0">
        <p className="font-display text-3xl leading-none text-ink tabular-nums">{value}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
          {label}
          {hint && <span className="hidden sm:inline"> · {hint}</span>}
        </p>
      </div>
    </div>
  )
}

function EventGrid({ title, events, guests, muted }: { title: string; events: EventRow[]; guests: { event_id: string; status: string; plus_ones: number | null }[]; muted?: boolean }) {
  if (!events.length) return null
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {title} · {events.length}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((e) => (
          <EventCard key={e.id} event={e} stats={summarize(guests.filter((g) => g.event_id === e.id))} muted={muted} />
        ))}
      </div>
    </section>
  )
}

function EventCard({ event, stats, muted }: { event: EventRow; stats: ReturnType<typeof summarize>; muted?: boolean }) {
  const theme = normalizeTheme(event.theme_id)
  const days = daysUntil(event.event_date)
  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-24px_rgba(16,40,74,.35)] ${muted ? 'opacity-80' : ''}`}>
      <Link href={`/dashboard/event/${event.id}`} className="relative block h-56 overflow-hidden" aria-label={`Gestionar ${event.title}`}>
        <CardThumbnail event={event} theme={{ ...theme, showCountdown: false }} width={230} backdrop className="h-full [&>div:last-child]:pt-6" />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm backdrop-blur">
          {eventTypeLabel(event.event_type)}
        </span>
        {!muted && (
          <span className="absolute top-3 right-3 rounded-full bg-ink/90 px-2.5 py-1 text-[11px] font-semibold text-paper shadow-sm backdrop-blur">
            {days <= 0 ? '¡Hoy!' : days === 1 ? 'Mañana' : `En ${days} días`}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="min-w-0">
          <h3 className="truncate font-display text-xl text-ink">{event.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" /> {formatShortDate(event.event_date, theme.timezone)}
          </p>
          {event.location && (
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" /> <span className="truncate">{event.location}</span>
            </p>
          )}
        </div>
        <div className="grid grid-cols-3 divide-x rounded-xl bg-muted/60 py-2.5 text-center">
          <Mini value={stats.accepted} label="Sí" />
          <Mini value={stats.declined} label="No" />
          <Mini value={stats.attendees} label="Personas" />
        </div>
        <div className="mt-auto flex gap-2">
          <Link href={`/dashboard/event/${event.id}`} className={buttonVariants({ className: 'h-9 flex-1' })}>
            Gestionar <ArrowUpRight />
          </Link>
          <Link href={`/studio/${event.id}`} className={buttonVariants({ variant: 'outline', className: 'h-9' })} aria-label="Personalizar diseño">
            <Paintbrush /> Diseño
          </Link>
        </div>
      </div>
    </article>
  )
}

function Mini({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-lg font-semibold leading-none text-ink tabular-nums">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  )
}
