'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveTheme(eventId: string, themeConfig: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  // Guardamos el JSON de configuración dentro del campo theme_id que ya existe
  const { error } = await supabase
    .from('events')
    .update({ theme_id: themeConfig })
    .eq('id', eventId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/dashboard/event/${eventId}`)
  revalidatePath(`/invite/[token]`, 'page')
}
