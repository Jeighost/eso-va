'use client'

import { useState, useTransition } from 'react'
import { Copy, Music2, Trash2 } from 'lucide-react'
import type { SongRow } from '@/lib/data'
import { deleteItem } from '@/app/dashboard/event/[id]/actions'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'

export function SongList({ eventId, songs }: { eventId: string; songs: SongRow[] }) {
  const [removed, setRemoved] = useState<Set<string>>(new Set())
  const [pending, startTransition] = useTransition()
  const list = songs.filter((s) => !removed.has(s.id))

  const copyAll = async () => {
    const text = list.map((s, i) => `${i + 1}. ${s.song_title}${s.artist ? ` — ${s.artist}` : ''}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      toast.add({ title: 'Playlist copiada', description: `${list.length} canciones listas para pegar.`, type: 'success' })
    } catch {
      toast.add({ title: 'No se pudo copiar', type: 'error' })
    }
  }

  const remove = (s: SongRow) =>
    startTransition(async () => {
      const res = await deleteItem(eventId, 'song', s.id)
      if (res.ok) setRemoved((r) => new Set(r).add(s.id))
      else toast.add({ title: 'No se pudo eliminar', description: res.error, type: 'error' })
    })

  return (
    <section className="flex flex-col overflow-hidden rounded-3xl border bg-card">
      <div className="flex items-center justify-between gap-3 border-b p-5">
        <div>
          <h2 className="font-display text-xl text-ink">Playlist</h2>
          <p className="text-sm text-muted-foreground">{list.length} sugerencias</p>
        </div>
        <Button size="sm" variant="outline" onClick={copyAll} disabled={!list.length}>
          <Copy /> Copiar lista
        </Button>
      </div>
      {list.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-muted-foreground">Tus invitados aún no han sugerido canciones.</p>
      ) : (
        <ul className="max-h-96 divide-y overflow-auto scrollbar-thin">
          {list.map((s) => (
            <li key={s.id} className="group flex items-center gap-3 px-5 py-3">
              <a
                href={`https://open.spotify.com/search/${encodeURIComponent(`${s.song_title} ${s.artist ?? ''}`.trim())}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Buscar en Spotify"
                className="grid size-9 shrink-0 place-items-center rounded-lg bg-coral-soft text-coral transition-transform hover:scale-105"
              >
                <Music2 className="size-4" />
              </a>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{s.song_title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {s.artist || 'Artista desconocido'} · por {s.suggested_by}
                </p>
              </div>
              <button
                onClick={() => remove(s)}
                disabled={pending}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100"
                aria-label={`Eliminar ${s.song_title}`}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
