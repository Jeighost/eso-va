'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function submitRsvp(formData: FormData) {
  const supabase = await createClient()

  const event_id = formData.get('event_id') as string
  const token = formData.get('token') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const status = formData.get('status') as string
  const plus_ones = parseInt((formData.get('plus_ones') as string) || '0', 10)

  const { error } = await supabase.from('guests').insert({
    event_id,
    name,
    phone,
    status,
    plus_ones
  })

  if (error) {
    console.error('Error RSVing:', error.message)
    // Se podría manejar mejor, pero por ahora recargamos
  }

  revalidatePath(`/invite/${token}`)
}

export async function submitSong(formData: FormData) {
  const supabase = await createClient()
  const event_id = formData.get('event_id') as string
  const token = formData.get('token') as string
  const song_title = formData.get('song_title') as string
  const artist = formData.get('artist') as string
  const suggested_by = formData.get('suggested_by') as string

  await supabase.from('song_requests').insert({
    event_id,
    song_title,
    artist,
    suggested_by
  })

  revalidatePath(`/invite/${token}`)
}

export async function submitPhoto(eventId: string, token: string, photoUrl: string, uploadedBy: string) {
  const supabase = await createClient()
  await supabase.from('photos').insert({
    event_id: eventId,
    photo_url: photoUrl,
    uploaded_by: uploadedBy
  })
  
  revalidatePath(`/invite/${token}`)
}
