'use client'

import { useMemo, useState, useTransition } from 'react'
import { Download, Search, Trash2, Users } from 'lucide-react'
import type { GuestRow } from '@/lib/data'
import { deleteItem } from '@/app/dashboard/event/[id]/actions'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'

type Filter = 'all' | 'accepted' | 'declined'

const STATUS = {
  accepted: { label: 'Asistirá', cls: 'bg-success/10 text-success' },
  declined: { label: 'No asistirá', cls: 'bg-destructive/10 text-destructive' },
} as Record<string, { label: string; cls: string }>

function csvCell(v: unknown) {
  const s = String(v ?? '')
  // Neutralise spreadsheet formula injection.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s
  return `"${safe.replace(/"/g, '""')}"`
}

export function GuestTable({ eventId, eventTitle, guests }: { eventId: string; eventTitle: string; guests: GuestRow[] }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [removed, setRemoved] = useState<Set<string>>(new Set())
  const [pending, startTransition] = useTransition()

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return guests.filter(
      (g) => !removed.has(g.id) && (filter === 'all' || g.status === filter) && (!q || g.name.toLowerCase().includes(q) || (g.phone ?? '').includes(q))
    )
  }, [guests, query, filter, removed])

  const counts = useMemo(() => {
    const live = guests.filter((g) => !removed.has(g.id))
    return { all: live.length, accepted: live.filter((g) => g.status === 'accepted').length, declined: live.filter((g) => g.status === 'declined').length }
  }, [guests, removed])

  const exportCsv = () => {
    const rows = [
      ['Nombre', 'Teléfono', 'Estado', 'Acompañantes', 'Total personas', 'Fecha de respuesta'],
      ...guests
        .filter((g) => !removed.has(g.id))
        .map((g) => [
          g.name,
          g.phone ?? '',
          STATUS[g.status]?.label ?? g.status,
          g.plus_ones ?? 0,
          g.status === 'accepted' ? 1 + (g.plus_ones ?? 0) : 0,
          g.created_at ? new Date(g.created_at).toLocaleString('es') : '',
        ]),
    ]
    const csv = '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `invitados-${eventTitle.toLowerCase().replace(/[^\w]+/g, '-').slice(0, 40)}.csv`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const remove = (g: GuestRow) => {
    if (!confirm(`¿Eliminar la respuesta de ${g.name}?`)) return
    startTransition(async () => {
      const res = await deleteItem(eventId, 'guest', g.id)
      if (res.ok) {
        setRemoved((s) => new Set(s).add(g.id))
        toast.add({ title: 'Respuesta eliminada', type: 'success' })
      } else toast.add({ title: 'No se pudo eliminar', description: res.error, type: 'error' })
    })
  }

  return (
    <section className="overflow-hidden rounded-3xl border bg-card">
      <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl text-ink">Lista de invitados</h2>
          <p className="text-sm text-muted-foreground">Respuestas en tiempo real desde tu invitación.</p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={!counts.all} className="h-9">
          <Download /> Exportar CSV
        </Button>
      </div>

      {guests.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-muted">
            <Users className="size-5 text-muted-foreground" />
          </span>
          <p className="font-medium">Aún no hay respuestas</p>
          <p className="max-w-xs text-sm text-muted-foreground">Comparte tu invitación y aquí verás quién confirma su asistencia.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="flex rounded-lg bg-muted p-0.5 text-sm">
              {(
                [
                  ['all', 'Todos'],
                  ['accepted', 'Asistirán'],
                  ['declined', 'No asistirán'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className={`rounded-md px-3 py-1.5 font-medium transition-colors ${filter === id ? 'bg-card text-ink shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {label} <span className="text-xs opacity-60">{counts[id]}</span>
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o teléfono"
                className="h-9 w-full rounded-lg border bg-transparent pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>
          <div className="max-h-[520px] overflow-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-card text-left text-xs text-muted-foreground">
                <tr className="border-y">
                  <th className="px-5 py-2.5 font-medium">Nombre</th>
                  <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Teléfono</th>
                  <th className="px-3 py-2.5 font-medium">Estado</th>
                  <th className="px-3 py-2.5 text-right font-medium">+</th>
                  <th className="w-10 px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {list.map((g) => (
                  <tr key={g.id} className="group border-b last:border-0 hover:bg-muted/40">
                    <td className="px-5 py-3">
                      <p className="font-medium">{g.name}</p>
                      {g.phone && <p className="text-xs text-muted-foreground sm:hidden">{g.phone}</p>}
                    </td>
                    <td className="hidden px-3 py-3 text-muted-foreground sm:table-cell">
                      {g.phone ? (
                        <a href={`https://wa.me/${g.phone.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground hover:underline">
                          {g.phone}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS[g.status]?.cls ?? 'bg-muted text-muted-foreground'}`}>
                        {STATUS[g.status]?.label ?? 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{g.status === 'accepted' ? (g.plus_ones ?? 0) : '—'}</td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => remove(g)}
                        disabled={pending}
                        className="grid size-8 place-items-center rounded-lg text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100"
                        aria-label={`Eliminar ${g.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                      Sin resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
