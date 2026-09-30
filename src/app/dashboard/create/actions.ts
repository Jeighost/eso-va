'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { normalizeTheme, serializeTheme } from '@/lib/invitation/theme'
import { themeForEventType } from '@/lib/invitation/presets'
import { parseEventForm } from '@/lib/event-form'
import type { EventFormState } from '@/components/dashboard/EventForm'

export async function createEvent(_: EventFormState, fd: FormData): Promise<EventFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const parsed = parseEventForm(fd)
  if (!parsed.ok) return { error: parsed.error }
  const { timezone, language, ...columns } = parsed.value

  const theme = themeForEventType(columns.event_type, { timezone, language })
  const { data, error } = await supabase
    .from('events')
    .insert({ ...columns, user_id: user.id, theme_id: serializeTheme(normalizeTheme(theme)) })
    .select('id')
    .single()

  if (error || !data) {
    console.error('Create event failed:', error?.message)
    return { error: 'No pudimos crear el evento. Inténtalo de nuevo.' }
  }

  revalidatePath('/dashboard')
  redirect(`/studio/${data.id}?welcome=1`)
}
