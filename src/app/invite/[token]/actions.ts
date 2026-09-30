'use server'

import { createClient } from '@/utils/supabase/server'
import { normalizeTheme } from '@/lib/invitation/theme'
import { zonedLocalToUtc } from '@/lib/invitation/datetime'

export type ActionResult = { ok: true } | { ok: false; error: string }

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ').slice(0, max) : '')

async function eventForToken(token: string) {
  if (!/^[\w-]{4,128}$/.test(token)) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('id, allow_photos, allow_songs, theme_id')
    .eq('unique_token', token)
    .single()
  return data ? { supabase, event: data } : null
}

export async function submitRsvp(
  token: string,
  input: { name: string; phone?: string; status: string; plusOnes?: number }
): Promise<ActionResult> {
  const found = await eventForToken(token)
  if (!found) return { ok: false, error: 'not_found' }
  const { supabase, event } = found
  const theme = normalizeTheme(event.theme_id)

  if (theme.rsvpDeadline) {
    const deadline = zonedLocalToUtc(`${theme.rsvpDeadline}T23:59`, theme.timezone)
    if (deadline && Date.now() > deadline.getTime()) return { ok: false, error: 'closed' }
  }

  const name = clean(input.name, 120)
  const phone = clean(input.phone, 40)
  const status = input.status === 'accepted' || input.status === 'declined' ? input.status : null
  if (name.length < 2 || !status) return { ok: false, error: 'invalid' }

  const plus = Number.isFinite(input.plusOnes) ? Math.trunc(input.plusOnes as number) : 0
  const plus_ones = status === 'accepted' ? Math.min(Math.max(plus, 0), theme.maxPlusOnes) : 0

  const { error } = await supabase.from('guests').insert({ event_id: event.id, name, phone: phone || null, status, plus_ones })
  if (error) {
    console.error('RSVP insert failed:', error.message)
    return { ok: false, error: 'db' }
  }
  return { ok: true }
}

export async function submitSong(token: string, input: { title: string; artist?: string; by: string }): Promise<ActionResult> {
  const found = await eventForToken(token)
  if (!found) return { ok: false, error: 'not_found' }
  const { supabase, event } = found
  if (!event.allow_songs) return { ok: false, error: 'disabled' }

  const song_title = clean(input.title, 140)
  const artist = clean(input.artist, 140)
  const suggested_by = clean(input.by, 80)
  if (!song_title || !suggested_by) return { ok: false, error: 'invalid' }

  const { error } = await supabase.from('song_requests').insert({ event_id: event.id, song_title, artist: artist || null, suggested_by })
  if (error) {
    console.error('Song insert failed:', error.message)
    return { ok: false, error: 'db' }
  }
  return { ok: true }
}

export async function submitPhoto(token: string, photoUrl: string, uploadedBy: string): Promise<ActionResult> {
  const found = await eventForToken(token)
  if (!found) return { ok: false, error: 'not_found' }
  const { supabase, event } = found
  if (!event.allow_photos) return { ok: false, error: 'disabled' }

  // Only accept files that live in this project's public gallery bucket.
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/`
  if (typeof photoUrl !== 'string' || !photoUrl.startsWith(base)) return { ok: false, error: 'invalid' }

  const uploaded_by = clean(uploadedBy, 80)
  if (!uploaded_by) return { ok: false, error: 'invalid' }

  const { error } = await supabase.from('photos').insert({ event_id: event.id, photo_url: photoUrl, uploaded_by })
  if (error) {
    console.error('Photo insert failed:', error.message)
    return { ok: false, error: 'db' }
  }
  return { ok: true }
}
