import { isValidTimeZone, LANGUAGES, type Language } from '@/lib/invitation/theme'
import { EVENT_TYPES } from '@/lib/invitation/presets'
import { zonedLocalToUtc } from '@/lib/invitation/datetime'

export type ParsedEvent = {
  title: string
  event_type: string
  event_date: string
  location: string
  allow_photos: boolean
  allow_songs: boolean
  timezone: string
  language: Language
}

export function parseEventForm(fd: FormData): { ok: true; value: ParsedEvent } | { ok: false; error: string } {
  const title = String(fd.get('title') ?? '').trim().slice(0, 140)
  const typeRaw = String(fd.get('event_type') ?? '')
  const event_type = EVENT_TYPES.some((t) => t.id === typeRaw) ? typeRaw : 'otro'
  const location = String(fd.get('location') ?? '').trim().slice(0, 240)
  const tzRaw = String(fd.get('timezone') ?? '')
  const timezone = isValidTimeZone(tzRaw) ? tzRaw : 'UTC'
  const langRaw = String(fd.get('language') ?? 'es')
  const language = (LANGUAGES as readonly string[]).includes(langRaw) ? (langRaw as Language) : 'es'
  const date = zonedLocalToUtc(String(fd.get('local_date') ?? ''), timezone)

  if (!title) return { ok: false, error: 'Escribe el nombre del evento.' }
  if (!location) return { ok: false, error: 'Indica el lugar del evento.' }
  if (!date) return { ok: false, error: 'Elige una fecha y hora válidas.' }

  return {
    ok: true,
    value: {
      title,
      event_type,
      location,
      timezone,
      language,
      event_date: date.toISOString(),
      allow_photos: fd.get('allow_photos') === 'on',
      allow_songs: fd.get('allow_songs') === 'on',
    },
  }
}

