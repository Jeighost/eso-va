'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createEvent(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const event_type = formData.get('event_type') as string
  const event_date = formData.get('event_date') as string
  const location = formData.get('location') as string
  const allow_photos = formData.get('allow_photos') === 'on'
  const allow_songs = formData.get('allow_songs') === 'on'

  const { data, error } = await supabase.from('events').insert({
    user_id: user.id,
    title,
    event_type,
    event_date: new Date(event_date).toISOString(),
    location,
    allow_photos,
    allow_songs
  }).select().single()

  if (error) {
    console.error('Error creando evento:', error.message)
    return redirect(`/dashboard/create?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard', 'layout')
  redirect(`/dashboard`)
}
