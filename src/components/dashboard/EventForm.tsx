'use client'

import { useActionState, useEffect, useState } from 'react'
import { Camera, Loader2, Music2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { EVENT_TYPES } from '@/lib/invitation/presets'
import { EventTypeIcon } from '@/components/brand/illustrations'
import { LANGUAGE_OPTIONS } from '@/lib/invitation/i18n'
import { allTimeZones, COMMON_TIME_ZONES, timeZoneLabel } from '@/lib/invitation/datetime'
import type { Language } from '@/lib/invitation/theme'

export type EventFormState = { error?: string } | undefined

export type EventFormValues = {
  title: string
  event_type: string
  local_date: string
  timezone: string
  location: string
  language: Language
  allow_photos: boolean
  allow_songs: boolean
}


export function EventForm({
  action,
  initial,
  submitLabel,
  detectTimeZone = false,
  children,
}: {
  action: (state: EventFormState, fd: FormData) => Promise<EventFormState>
  initial: EventFormValues
  submitLabel: string
  detectTimeZone?: boolean
  children?: React.ReactNode
}) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const [type, setType] = useState(initial.event_type)
  const [tz, setTz] = useState(initial.timezone)
  // Browser-only values (the full zone list differs between runtimes), filled after mount.
  const [zones, setZones] = useState<string[]>([])

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- browser-only values, unknown during SSR */
    setZones(allTimeZones())
    if (!detectTimeZone) return
    const local = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (local) setTz(local)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [detectTimeZone])

  return (
    <form action={formAction} className="space-y-8">
      <fieldset className="space-y-3">
        <legend className="mb-3 text-sm font-semibold text-ink">¿Qué vas a celebrar?</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {EVENT_TYPES.map((t) => (
            <label
              key={t.id}
              className={`flex cursor-pointer flex-col items-start gap-2 rounded-xl border p-3 text-sm font-medium transition-all hover:border-ink/30 ${
                type === t.id ? 'border-ink bg-ink/[.03] ring-1 ring-ink' : 'bg-card'
              }`}
            >
              <input type="radio" name="event_type" value={t.id} checked={type === t.id} onChange={() => setType(t.id)} className="sr-only" />
              <EventTypeIcon type={t.id} className="size-7" />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="title">Nombre del evento</Label>
        <Input id="title" name="title" required maxLength={140} defaultValue={initial.title} placeholder="Ej. Boda de Ana & Juan" className="h-11 text-base" />
        <p className="text-xs text-muted-foreground">Es el título principal de la invitación. Podrás cambiarlo en el diseño.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="local_date">Fecha y hora</Label>
          <Input id="local_date" name="local_date" type="datetime-local" required defaultValue={initial.local_date} className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="timezone">Zona horaria del evento</Label>
          <select
            id="timezone"
            name="timezone"
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <optgroup label="Frecuentes">
              {COMMON_TIME_ZONES.map((z) => (
                <option key={`c-${z}`} value={z}>
                  {zones.length ? timeZoneLabel(z) : z.replace(/_/g, ' ')}
                </option>
              ))}
            </optgroup>
            <optgroup label="Todas">
              {zones
                .filter((z) => !COMMON_TIME_ZONES.includes(z))
                .map((z) => (
                  <option key={z} value={z}>
                    {z.replace(/_/g, ' ')}
                  </option>
                ))}
              {!zones.includes(tz) && !COMMON_TIME_ZONES.includes(tz) && <option value={tz}>{tz}</option>}
            </optgroup>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="location">Lugar</Label>
        <Input id="location" name="location" required maxLength={240} defaultValue={initial.location} placeholder="Ej. Hacienda San Gabriel, Querétaro" className="h-11" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="language">Idioma de la invitación</Label>
        <select
          id="language"
          name="language"
          defaultValue={initial.language}
          className="h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-1/2"
        >
          {LANGUAGE_OPTIONS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-3 text-sm font-semibold text-ink">Interacción con invitados</legend>
        <Toggle name="allow_songs" defaultChecked={initial.allow_songs} icon={<Music2 className="size-4" />} title="Playlist colaborativa" description="Los invitados sugieren canciones para la fiesta." />
        <Toggle name="allow_photos" defaultChecked={initial.allow_photos} icon={<Camera className="size-4" />} title="Galería compartida" description="Los invitados suben fotos del evento a un álbum común." />
      </fieldset>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {children}
        <Button type="submit" disabled={pending} className="h-11 px-6 text-[15px]">
          {pending && <Loader2 className="animate-spin" />} {submitLabel}
        </Button>
      </div>
    </form>
  )
}

function Toggle({ name, defaultChecked, icon, title, description }: { name: string; defaultChecked: boolean; icon: React.ReactNode; title: string; description: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-coral-soft text-coral">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{description}</span>
      </span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-input transition-colors peer-checked:bg-ink peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  )
}
