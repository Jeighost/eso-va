'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { normalizeTheme, serializeTheme } from '@/lib/invitation/theme'
import { parseEventForm } from '@/lib/event-form'
import type { EventFormState } from '@/components/dashboard/EventForm'

type Result = { ok: true } | { ok: false; error: string }

async function owner(eventId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: event } = await supabase.from('events').select('id, theme_id, unique_token').eq('id', eventId).eq('user_id', user.id).maybeSingle()
  return { supabase, user, event }
}

function refresh(eventId: string, token?: string) {
  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/event/${eventId}`)
  if (token) revalidatePath(`/invite/${token}`)
}

export async function updateEvent(eventId: string, _: EventFormState, fd: FormData): Promise<EventFormState> {
  const { supabase, user, event } = await owner(eventId)
  if (!event) return { error: 'Evento no encontrado.' }

  const parsed = parseEventForm(fd)
  if (!parsed.ok) return { error: parsed.error }
  const { timezone, language, ...columns } = parsed.value
  const theme = normalizeTheme({ ...normalizeTheme(event.theme_id), timezone, language })

  const { error } = await supabase
    .from('events')
    .update({ ...columns, theme_id: serializeTheme(theme) })
    .eq('id', eventId)
    .eq('user_id', user.id)
  if (error) {
    console.error('Update event failed:', error.message)
    return { error: 'No pudimos guardar los cambios.' }
  }
  refresh(eventId, event.unique_token)
  redirect(`/dashboard/event/${eventId}?toast=saved`)
}

export async function saveTheme(eventId: string, themeJson: string): Promise<Result> {
  const { supabase, user, event } = await owner(eventId)
  if (!event) return { ok: false, error: 'Evento no encontrado.' }

  let parsed: unknown
  try {
    parsed = JSON.parse(themeJson)
  } catch {
    return { ok: false, error: 'Diseño inválido.' }
  }
  const { error } = await supabase
    .from('events')
    .update({ theme_id: serializeTheme(normalizeTheme(parsed)) })
    .eq('id', eventId)
    .eq('user_id', user.id)
  if (error) {
    console.error('Save theme failed:', error.message)
    return { ok: false, error: 'No pudimos guardar el diseño.' }
  }
  refresh(eventId, event.unique_token)
  return { ok: true }
}

export async function deleteEvent(eventId: string): Promise<Result> {
  const { supabase, user, event } = await owner(eventId)
  if (!event) return { ok: false, error: 'Evento no encontrado.' }

  // Remove dependants first in case the schema lacks ON DELETE CASCADE.
  await supabase.from('guests').delete().eq('event_id', eventId)
  await supabase.from('song_requests').delete().eq('event_id', eventId)
  await supabase.from('photos').delete().eq('event_id', eventId)
  const { error } = await supabase.from('events').delete().eq('id', eventId).eq('user_id', user.id)
  if (error) {
    console.error('Delete event failed:', error.message)
    return { ok: false, error: 'No pudimos eliminar el evento.' }
  }
  revalidatePath('/dashboard')
  redirect('/dashboard?toast=deleted')
}

const TABLES = { guest: 'guests', song: 'song_requests', photo: 'photos' } as const

export async function deleteItem(eventId: string, kind: keyof typeof TABLES, itemId: string): Promise<Result> {
  const { supabase, event } = await owner(eventId)
  if (!event) return { ok: false, error: 'Evento no encontrado.' }
  const { error, count } = await supabase.from(TABLES[kind]).delete({ count: 'exact' }).eq('id', itemId).eq('event_id', eventId)
  if (error || count === 0) {
    if (error) console.error(`Delete ${kind} failed:`, error.message)
    return { ok: false, error: 'No se pudo eliminar. Verifica los permisos de la base de datos.' }
  }
  refresh(eventId, event.unique_token)
  return { ok: true }
}
