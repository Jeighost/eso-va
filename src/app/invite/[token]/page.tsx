import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { normalizeTheme } from '@/lib/invitation/theme'
import { formatEventDate } from '@/lib/invitation/datetime'
import { inviteStrings, localeFor } from '@/lib/invitation/i18n'
import { requestBaseUrl } from '@/lib/site'
import { InvitationBackdrop, InvitationCard, PoweredBy } from '@/components/invitation/InvitationCard'

const getEvent = cache(async (token: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('id, title, event_date, location, allow_photos, allow_songs, theme_id')
    .eq('unique_token', token)
    .single()
  return data
})

export async function generateMetadata(props: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await props.params
  const event = await getEvent(token)
  if (!event) return { title: 'Invitación no encontrada', robots: { index: false } }

  const theme = normalizeTheme(event.theme_id)
  const t = inviteStrings(theme.language)
  const d = formatEventDate(event.event_date, localeFor(theme.language), theme.timezone)
  const title = theme.customTitle || event.title
  const description = `${d.weekday} ${d.date} · ${d.time}${event.location ? ` — ${event.location}` : ''}`

  return {
    title: { absolute: `${t.invited} ${title}` },
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${t.invited} ${title}`,
      description,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function InvitePage(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params
  const event = await getEvent(token)
  if (!event) notFound()

  const theme = normalizeTheme(event.theme_id)
  const inviteUrl = `${await requestBaseUrl()}/invite/${token}`

  return (
    <main className="relative isolate flex min-h-dvh flex-col items-center px-3 py-8 sm:px-6 sm:py-14">
      <InvitationBackdrop theme={theme} className="fixed -z-10" />
      <div className="w-full max-w-[34rem]">
        <InvitationCard event={event} theme={theme} token={token} mode="live" inviteUrl={inviteUrl} />
      </div>
      <div className="mt-8">
        <PoweredBy theme={theme} />
      </div>
    </main>
  )
}
