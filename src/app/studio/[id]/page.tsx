import type { Metadata } from 'next'
import { getOwnedEvent } from '@/lib/data'
import { normalizeTheme } from '@/lib/invitation/theme'
import { requestBaseUrl } from '@/lib/site'
import { StudioClient } from '@/components/studio/StudioClient'

export const metadata: Metadata = { title: 'Estudio de diseño', robots: { index: false } }

export default async function StudioPage(props: { params: Promise<{ id: string }>; searchParams: Promise<{ welcome?: string }> }) {
  const { id } = await props.params
  const { welcome } = await props.searchParams
  const event = await getOwnedEvent(id)
  const theme = normalizeTheme(event.theme_id)
  const inviteUrl = `${await requestBaseUrl()}/invite/${event.unique_token}`

  return (
    <StudioClient
      event={{
        id: event.id,
        title: event.title,
        event_date: event.event_date,
        location: event.location,
        allow_photos: event.allow_photos,
        allow_songs: event.allow_songs,
        unique_token: event.unique_token,
      }}
      initialTheme={theme}
      inviteUrl={inviteUrl}
      welcome={welcome === '1'}
    />
  )
}
