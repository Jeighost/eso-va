import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import InviteClient from './InviteClient'

// Metadatos para WhatsApp y Redes Sociales
export async function generateMetadata(props: { params: Promise<{ token: string }> }) {
  const params = await props.params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('title, location, event_date')
    .eq('unique_token', params.token)
    .single()

  if (!event) return { title: 'Invitación no encontrada' }

  return {
    title: `¡Estás invitado a ${event.title}!`,
    description: `Acompáñanos el ${new Date(event.event_date).toLocaleDateString()} en ${event.location}.`,
    openGraph: {
      title: `¡Estás invitado a ${event.title}!`,
      description: `Te esperamos el ${new Date(event.event_date).toLocaleDateString()}. ¡Confirma tu asistencia!`,
      images: ['/default-invite-bg.jpg'],
    }
  }
}

export default async function InvitePage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('unique_token', params.token)
    .single()

  if (!event) notFound()

  let theme = {
    color: '#FF2600',
    font: 'Playfair Display',
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
      theme = { ...theme, ...JSON.parse(event.theme_id) }
    }
  } catch (e) {}

  const radiusMap: any = {
    'none': 'rounded-none',
    'md': 'rounded-md',
    'xl': 'rounded-xl',
    'full': 'rounded-3xl'
  }

  const FONT_MAP: Record<string, string> = {
    'sans': 'ui-sans-serif, system-ui, sans-serif',
    'serif': 'ui-serif, Georgia, serif',
    'mono': 'ui-monospace, SFMono-Regular, monospace',
    'Playfair Display': '"Playfair Display", serif',
    'Montserrat': '"Montserrat", sans-serif',
    'Dancing Script': '"Dancing Script", cursive',
    'Cinzel': '"Cinzel", serif',
    'Great Vibes': '"Great Vibes", cursive',
    'Lato': '"Lato", sans-serif',
    'Pacifico': '"Pacifico", cursive',
    'Oswald': '"Oswald", sans-serif'
  }

  const fontFamily = FONT_MAP[theme.font] || FONT_MAP['sans']

  return (
    <div 
      className="min-h-screen flex flex-col items-center py-12 px-4 relative overflow-hidden bg-slate-50"
      style={{ fontFamily }}
    >
      <InviteClient event={event} theme={theme} token={params.token} radiusMap={radiusMap} />
    </div>
  )
}
