import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'
import { contrastOn, normalizeTheme } from '@/lib/invitation/theme'
import { formatEventDate } from '@/lib/invitation/datetime'
import { inviteStrings, localeFor } from '@/lib/invitation/i18n'

export const alt = 'Invitación'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } })
  const { data: event } = await supabase.from('events').select('title, event_date, location, theme_id').eq('unique_token', token).maybeSingle()

  const theme = normalizeTheme(event?.theme_id)
  const t = inviteStrings(theme.language)
  const d = event ? formatEventDate(event.event_date, localeFor(theme.language), theme.timezone) : null
  const title = event ? theme.customTitle || event.title : 'Eso Va'
  const photo = /^https:\/\/.+\.(jpe?g|png|webp)(\?|$)/i.test(theme.coverImage) || theme.coverImage.startsWith('https://images.unsplash.com/') ? theme.coverImage : ''
  const onAccent = contrastOn(theme.accent)

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: theme.cardBg, color: theme.textColor }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 72px', gap: 18 }}>
          <div style={{ fontSize: 22, letterSpacing: 8, textTransform: 'uppercase', color: theme.accent, fontWeight: 700 }}>{theme.eyebrow || t.invited}</div>
          <div style={{ fontSize: title.length > 28 ? 64 : 84, lineHeight: 1.02, fontWeight: 700, letterSpacing: -1.5 }}>{title}</div>
          <div style={{ width: 90, height: 4, background: theme.accent, borderRadius: 4, margin: '10px 0' }} />
          {d && (
            <div style={{ fontSize: 30, display: 'flex', opacity: 0.8 }}>
              {d.weekday} · {d.date} · {d.time}
            </div>
          )}
          {event?.location && <div style={{ fontSize: 26, opacity: 0.65, display: 'flex' }}>{event.location}</div>}
        </div>
        {photo ? (
          <img src={photo} alt="" width={440} height={630} style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 400, background: theme.accent, color: onAccent, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 30, letterSpacing: 6, textTransform: 'uppercase', opacity: 0.85 }}>{d?.month ?? ''}</div>
            <div style={{ fontSize: 190, fontWeight: 700, lineHeight: 1 }}>{d?.day ?? '✓'}</div>
            <div style={{ fontSize: 30, letterSpacing: 6, opacity: 0.85 }}>{d?.year ?? ''}</div>
          </div>
        )}
      </div>
    ),
    size
  )
}
