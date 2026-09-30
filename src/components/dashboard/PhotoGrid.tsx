'use client'

import { useEffect, useState, useTransition } from 'react'
import { ChevronLeft, ChevronRight, Download, Trash2, X } from 'lucide-react'
import type { PhotoRow } from '@/lib/data'
import { deleteItem } from '@/app/dashboard/event/[id]/actions'
import { toast } from '@/components/ui/toast'

/* eslint-disable @next/next/no-img-element -- guest uploads come from arbitrary storage URLs */

export function PhotoGrid({ eventId, photos }: { eventId: string; photos: PhotoRow[] }) {
  const [removed, setRemoved] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState<number | null>(null)
  const [pending, startTransition] = useTransition()
  const list = photos.filter((p) => !removed.has(p.id))
  const current = open !== null ? list[open] : null

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % list.length))
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + list.length) % list.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, list.length])

  const remove = (p: PhotoRow) => {
    if (!confirm('¿Eliminar esta foto de la galería?')) return
    startTransition(async () => {
      const res = await deleteItem(eventId, 'photo', p.id)
      if (res.ok) {
        setRemoved((r) => new Set(r).add(p.id))
        setOpen(null)
      } else toast.add({ title: 'No se pudo eliminar', description: res.error, type: 'error' })
    })
  }

  return (
    <section className="flex flex-col overflow-hidden rounded-3xl border bg-card">
      <div className="border-b p-5">
        <h2 className="font-display text-xl text-ink">Galería</h2>
        <p className="text-sm text-muted-foreground">{list.length} fotos compartidas</p>
      </div>
      {list.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-muted-foreground">Las fotos que suban tus invitados aparecerán aquí.</p>
      ) : (
        <div className="grid max-h-96 grid-cols-3 gap-1.5 overflow-auto p-3 scrollbar-thin">
          {list.map((p, i) => (
            <button key={p.id} onClick={() => setOpen(i)} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img src={p.photo_url} alt={`Foto de ${p.uploaded_by}`} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-2 pt-4 pb-1.5 text-left text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {p.uploaded_by}
              </span>
            </button>
          ))}
        </div>
      )}

      {current && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/92 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Visor de fotos">
          <div className="flex items-center justify-between p-4 text-white">
            <p className="text-sm">
              <span className="font-semibold">{current.uploaded_by}</span> <span className="text-white/60">· {(open ?? 0) + 1} de {list.length}</span>
            </p>
            <div className="flex gap-1">
              <a href={current.photo_url} download target="_blank" rel="noopener noreferrer" className="grid size-10 place-items-center rounded-full hover:bg-white/10" aria-label="Descargar">
                <Download className="size-5" />
              </a>
              <button onClick={() => remove(current)} disabled={pending} className="grid size-10 place-items-center rounded-full hover:bg-white/10" aria-label="Eliminar">
                <Trash2 className="size-5" />
              </button>
              <button onClick={() => setOpen(null)} className="grid size-10 place-items-center rounded-full hover:bg-white/10" aria-label="Cerrar">
                <X className="size-5" />
              </button>
            </div>
          </div>
          <div className="relative flex flex-1 items-center justify-center p-4" onClick={() => setOpen(null)}>
            <img src={current.photo_url} alt="" className="max-h-full max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
            {list.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpen(((open ?? 0) - 1 + list.length) % list.length)
                  }}
                  className="absolute left-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="Anterior"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpen(((open ?? 0) + 1) % list.length)
                  }}
                  className="absolute right-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="Siguiente"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
