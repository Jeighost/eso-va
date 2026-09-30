'use client'

import { useEffect, useState } from 'react'
import type { InviteStrings } from '@/lib/invitation/i18n'

function diff(target: number, now: number) {
  const ms = Math.max(0, target - now)
  return {
    ms,
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  }
}

export function Countdown({
  date,
  hours,
  t,
  accent,
  line,
  muted,
}: {
  date: string
  hours: number
  t: InviteStrings
  accent: string
  line: string
  muted: string
}) {
  const target = new Date(date).getTime()
  // Render placeholders on the server and first client pass to avoid hydration mismatches.
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setNow(Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (Number.isNaN(target)) return null

  if (now !== null && now >= target) {
    const over = now > target + hours * 3_600_000
    return (
      <p className="text-center text-sm font-semibold tracking-wide" style={{ color: accent }}>
        {over ? t.eventPassed : t.itsToday}
      </p>
    )
  }

  const d = now === null ? null : diff(target, now)
  const cells: [string, number | undefined][] = [
    [t.days, d?.days],
    [t.hours, d?.hours],
    [t.minutes, d?.minutes],
    [t.seconds, d?.seconds],
  ]

  return (
    <div className="grid grid-cols-4 gap-2" role="timer" aria-live="off">
      {cells.map(([label, value]) => (
        <div key={label} className="flex flex-col items-center rounded-[inherit] py-2.5" style={{ border: `1px solid ${line}` }}>
          <span className="text-2xl font-semibold tabular-nums leading-none" style={{ color: accent }}>
            {value === undefined ? '––' : String(value).padStart(2, '0')}
          </span>
          <span className="mt-1.5 text-[10px] uppercase tracking-[0.18em]" style={{ color: muted }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
