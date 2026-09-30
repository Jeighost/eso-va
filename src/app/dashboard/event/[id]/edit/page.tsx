import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import EditorClient from './EditorClient'

export default async function EditThemePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!event) redirect('/dashboard')

  let initialTheme = {
    color: '#FF2600',
    font: 'serif',
    coverImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    pattern: 'none',
    cardBg: '#ffffff',
    customTitle: '',
    hosts: '',
    message: '',
    borderRadius: 'xl'
  }

  try {
    if (event.theme_id && event.theme_id.startsWith('{')) {
      initialTheme = { ...initialTheme, ...JSON.parse(event.theme_id) }
    }
  } catch (e) {}

  return (
    <EditorClient event={event} initialTheme={initialTheme} />
  )
}
