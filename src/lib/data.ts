import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export type EventRow = {
  id: string
  user_id: string
  title: string
  event_type: string | null
  event_date: string
  location: string | null
  allow_photos: boolean | null
  allow_songs: boolean | null
  theme_id: string | null
  unique_token: string
  created_at: string
}

export type GuestRow = { id: string; event_id: string; name: string; phone: string | null; status: string; plus_ones: number | null; created_at?: string }
export type SongRow = { id: string; event_id: string; song_title: string; artist: string | null; suggested_by: string; created_at?: string }
export type PhotoRow = { id: string; event_id: string; photo_url: string; uploaded_by: string; created_at?: string }

/** Authenticated user for dashboard routes (redirects to /login otherwise). Memoized per request. */
export const requireUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
})

export const getProfileName = cache(async () => {
  const { supabase, user } = await requireUser()
  const { data } = await supabase.from('profiles').select('name').eq('id', user.id).maybeSingle()
  return (data?.name as string | undefined) || (user.user_metadata?.name as string | undefined) || user.email?.split('@')[0] || ''
})

export const getOwnedEvent = cache(async (id: string) => {
  const { supabase, user } = await requireUser()
  const { data } = await supabase.from('events').select('*').eq('id', id).eq('user_id', user.id).maybeSingle()
  if (!data) redirect('/dashboard')
  return data as EventRow
})

export function summarize(guests: Pick<GuestRow, 'status' | 'plus_ones'>[]) {
  let accepted = 0
  let declined = 0
  let attendees = 0
  for (const g of guests) {
    if (g.status === 'accepted') {
      accepted++
      attendees += 1 + (g.plus_ones ?? 0)
    } else if (g.status === 'declined') declined++
  }
  return { responses: guests.length, accepted, declined, attendees }
}
