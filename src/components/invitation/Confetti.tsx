'use client'

import { useMemo } from 'react'

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

/** Lightweight CSS confetti burst. Deterministic per mount so it doesn't reshuffle on re-render. */
export function Confetti({ colors, count = 60 }: { colors: string[]; count?: number }) {
  const pieces = useMemo(() => {
    const rnd = seeded(7)
    return Array.from({ length: count }, (_, i) => ({
      left: rnd() * 100,
      delay: rnd() * 0.6,
      duration: 2.4 + rnd() * 1.8,
      dx: (rnd() - 0.5) * 160,
      size: 6 + rnd() * 6,
      round: rnd() > 0.6,
      color: colors[i % colors.length],
    }))
  }, [colors, count])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.round ? p.size : p.size * 0.4,
              borderRadius: p.round ? '999px' : '2px',
              background: p.color,
              animation: `confetti-fall ${p.duration}s cubic-bezier(.25,.6,.4,1) ${p.delay}s both`,
              '--dx': `${p.dx}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
