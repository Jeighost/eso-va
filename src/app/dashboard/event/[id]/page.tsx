import type { Metadata } from 'next'
import Link from 'next/link'
import QRCode from 'qrcode'
import { ArrowLeft, CalendarDays, ExternalLink, MapPin, Paintbrush, Settings2 } from 'lucide-react'
import { getOwnedEvent, requireUser, summarize, type GuestRow, type PhotoRow, type SongRow } from '@/lib/data'
import { normalizeTheme } from '@/lib/invitation/theme'
import { eventTypeLabel } from '@/lib/invitation/presets'
import { formatShortDate } from '@/lib/invitation/datetime'
import { requestBaseUrl } from '@/lib/site'
import { buttonVariants } from '@/components/ui/button'
import { ShareCard } from '@/components/dashboard/ShareCard'
import { GuestTable } from '@/components/dashboard/GuestTable'
import { SongList } from '@/components/dashboard/SongList'
import { PhotoGrid } from '@/components/dashboard/PhotoGrid'
import { FlashToast } from '@/components/dashboard/FlashToast'

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params
  const event = await getOwnedEvent(id)
  return { title: event.title }
}

export default async function ManageEventPage(props: { params: Promise<{ id: string }>; searchParams: Promise<{ toast?: string }> }) {
  const { id } = await props.params
  const { toast } = await props.searchParams
  const { supabase } = await requireUser()
  const event = await getOwnedEvent(id)
  const theme = normalizeTheme(event.theme_id)

  const [{ data: guests }, { data: songs }, { data: photos }] = await Promise.all([
    supabase.from('guests').select('*').eq('event_id', event.id).order('created_at', { ascending: false }),
    supabase.from('song_requests').select('*').eq('event_id', event.id).order('created_at', { ascending: false }),
    supabase.from('photos').select('*').eq('event_id', event.id).order('created_at', { ascending: false }),
  ])
  const g = (guests ?? []) as GuestRow[]
  const s = summarize(g)

  const inviteUrl = `${await requestBaseUrl()}/invite/${event.unique_token}`
  const qrSvg = await QRCode.toString(inviteUrl, { type: 'svg', margin: 1, color: { dark: '#10284A', light: '#FFFFFF' }, errorCorrectionLevel: 'M' })
  const qrPng = await QRCode.toDataURL(inviteUrl, { width: 1024, margin: 2, color: { dark: '#10284A', light: '#FFFFFF' }, errorCorrectionLevel: 'M' })
  const acceptRate = s.responses ? Math.round((s.accepted / s.responses) * 100) : 0

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      {toast && <FlashToast code={toast} />}
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Mis eventos
      </Link>

      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-coral-soft px-2.5 py-1 text-xs font-semibold text-coral">{eventTypeLabel(event.event_type)}</span>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-balance text-ink sm:text-5xl">{event.title}</h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" /> {formatShortDate(event.event_date, theme.timezone)} · {theme.timezone.replace(/_/g, ' ')}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" /> {event.location}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/dashboard/event/${event.id}/settings`} className={buttonVariants({ variant: 'outline', className: 'h-10 px-3.5' })}>
            <Settings2 /> Ajustes
          </Link>
          <a href={inviteUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'outline', className: 'h-10 px-3.5' })}>
            <ExternalLink /> Ver invitación
          </a>
          <Link href={`/studio/${event.id}`} className={buttonVariants({ className: 'h-10 px-4' })}>
            <Paintbrush /> Personalizar diseño
          </Link>
        </div>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-6">
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Kpi label="Confirmados" value={s.accepted} tone="success" />
            <Kpi label="Asistentes" value={s.attendees} hint="con acompañantes" />
            <Kpi label="No asistirán" value={s.declined} tone="muted" />
            <Kpi label="Tasa de sí" value={`${acceptRate}%`} />
          </section>

          {s.responses > 0 && (
            <div className="rounded-2xl border bg-card p-4">
              <div className="mb-2 flex justify-between text-xs font-medium text-muted-foreground">
                <span>{s.responses} respuestas</span>
                <span>
                  {s.accepted} sí · {s.declined} no
                </span>
              </div>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${acceptRate}% confirmaron`}>
                <div className="bg-success" style={{ width: `${acceptRate}%` }} />
                <div className="bg-destructive/60" style={{ width: `${100 - acceptRate}%` }} />
              </div>
            </div>
          )}

          <GuestTable eventId={event.id} eventTitle={event.title} guests={g} />

          <div className="grid gap-6 xl:grid-cols-2">
            {event.allow_songs ? (
              <SongList eventId={event.id} songs={(songs ?? []) as SongRow[]} />
            ) : (
              <Disabled title="Playlist desactivada" href={`/dashboard/event/${event.id}/settings`} />
            )}
            {event.allow_photos ? (
              <PhotoGrid eventId={event.id} photos={(photos ?? []) as PhotoRow[]} />
            ) : (
              <Disabled title="Galería desactivada" href={`/dashboard/event/${event.id}/settings`} />
            )}
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <ShareCard event={{ ...event, allow_photos: event.allow_photos, allow_songs: event.allow_songs }} theme={theme} inviteUrl={inviteUrl} qrSvg={qrSvg} qrPng={qrPng} />
        </aside>
      </div>
    </main>
  )
}

function Kpi({ label, value, hint, tone }: { label: string; value: number | string; hint?: string; tone?: 'success' | 'muted' }) {
  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={`mt-2 font-display text-4xl leading-none tabular-nums ${tone === 'success' ? 'text-success' : tone === 'muted' ? 'text-muted-foreground' : 'text-ink'}`}>{value}</p>
      {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

function Disabled({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
      <p className="font-medium text-muted-foreground">{title}</p>
      <Link href={href} className="mt-1 text-sm font-semibold text-coral hover:underline">
        Activar en ajustes
      </Link>
    </div>
  )
}
