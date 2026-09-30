/**
 * Time-zone helpers built on Intl only (no dependencies).
 *
 * Event dates are stored as UTC ISO strings. The host picks a wall-clock time
 * in the event's time zone, so we convert both ways explicitly instead of
 * relying on whatever zone the server or the guest's browser runs in.
 */

function partsInZone(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const out: Record<string, number> = {}
  for (const p of fmt.formatToParts(date)) {
    if (p.type !== 'literal') out[p.type] = Number(p.value)
  }
  return out as { year: number; month: number; day: number; hour: number; minute: number; second: number }
}

function offsetMs(date: Date, timeZone: string) {
  const p = partsInZone(date, timeZone)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return asUtc - Math.floor(date.getTime() / 1000) * 1000
}

/** "2026-05-10T18:30" interpreted in `timeZone` → Date (UTC instant). */
export function zonedLocalToUtc(local: string, timeZone: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local)
  if (!m) return null
  const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5])
  let result = guess - offsetMs(new Date(guess), timeZone)
  // Second pass handles DST transitions.
  result = guess - offsetMs(new Date(result), timeZone)
  return new Date(result)
}

/** UTC instant → "YYYY-MM-DDTHH:mm" wall-clock in `timeZone` (for datetime-local inputs). */
export function utcToZonedLocal(iso: string | Date, timeZone: string) {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  if (Number.isNaN(d.getTime())) return ''
  const p = partsInZone(d, timeZone)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`
}

export function formatEventDate(iso: string, locale: string, timeZone: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { date: '', time: '', weekday: '', day: '', month: '', year: '' }
  const opts = { timeZone }
  return {
    date: new Intl.DateTimeFormat(locale, { ...opts, day: 'numeric', month: 'long', year: 'numeric' }).format(d),
    time: new Intl.DateTimeFormat(locale, { ...opts, hour: 'numeric', minute: '2-digit' }).format(d),
    weekday: new Intl.DateTimeFormat(locale, { ...opts, weekday: 'long' }).format(d),
    day: new Intl.DateTimeFormat(locale, { ...opts, day: '2-digit' }).format(d),
    month: new Intl.DateTimeFormat(locale, { ...opts, month: 'long' }).format(d),
    year: new Intl.DateTimeFormat(locale, { ...opts, year: 'numeric' }).format(d),
  }
}

export function formatShortDate(iso: string, timeZone: string, locale = 'es') {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat(locale, { timeZone, day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(d)
}

export function timeZoneLabel(timeZone: string, locale = 'es') {
  try {
    const name = new Intl.DateTimeFormat(locale, { timeZone, timeZoneName: 'shortOffset' })
      .formatToParts(new Date())
      .find((p) => p.type === 'timeZoneName')?.value
    return `${timeZone.replace(/_/g, ' ')}${name ? ` (${name})` : ''}`
  } catch {
    return timeZone
  }
}

/** Curated list shown first in pickers; the browser's full list follows. */
export const COMMON_TIME_ZONES = [
  'America/Mexico_City',
  'America/Bogota',
  'America/Lima',
  'America/Caracas',
  'America/Santiago',
  'America/Argentina/Buenos_Aires',
  'America/Sao_Paulo',
  'America/Guatemala',
  'America/Panama',
  'America/Santo_Domingo',
  'America/Puerto_Rico',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'Europe/Madrid',
  'Europe/Lisbon',
  'Europe/London',
  'Europe/Paris',
  'Europe/Rome',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Tokyo',
  'Australia/Sydney',
  'UTC',
]

export function allTimeZones(): string[] {
  const intl = Intl as unknown as { supportedValuesOf?: (k: string) => string[] }
  const all = intl.supportedValuesOf?.('timeZone') ?? []
  return Array.from(new Set([...COMMON_TIME_ZONES, ...all]))
}

function icsDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}
function icsEscape(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

export function buildIcs(opts: { uid: string; title: string; start: string; hours: number; location: string; description: string; url: string }) {
  const start = new Date(opts.start)
  const end = new Date(start.getTime() + opts.hours * 3600_000)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Eso Va//Invitaciones//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${opts.uid}@esova`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsEscape(opts.title)}`,
    `LOCATION:${icsEscape(opts.location)}`,
    `DESCRIPTION:${icsEscape(opts.description)}`,
    `URL:${opts.url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function googleCalendarUrl(opts: { title: string; start: string; hours: number; location: string; details: string }) {
  const start = new Date(opts.start)
  const end = new Date(start.getTime() + opts.hours * 3600_000)
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${icsDate(start)}/${icsDate(end)}`,
    location: opts.location,
    details: opts.details,
  })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

export function mapsUrl(location: string, custom?: string) {
  if (custom) return custom
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
}
