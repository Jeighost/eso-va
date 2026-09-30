'use client'

import type { InvitationTheme } from '@/lib/invitation/theme'
import { InvitationBackdrop, InvitationCard, type InviteEvent } from './InvitationCard'

const BASE_WIDTH = 420

/** A real, non-interactive render of an invitation, scaled to `width`. */
export function CardThumbnail({
  event,
  theme,
  width = 260,
  backdrop = false,
  className = '',
}: {
  event: InviteEvent
  theme: InvitationTheme
  width?: number
  backdrop?: boolean
  className?: string
}) {
  const card = (
    <div style={{ width: BASE_WIDTH, zoom: width / BASE_WIDTH }} inert>
      <InvitationCard event={event} theme={{ ...theme, animate: false }} mode="thumbnail" />
    </div>
  )
  if (!backdrop) return <div className={className}>{card}</div>
  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      <InvitationBackdrop theme={theme} />
      <div className="relative flex justify-center p-[8%]">{card}</div>
    </div>
  )
}
