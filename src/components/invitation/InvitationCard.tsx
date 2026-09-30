'use client'

import Link from 'next/link'
import { CalendarPlus, Clock, Gift, MapPin, Shirt } from 'lucide-react'
import { alpha, contrastOn, type InvitationTheme } from '@/lib/invitation/theme'
import { fontFamily, isScript } from '@/lib/invitation/fonts'
import { inviteStrings, localeFor } from '@/lib/invitation/i18n'
import { buildIcs, formatEventDate, googleCalendarUrl, mapsUrl } from '@/lib/invitation/datetime'
import { Divider, FrameOverlay, LogoMark, patternBackground } from './artwork'
import { Countdown } from './Countdown'
import { ActionButton, GuestPanel } from './GuestPanel'

export type InviteEvent = {
  id: string
  title: string
  event_date: string
  location: string | null
  allow_photos: boolean | null
  allow_songs: boolean | null
}

export type Palette = {
  accent: string
  onAccent: string
  text: string
  muted: string
  line: string
  soft: string
  card: string
  field: string
  ring: string
}

export const RADIUS_PX = { none: 0, md: 12, xl: 24, full: 40 } as const
const SHADOW = {
  none: 'none',
  soft: '0 40px 80px -40px rgba(20,16,10,.35), 0 12px 24px -12px rgba(20,16,10,.12)',
  strong: '0 60px 120px -30px rgba(0,0,0,.6), 0 20px 40px -20px rgba(0,0,0,.35)',
} as const
const COVER_H = { sm: 180, md: 250, lg: 340 } as const
const COVER_POS = { top: 'center top', center: 'center', bottom: 'center bottom' } as const

export function paletteFor(theme: InvitationTheme): Palette {
  const dark = contrastOn(theme.cardBg) === '#FFFFFF'
  return {
    accent: theme.accent,
    onAccent: contrastOn(theme.accent),
    text: theme.textColor,
    muted: alpha(theme.textColor, 0.66),
    line: alpha(theme.textColor, 0.16),
    soft: alpha(theme.accent, dark ? 0.18 : 0.1),
    card: theme.cardBg,
    field: dark ? alpha('#FFFFFF', 0.04) : alpha('#FFFFFF', 0.7),
    ring: alpha(theme.accent, 0.35),
  }
}

export function pageBackground(theme: InvitationTheme): React.CSSProperties {
  return {
    background: theme.pageGradient
      ? `radial-gradient(120% 80% at 50% 0%, ${theme.pageBg} 0%, ${theme.pageBg2} 100%)`
      : theme.pageBg,
  }
}

/** Full-bleed page background with the decorative pattern layer. */
export function InvitationBackdrop({ theme, className = '' }: { theme: InvitationTheme; className?: string }) {
  const patternColor = contrastOn(theme.pageBg) === '#FFFFFF' ? theme.accent : alpha(theme.accent, 1)
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} style={pageBackground(theme)} aria-hidden="true">
      {theme.pattern !== 'none' && (
        <div className="absolute inset-0" style={{ ...patternBackground(theme.pattern, patternColor), opacity: theme.patternOpacity / 100 }} />
      )}
    </div>
  )
}

type Props = {
  event: InviteEvent
  theme: InvitationTheme
  token?: string
  mode?: 'live' | 'preview' | 'thumbnail'
  inviteUrl?: string
}

export function InvitationCard({ event, theme, token = '', mode = 'live', inviteUrl = '' }: Props) {
  const t = inviteStrings(theme.language)
  const locale = localeFor(theme.language)
  const p = paletteFor(theme)
  const radius = RADIUS_PX[theme.radius]
  const title = theme.customTitle || event.title
  const date = formatEventDate(event.event_date, locale, theme.timezone)
  const location = event.location ?? ''
  const thumb = mode === 'thumbnail'
  const animate = theme.animate && !thumb
  const script = isScript(theme.headingFont)
  const titleSize = `calc(${script ? 3.1 : 2.45}rem * ${theme.titleScale / 100})`
  const align = theme.align === 'left' ? 'text-left items-start' : 'text-center items-center'
  const hasCover = !!theme.coverImage
  const deadlineLabel = theme.rsvpDeadline
    ? new Intl.DateTimeFormat(locale, { timeZone: 'UTC', day: 'numeric', month: 'long' }).format(new Date(`${theme.rsvpDeadline}T12:00:00Z`))
    : ''

  let step = 0
  const rise = (): React.CSSProperties =>
    animate ? { animation: `rise .9s cubic-bezier(.22,1,.36,1) ${0.12 + step++ * 0.09}s both` } : {}

  const rootStyle = {
    '--inv-heading': fontFamily(theme.headingFont),
    '--inv-body': fontFamily(theme.bodyFont),
    background: p.card,
    color: p.text,
    fontFamily: 'var(--inv-body)',
    borderRadius: radius,
    boxShadow: SHADOW[theme.shadow],
  } as React.CSSProperties

  const eyebrow = (
    <p className="text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: theme.layout === 'editorial' && hasCover ? '#fff' : p.accent, ...rise() }}>
      {theme.eyebrow || t.invited}
    </p>
  )

  const hosts = theme.hosts ? (
    <p className="text-[15px] italic" style={{ color: theme.layout === 'editorial' && hasCover ? 'rgba(255,255,255,.9)' : p.muted, ...rise() }}>
      {theme.hosts}
    </p>
  ) : null

  const heading = (light = false) => (
    <h1
      className="text-balance leading-[1.05]"
      style={{
        fontFamily: 'var(--inv-heading)',
        fontSize: titleSize,
        fontWeight: script ? 400 : 500,
        color: light ? '#fff' : p.text,
        letterSpacing: theme.headingFont === 'cinzel' ? '0.04em' : script ? 0 : '-0.01em',
        ...rise(),
      }}
    >
      {title}
    </h1>
  )

  const divider = (light = false) =>
    theme.ornament !== 'none' ? (
      <Divider kind={theme.ornament} className="h-6 w-48 max-w-full" style={{ color: light ? '#fff' : p.accent, ...rise() }} />
    ) : null

  const dateBlock = (
    <div className={`flex w-full flex-col gap-3 ${align}`} style={rise()}>
      <div className={`flex items-center gap-4 ${theme.align === 'left' ? '' : 'justify-center'}`}>
        <span className="min-w-[5.5rem] border-y py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ borderColor: p.line, color: p.muted }} suppressHydrationWarning>
          {date.weekday}
        </span>
        <span className="text-5xl leading-none" style={{ fontFamily: 'var(--inv-heading)', color: p.accent }} suppressHydrationWarning>
          {date.day}
        </span>
        <span className="min-w-[5.5rem] border-y py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ borderColor: p.line, color: p.muted }} suppressHydrationWarning>
          {date.month} {date.year}
        </span>
      </div>
      <p className="flex items-center gap-1.5 text-sm" style={{ color: p.muted }} suppressHydrationWarning>
        <Clock className="size-3.5" style={{ color: p.accent }} /> {date.time}
      </p>
      {location && (
        <p className="flex max-w-sm items-start gap-1.5 text-[15px] leading-snug" style={{ color: p.text }}>
          <MapPin className="mt-0.5 size-4 shrink-0" style={{ color: p.accent }} /> <span>{location}</span>
        </p>
      )}
    </div>
  )

  const message = theme.message ? (
    <p className="max-w-md whitespace-pre-line text-[15px] leading-relaxed text-pretty" style={{ color: p.muted, fontStyle: 'italic', ...rise() }}>
      {theme.message}
    </p>
  ) : null

  const details = !thumb && (
    <div className="flex w-full flex-col gap-6">
      {theme.showCountdown && (
        <div style={{ borderRadius: Math.min(radius, 14), ...rise() }}>
          <Countdown date={event.event_date} hours={theme.durationHours} t={t} accent={p.accent} line={p.line} muted={p.muted} />
        </div>
      )}

      {theme.showItinerary && theme.itinerary.filter((i) => i.label).length > 0 && (
        <Section title={t.schedule} p={p} style={rise()} align={theme.align}>
          <ol className="relative space-y-3 text-left">
            {theme.itinerary
              .filter((i) => i.label)
              .map((item, i) => (
                <li key={i} className="flex items-baseline gap-4">
                  <span className="w-14 shrink-0 text-right text-sm font-semibold tabular-nums" style={{ color: p.accent }}>
                    {item.time}
                  </span>
                  <span className="relative pl-4 text-[15px]" style={{ color: p.text }}>
                    <span className="absolute top-2 left-0 size-1.5 rounded-full" style={{ background: p.accent }} />
                    {item.label}
                  </span>
                </li>
              ))}
          </ol>
        </Section>
      )}

      {(theme.dressCode || theme.giftInfo || theme.giftUrl) && (
        <div className="grid gap-3 sm:grid-cols-2" style={rise()}>
          {theme.dressCode && (
            <InfoTile icon={<Shirt className="size-4" />} title={t.dressCode} p={p} radius={radius}>
              {theme.dressCode}
            </InfoTile>
          )}
          {(theme.giftInfo || theme.giftUrl) && (
            <InfoTile icon={<Gift className="size-4" />} title={t.gifts} p={p} radius={radius}>
              {theme.giftInfo}
              {theme.giftUrl && (
                <a href={theme.giftUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block font-semibold underline-offset-4 hover:underline" style={{ color: p.accent }}>
                  {t.viewRegistry} →
                </a>
              )}
            </InfoTile>
          )}
        </div>
      )}

      {(theme.showCalendar || (theme.showMap && location)) && (
        <div className="grid grid-cols-2 gap-2.5" style={rise()}>
          {theme.showCalendar && (
            <CalendarMenu
              t={t}
              p={p}
              radius={radius}
              ics={() =>
                buildIcs({
                  uid: event.id,
                  title,
                  start: event.event_date,
                  hours: theme.durationHours,
                  location,
                  description: theme.message || title,
                  url: inviteUrl,
                })
              }
              google={googleCalendarUrl({ title, start: event.event_date, hours: theme.durationHours, location, details: inviteUrl })}
              full={!(theme.showMap && location)}
            />
          )}
          {theme.showMap && location && (
            <a
              href={mapsUrl(location, theme.mapUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex h-11 items-center justify-center gap-2 border text-sm font-semibold transition-colors hover:brightness-95 ${theme.showCalendar ? '' : 'col-span-2'}`}
              style={{ borderColor: p.line, color: p.text, borderRadius: Math.min(radius, 999), background: p.field }}
            >
              <MapPin className="size-4" style={{ color: p.accent }} /> {t.openMap}
            </a>
          )}
        </div>
      )}
    </div>
  )

  const body = (
    <div className={`relative z-10 flex flex-col gap-5 px-7 sm:px-10 ${align}`}>
      {theme.layout !== 'editorial' && (
        <>
          {eyebrow}
          {hosts}
          {heading()}
          {divider()}
        </>
      )}
      {dateBlock}
      {message}
      {details}
    </div>
  )

  const coverImg = (h: number, extra: React.CSSProperties = {}, children?: React.ReactNode) => (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: thumb ? Math.round(h * 0.75) : h, backgroundImage: `url("${theme.coverImage}")`, backgroundSize: 'cover', backgroundPosition: COVER_POS[theme.coverFocus], ...extra }}
      role="img"
      aria-label={title}
    >
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,${theme.coverOverlay / 100}) 0%, rgba(0,0,0,${theme.coverOverlay / 250}) 60%, transparent 100%)` }} />
      {children}
    </div>
  )

  let top: React.ReactNode = null
  if (hasCover) {
    const h = COVER_H[theme.coverHeight]
    if (theme.layout === 'classic') {
      top = coverImg(h)
    } else if (theme.layout === 'editorial') {
      top = coverImg(
        h + 150,
        {},
        <div className={`absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 px-7 pb-8 sm:px-10 ${align}`}>
          {eyebrow}
          {heading(true)}
          {hosts}
          {divider(true)}
        </div>
      )
    } else if (theme.layout === 'framed') {
      top = (
        <div className="px-10 pt-12">
          <div className="mx-auto w-full max-w-[260px] overflow-hidden" style={{ borderRadius: '999px 999px 12px 12px', boxShadow: `0 0 0 6px ${p.card}, 0 0 0 7px ${p.line}` }}>
            {coverImg(Math.round(h * 1.1))}
          </div>
        </div>
      )
    }
  }
  const editorialNoCover = theme.layout === 'editorial' && !hasCover

  return (
    <article className="relative w-full overflow-hidden" style={rootStyle} lang={theme.language}>
      <FrameOverlay kind={theme.frame} color={p.accent} inset={theme.layout === 'framed' ? 14 : 10} radius={radius} />
      {top}
      {editorialNoCover && (
        <div className={`relative z-10 flex flex-col gap-3 px-7 pt-14 sm:px-10 ${align}`}>
          {eyebrow}
          {heading()}
          {hosts}
          {divider()}
        </div>
      )}
      <div className={hasCover && theme.layout === 'classic' ? 'pt-8' : theme.layout === 'minimal' ? 'pt-14' : 'pt-10'}>{body}</div>

      {theme.layout === 'minimal' && hasCover && !thumb && (
        <div className="mt-8 px-7 sm:px-10">{coverImg(COVER_H[theme.coverHeight], { borderRadius: Math.min(radius, 16) })}</div>
      )}

      {!thumb ? (
        <div className="relative z-10 mt-8 border-t pt-7" style={{ borderColor: p.line }}>
          <GuestPanel
            eventId={event.id}
            allowSongs={!!event.allow_songs}
            allowPhotos={!!event.allow_photos}
            theme={theme}
            t={t}
            token={token}
            mode={mode === 'live' ? 'live' : 'preview'}
            palette={p}
            radius={radius}
            deadlineLabel={deadlineLabel}
          />
        </div>
      ) : (
        <div className="relative z-10 px-7 pt-6 pb-9 sm:px-10">
          <ActionButton palette={p} radius={radius} style={theme.buttonStyle} tabIndex={-1} type="button">
            {theme.rsvpButtonText || t.send}
          </ActionButton>
        </div>
      )}
      {!thumb && <div className="h-4" />}
    </article>
  )
}

function Section({ title, children, p, style, align }: { title: string; children: React.ReactNode; p: Palette; style?: React.CSSProperties; align: InvitationTheme['align'] }) {
  return (
    <section className="w-full" style={style}>
      <h2 className={`mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] ${align === 'left' ? '' : 'justify-center'}`} style={{ color: p.accent }}>
        <span className="h-px w-8" style={{ background: p.line }} />
        {title}
        <span className="h-px w-8" style={{ background: p.line }} />
      </h2>
      <div className={align === 'left' ? '' : 'flex justify-center'}>{children}</div>
    </section>
  )
}

function InfoTile({ icon, title, children, p, radius }: { icon: React.ReactNode; title: string; children: React.ReactNode; p: Palette; radius: number }) {
  return (
    <div className="flex gap-3 border p-4 text-left" style={{ borderColor: p.line, borderRadius: Math.min(radius, 16), background: p.field }}>
      <span className="grid size-8 shrink-0 place-items-center rounded-full" style={{ background: p.soft, color: p.accent }}>
        {icon}
      </span>
      <div className="min-w-0 text-sm leading-relaxed" style={{ color: p.muted }}>
        <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: p.text }}>
          {title}
        </p>
        <div className="whitespace-pre-line break-words">{children}</div>
      </div>
    </div>
  )
}

function CalendarMenu({ t, p, radius, ics, google, full }: { t: ReturnType<typeof inviteStrings>; p: Palette; radius: number; ics: () => string; google: string; full: boolean }) {
  const download = () => {
    const blob = new Blob([ics()], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'evento.ics'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <details className={`group relative ${full ? 'col-span-2' : ''}`}>
      <summary
        className="inline-flex h-11 w-full cursor-pointer list-none items-center justify-center gap-2 border text-sm font-semibold transition-colors hover:brightness-95 [&::-webkit-details-marker]:hidden"
        style={{ borderColor: p.line, color: p.text, borderRadius: Math.min(radius, 999), background: p.field }}
      >
        <CalendarPlus className="size-4" style={{ color: p.accent }} /> {t.addCalendar}
      </summary>
      <div className="absolute bottom-full left-0 z-30 mb-2 w-60 overflow-hidden rounded-xl border bg-white p-1 text-sm text-neutral-800 shadow-xl">
        <a href={google} target="_blank" rel="noopener noreferrer" className="block rounded-lg px-3 py-2.5 hover:bg-neutral-100">
          {t.googleCalendar}
        </a>
        <button type="button" onClick={download} className="block w-full rounded-lg px-3 py-2.5 text-left hover:bg-neutral-100">
          {t.appleCalendar}
        </button>
      </div>
    </details>
  )
}

export function PoweredBy({ theme }: { theme: InvitationTheme }) {
  const t = inviteStrings(theme.language)
  const onDark = contrastOn(theme.pageBg) === '#FFFFFF'
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur transition-opacity hover:opacity-100"
      style={{ color: onDark ? 'rgba(255,255,255,.75)' : 'rgba(0,0,0,.55)', background: onDark ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.6)', opacity: 0.9 }}
    >
      {t.poweredBy} <LogoMark className="size-4" /> <span className="font-semibold">Eso Va</span>
    </Link>
  )
}
