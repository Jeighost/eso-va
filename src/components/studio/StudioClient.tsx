'use client'

import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import Link from 'next/link'
import {
  AlignCenter,
  AlignLeft,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ExternalLink,
  Image as ImageIcon,
  LayoutTemplate,
  ListChecks,
  Loader2,
  Monitor,
  Palette as PaletteIcon,
  Plus,
  Redo2,
  Settings2,
  Smartphone,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  Upload,
  X,
  PenLine,
  Eye,
} from 'lucide-react'
import {
  normalizeTheme,
  type InvitationTheme,
  type Layout,
  type Ornament,
  type Frame,
  type Pattern,
  ORNAMENTS,
  FRAMES,
  PATTERNS,
  LAYOUTS,
} from '@/lib/invitation/theme'
import { PRESETS, applyPreset, COVER_LIBRARY } from '@/lib/invitation/presets'
import { FONT_OPTIONS } from '@/lib/invitation/fonts'
import { LANGUAGE_OPTIONS } from '@/lib/invitation/i18n'
import { sampleFor } from '@/lib/invitation/samples'
import { InvitationBackdrop, InvitationCard, type InviteEvent } from '@/components/invitation/InvitationCard'
import { CardThumbnail } from '@/components/invitation/CardThumbnail'
import { Divider, patternBackground } from '@/components/invitation/artwork'
import { saveTheme } from '@/app/dashboard/event/[id]/actions'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { ColorInput, contrastRatio, Field, Group, OptionTile, Segmented, Slider, Switch, TextArea, TextInput } from './controls'

/* -------------------------------------------------------------------------- */
/* History                                                                     */
/* -------------------------------------------------------------------------- */

type State = { past: InvitationTheme[]; present: InvitationTheme; future: InvitationTheme[]; lastKey: string; lastAt: number }
type Action = { type: 'set'; patch: Partial<InvitationTheme>; key: string } | { type: 'replace'; theme: InvitationTheme } | { type: 'undo' } | { type: 'redo' }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'set': {
      const now = Date.now()
      const next = { ...s.present, ...a.patch }
      // Coalesce rapid edits of the same field (typing, dragging) into one undo step.
      const coalesce = a.key === s.lastKey && now - s.lastAt < 800
      return { past: coalesce ? s.past : [...s.past.slice(-60), s.present], present: next, future: [], lastKey: a.key, lastAt: now }
    }
    case 'replace':
      return { past: [...s.past.slice(-60), s.present], present: a.theme, future: [], lastKey: '', lastAt: 0 }
    case 'undo':
      if (!s.past.length) return s
      return { past: s.past.slice(0, -1), present: s.past[s.past.length - 1], future: [s.present, ...s.future], lastKey: '', lastAt: 0 }
    case 'redo':
      if (!s.future.length) return s
      return { past: [...s.past, s.present], present: s.future[0], future: s.future.slice(1), lastKey: '', lastAt: 0 }
  }
}

/* -------------------------------------------------------------------------- */
/* Static option data                                                          */
/* -------------------------------------------------------------------------- */

const PANELS = [
  { id: 'templates', label: 'Plantillas', icon: LayoutTemplate },
  { id: 'content', label: 'Contenido', icon: PenLine },
  { id: 'colors', label: 'Colores', icon: PaletteIcon },
  { id: 'type', label: 'Tipografía', icon: Type },
  { id: 'style', label: 'Estilo', icon: Sparkles },
  { id: 'cover', label: 'Portada', icon: ImageIcon },
  { id: 'sections', label: 'Secciones', icon: ListChecks },
  { id: 'settings', label: 'Ajustes', icon: Settings2 },
] as const
type PanelId = (typeof PANELS)[number]['id']

const PALETTES = [
  { name: 'Champán', accent: '#B08D57', cardBg: '#FFFDF8', textColor: '#2B2622', pageBg: '#F4EFE6', pageBg2: '#E8DFD0' },
  { name: 'Medianoche', accent: '#E4C590', cardBg: '#0F1B33', textColor: '#F3EEE3', pageBg: '#0A1224', pageBg2: '#1B2B4F' },
  { name: 'Salvia', accent: '#5E7B5A', cardBg: '#FBFAF4', textColor: '#2E3A2C', pageBg: '#E9EEE2', pageBg2: '#D5DEC9' },
  { name: 'Ónix', accent: '#D4AF37', cardBg: '#111111', textColor: '#F5ECD7', pageBg: '#060606', pageBg2: '#1E1A12' },
  { name: 'Terracota', accent: '#B5543A', cardBg: '#FFF8F1', textColor: '#3D2A22', pageBg: '#F2E3D5', pageBg2: '#E5C9B0' },
  { name: 'Rosa', accent: '#C0748A', cardBg: '#FFFAFB', textColor: '#4A2E37', pageBg: '#F9E6EA', pageBg2: '#F0D0D8' },
  { name: 'Coral', accent: '#F0564A', cardBg: '#FFFFFF', textColor: '#10284A', pageBg: '#FDE5E1', pageBg2: '#F9C9C1' },
  { name: 'Lavanda', accent: '#7C6BB0', cardBg: '#FDFCFF', textColor: '#2F2A45', pageBg: '#ECE8F7', pageBg2: '#D9D1F0' },
  { name: 'Océano', accent: '#1F6F8B', cardBg: '#FAFDFE', textColor: '#10303D', pageBg: '#DCEFF4', pageBg2: '#B9DEE8' },
  { name: 'Borgoña', accent: '#8C2F39', cardBg: '#FFF9F5', textColor: '#3A1D21', pageBg: '#F0E1DA', pageBg2: '#DFC3B8' },
  { name: 'Esmeralda', accent: '#C9A15B', cardBg: '#0F2E26', textColor: '#EFE7D6', pageBg: '#0A1F1A', pageBg2: '#174237' },
  { name: 'Monocromo', accent: '#111111', cardBg: '#FFFFFF', textColor: '#111111', pageBg: '#F2F2F0', pageBg2: '#E6E6E3' },
]

const LAYOUT_META: Record<Layout, string> = { classic: 'Clásico', editorial: 'Editorial', minimal: 'Minimal', framed: 'Enmarcado' }
const ORNAMENT_META: Record<Ornament, string> = { none: 'Ninguno', line: 'Línea', flourish: 'Floritura', leaves: 'Hojas', deco: 'Déco', stars: 'Estrellas', hearts: 'Corazones', diamond: 'Diamante' }
const FRAME_META: Record<Frame, string> = { none: 'Sin marco', thin: 'Fino', double: 'Doble', deco: 'Art Déco', floral: 'Floral' }
const PATTERN_META: Record<Pattern, string> = { none: 'Liso', dots: 'Puntos', grid: 'Cuadrícula', waves: 'Ondas', confetti: 'Confeti', leaves: 'Hojas', deco: 'Abanicos', stars: 'Estrellas', hearts: 'Corazones', linen: 'Lino' }

function LayoutGlyph({ kind }: { kind: Layout }) {
  const ink = 'currentColor'
  return (
    <svg viewBox="0 0 48 64" className="h-14 w-auto" fill="none" stroke={ink} strokeWidth={1.4} aria-hidden="true">
      <rect x="1" y="1" width="46" height="62" rx="4" fill="#fff" />
      {kind === 'classic' && (
        <>
          <path d="M1 5a4 4 0 0 1 4-4h38a4 4 0 0 1 4 4v17H1Z" fill="currentColor" opacity={0.25} stroke="none" />
          <path d="M14 30h20M17 35h14M20 42h8M12 52h24" />
        </>
      )}
      {kind === 'editorial' && (
        <>
          <path d="M1 5a4 4 0 0 1 4-4h38a4 4 0 0 1 4 4v33H1Z" fill="currentColor" opacity={0.35} stroke="none" />
          <path d="M12 26h24M15 31h18" stroke="#fff" strokeWidth={2} />
          <path d="M16 45h16M12 53h24" />
        </>
      )}
      {kind === 'minimal' && <path d="M8 14h18M8 20h28M8 26h22M8 36h10M8 52h32" />}
      {kind === 'framed' && (
        <>
          <rect x="5" y="5" width="38" height="54" rx="2" strokeOpacity={0.4} />
          <path d="M16 26V16a8 8 0 0 1 16 0v10Z" fill="currentColor" opacity={0.3} stroke="none" />
          <path d="M15 34h18M18 39h12M14 50h20" />
        </>
      )}
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Studio                                                                      */
/* -------------------------------------------------------------------------- */

export function StudioClient({ event, initialTheme, inviteUrl, welcome }: { event: InviteEvent & { unique_token: string }; initialTheme: InvitationTheme; inviteUrl: string; welcome: boolean }) {
  const [state, dispatch] = useReducer(reducer, { past: [], present: initialTheme, future: [], lastKey: '', lastAt: 0 })
  const theme = state.present
  const [saved, setSaved] = useState(JSON.stringify(initialTheme))
  const dirty = JSON.stringify(theme) !== saved
  const [saving, setSaving] = useState(false)
  const [panel, setPanel] = useState<PanelId>(welcome ? 'templates' : 'content')
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile')
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')
  const [previewKey, setPreviewKey] = useState(0)

  const set = useCallback((patch: Partial<InvitationTheme>, key = Object.keys(patch).join()) => dispatch({ type: 'set', patch, key }), [])

  const save = useCallback(async () => {
    setSaving(true)
    const payload = JSON.stringify(normalizeTheme(theme))
    const res = await saveTheme(event.id, payload)
    setSaving(false)
    if (res.ok) {
      setSaved(JSON.stringify(theme))
      toast.add({ title: 'Diseño guardado', description: 'Tu invitación ya está actualizada.', type: 'success' })
    } else toast.add({ title: 'No se pudo guardar', description: res.error, type: 'error' })
  }, [event.id, theme])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      const k = e.key.toLowerCase()
      if (k === 's') {
        e.preventDefault()
        if (!saving) save()
      } else if (k === 'z' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        dispatch({ type: e.shiftKey ? 'redo' : 'undo' })
      } else if (k === 'y' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        dispatch({ type: 'redo' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [save, saving])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return
    const onBefore = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', onBefore)
    return () => window.removeEventListener('beforeunload', onBefore)
  }, [dirty])

  useEffect(() => {
    if (welcome) toast.add({ title: '¡Evento creado!', description: 'Elige una plantilla y personalízala a tu gusto.', type: 'success' })
  }, [welcome])

  const panelBody = (
    <div className="space-y-7 p-5 pb-24">
      {panel === 'templates' && <TemplatesPanel theme={theme} onPick={(t) => dispatch({ type: 'replace', theme: t })} />}
      {panel === 'content' && <ContentPanel theme={theme} set={set} eventTitle={event.title} />}
      {panel === 'colors' && <ColorsPanel theme={theme} set={set} />}
      {panel === 'type' && <TypePanel theme={theme} set={set} />}
      {panel === 'style' && <StylePanel theme={theme} set={set} />}
      {panel === 'cover' && <CoverPanel theme={theme} set={set} eventId={event.id} />}
      {panel === 'sections' && <SectionsPanel theme={theme} set={set} />}
      {panel === 'settings' && <SettingsPanel theme={theme} set={set} eventId={event.id} />}
    </div>
  )

  const preview = (
    <div className="relative isolate min-h-full">
      <InvitationBackdrop theme={theme} />
      <div className="relative flex justify-center px-4 py-10 sm:py-14">
        {device === 'mobile' ? (
          <div className="w-[390px] max-w-full rounded-[3rem] border border-white/15 bg-[#0d0d0f] p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,.5),0_0_0_1px_rgba(0,0,0,.25)]">
            <div className="relative h-[760px] overflow-y-auto overflow-x-hidden rounded-[2.4rem] scrollbar-thin">
              <div className="sticky top-0 z-40 mx-auto h-7 w-28 rounded-b-2xl bg-[#0d0d0f]" />
              <div className="relative isolate -mt-7 min-h-full px-3 py-8">
                <InvitationBackdrop theme={theme} />
                <InvitationCard key={previewKey} event={event} theme={theme} mode="preview" inviteUrl={inviteUrl} />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[34rem]">
            <InvitationCard key={previewKey} event={event} theme={theme} mode="preview" inviteUrl={inviteUrl} />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-muted/40">
      {/* Top bar */}
      <header className="z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3 sm:px-4">
        <Link
          href={`/dashboard/event/${event.id}`}
          onClick={(e) => {
            if (dirty && !confirm('Tienes cambios sin guardar. ¿Salir de todas formas?')) e.preventDefault()
          }}
          className="grid size-9 place-items-center rounded-lg hover:bg-muted"
          aria-label="Volver al evento"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Estudio de diseño</p>
          <p className="truncate text-sm font-semibold text-ink">{event.title}</p>
        </div>

        <div className="ml-4 hidden items-center gap-0.5 md:flex">
          <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'undo' })} disabled={!state.past.length} aria-label="Deshacer (Ctrl+Z)" title="Deshacer (Ctrl+Z)">
            <Undo2 />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'redo' })} disabled={!state.future.length} aria-label="Rehacer (Ctrl+Shift+Z)" title="Rehacer (Ctrl+Shift+Z)">
            <Redo2 />
          </Button>
        </div>

        <div className="mx-auto hidden rounded-lg bg-muted p-0.5 lg:flex">
          {(
            [
              ['mobile', Smartphone, 'Móvil'],
              ['desktop', Monitor, 'Escritorio'],
            ] as const
          ).map(([id, Icon, label]) => (
            <button
              key={id}
              onClick={() => setDevice(id)}
              className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium ${device === id ? 'bg-card text-ink shadow-sm' : 'text-muted-foreground'}`}
            >
              <Icon className="size-3.5" /> {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className={`hidden text-xs sm:inline ${dirty ? 'text-warning' : 'text-muted-foreground'}`}>{dirty ? '● Sin guardar' : 'Guardado'}</span>
          <Button variant="ghost" size="icon" onClick={() => setPreviewKey((k) => k + 1)} className="hidden sm:inline-flex" title="Reiniciar animaciones" aria-label="Reiniciar animaciones">
            <Sparkles />
          </Button>
          <a href={inviteUrl} target="_blank" rel="noopener noreferrer" className="hidden h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium hover:bg-muted sm:inline-flex">
            <ExternalLink className="size-4" /> En vivo
          </a>
          <Button onClick={save} disabled={saving || !dirty} className="h-9 px-4">
            {saving ? <Loader2 className="animate-spin" /> : <Check />} Guardar
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Rail */}
        <nav className={`${mobileView === 'edit' ? 'flex' : 'hidden'} w-[72px] shrink-0 flex-col gap-1 overflow-y-auto border-r bg-background p-2 md:flex`} aria-label="Secciones del editor">
          {PANELS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPanel(p.id)}
              aria-current={panel === p.id}
              className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-[10px] font-medium transition-colors ${panel === p.id ? 'bg-ink text-paper' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <p.icon className="size-[18px]" />
              {p.label}
            </button>
          ))}
        </nav>

        {/* Panel */}
        <aside className={`${mobileView === 'edit' ? 'flex' : 'hidden'} min-w-0 flex-1 flex-col border-r bg-background md:flex md:w-[360px] md:flex-none`}>
          <div className="border-b px-5 py-4">
            <h2 className="font-display text-xl text-ink">{PANELS.find((p) => p.id === panel)?.label}</h2>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">{panelBody}</div>
        </aside>

        {/* Canvas */}
        <main className={`${mobileView === 'preview' ? 'block' : 'hidden'} min-w-0 flex-1 overflow-y-auto scrollbar-thin md:block`}>{preview}</main>
      </div>

      {/* Mobile switcher */}
      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center md:hidden">
        <div className="flex rounded-full bg-ink p-1 shadow-xl">
          {(
            [
              ['edit', PenLine, 'Editar'],
              ['preview', Eye, 'Vista previa'],
            ] as const
          ).map(([id, Icon, label]) => (
            <button key={id} onClick={() => setMobileView(id)} className={`flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold ${mobileView === id ? 'bg-paper text-ink' : 'text-paper/80'}`}>
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

type PanelProps = { theme: InvitationTheme; set: (patch: Partial<InvitationTheme>, key?: string) => void }

/* ----------------------------- Templates ---------------------------------- */

function TemplatesPanel({ theme, onPick }: { theme: InvitationTheme; onPick: (t: InvitationTheme) => void }) {
  return (
    <Group title="Elige un punto de partida" description="Tus textos se conservan. Después podrás ajustar cada detalle.">
      <div className="grid grid-cols-2 gap-3">
        {PRESETS.map((p) => {
          const sample = sampleFor(p.id)
          const selected = theme.preset === p.id
          return (
            <button
              key={p.id}
              onClick={() => onPick(applyPreset(theme, p))}
              aria-pressed={selected}
              className={`group overflow-hidden rounded-2xl border text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${selected ? 'border-ink ring-2 ring-ink' : ''}`}
            >
              <div className="h-40 overflow-hidden">
                <CardThumbnail event={sample.event} theme={sample.theme} width={120} backdrop className="h-full [&>div:last-child]:pt-4" />
              </div>
              <div className="border-t bg-card p-2.5">
                <p className="flex items-center justify-between text-xs font-semibold text-ink">
                  {p.name} {selected && <Check className="size-3.5" />}
                </p>
                <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">{p.tagline}</p>
              </div>
            </button>
          )
        })}
      </div>
    </Group>
  )
}

/* ------------------------------ Content ----------------------------------- */

function ContentPanel({ theme, set, eventTitle }: PanelProps & { eventTitle: string }) {
  const items = theme.itinerary
  const update = (i: number, patch: Partial<{ time: string; label: string }>) => set({ itinerary: items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) }, `itinerary-${i}`)
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    set({ itinerary: next }, 'itinerary-move')
  }

  return (
    <>
      <Group title="Encabezado">
        <TextInput label="Frase superior" value={theme.eyebrow} onChange={(v) => set({ eyebrow: v })} placeholder="Estás invitado a" maxLength={80} />
        <TextInput label="Título de la invitación" value={theme.customTitle} onChange={(v) => set({ customTitle: v })} placeholder={eventTitle} maxLength={140} />
        <TextInput label="Anfitriones" value={theme.hosts} onChange={(v) => set({ hosts: v })} placeholder="Ej. Junto a sus familias" maxLength={140} />
      </Group>

      <Group title="Mensaje">
        <TextArea label="Mensaje especial" value={theme.message} onChange={(v) => set({ message: v })} placeholder="Unas palabras para tus invitados…" maxLength={800} rows={4} />
      </Group>

      <Group
        title="Programa del evento"
        description="Ceremonia, recepción, cena, fiesta…"
        action={
          <Button size="xs" variant="outline" onClick={() => set({ itinerary: [...items, { time: '', label: '' }] }, 'itinerary-add')} disabled={items.length >= 12}>
            <Plus /> Añadir
          </Button>
        }
      >
        {items.length === 0 && <p className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">Sin actividades. Añade la primera.</p>}
        <ol className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <input
                value={it.time}
                onChange={(e) => update(i, { time: e.target.value })}
                placeholder="19:00"
                maxLength={20}
                aria-label="Hora"
                className="h-9 w-[4.5rem] rounded-lg border bg-card px-2 text-sm tabular-nums outline-none focus-visible:border-ring"
              />
              <input
                value={it.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="Ceremonia religiosa"
                maxLength={120}
                aria-label="Actividad"
                className="h-9 min-w-0 flex-1 rounded-lg border bg-card px-2.5 text-sm outline-none focus-visible:border-ring"
              />
              <div className="flex">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30" aria-label="Subir">
                  <ArrowUp className="size-3.5" />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30" aria-label="Bajar">
                  <ArrowDown className="size-3.5" />
                </button>
                <button onClick={() => set({ itinerary: items.filter((_, idx) => idx !== i) }, 'itinerary-del')} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Eliminar">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      </Group>

      <Group title="Detalles para invitados">
        <TextInput label="Código de vestimenta" value={theme.dressCode} onChange={(v) => set({ dressCode: v })} placeholder="Formal · Etiqueta rigurosa" maxLength={200} />
        <TextArea label="Mesa de regalos" value={theme.giftInfo} onChange={(v) => set({ giftInfo: v })} placeholder="Tu presencia es nuestro mejor regalo…" maxLength={400} rows={2} />
        <TextInput label="Enlace a mesa de regalos" value={theme.giftUrl} onChange={(v) => set({ giftUrl: v.trim() })} placeholder="https://" type="url" />
        <TextInput label="Enlace de ubicación (opcional)" hint="Google Maps, Waze…" value={theme.mapUrl} onChange={(v) => set({ mapUrl: v.trim() })} placeholder="https://maps.app.goo.gl/…" type="url" />
      </Group>

      <Group title="Botón de confirmación">
        <TextInput label="Texto del botón" value={theme.rsvpButtonText} onChange={(v) => set({ rsvpButtonText: v })} placeholder="Enviar confirmación" maxLength={40} />
      </Group>
    </>
  )
}

/* ------------------------------- Colors ----------------------------------- */

function ColorsPanel({ theme, set }: PanelProps) {
  const ratio = contrastRatio(theme.textColor, theme.cardBg)
  const accentRatio = contrastRatio(theme.accent, theme.cardBg)
  return (
    <>
      <Group title="Paletas" description="Combinaciones armonizadas por diseñadores.">
        <div className="grid grid-cols-3 gap-2">
          {PALETTES.map((p) => {
            const selected = p.accent === theme.accent && p.cardBg === theme.cardBg && p.textColor === theme.textColor
            return (
              <button
                key={p.name}
                onClick={() => set({ accent: p.accent, cardBg: p.cardBg, textColor: p.textColor, pageBg: p.pageBg, pageBg2: p.pageBg2 }, 'palette')}
                className={`overflow-hidden rounded-xl border text-left transition-all hover:-translate-y-0.5 ${selected ? 'ring-2 ring-ink' : ''}`}
                aria-pressed={selected}
              >
                <div className="flex h-12" style={{ background: `linear-gradient(135deg, ${p.pageBg}, ${p.pageBg2})` }}>
                  <div className="m-2 flex flex-1 items-center justify-center gap-1 rounded-md" style={{ background: p.cardBg }}>
                    <span className="size-3 rounded-full" style={{ background: p.accent }} />
                    <span className="h-1.5 w-5 rounded-full" style={{ background: p.textColor, opacity: 0.7 }} />
                  </div>
                </div>
                <p className="bg-card px-2 py-1.5 text-[11px] font-medium">{p.name}</p>
              </button>
            )
          })}
        </div>
      </Group>

      <Group title="Tarjeta">
        <div className="space-y-2">
          <ColorInput label="Acento" value={theme.accent} onChange={(v) => set({ accent: v })} />
          <ColorInput label="Fondo de tarjeta" value={theme.cardBg} onChange={(v) => set({ cardBg: v })} />
          <ColorInput label="Texto" value={theme.textColor} onChange={(v) => set({ textColor: v })} />
        </div>
        {(ratio < 4.5 || accentRatio < 2.2) && (
          <p className="rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
            ⚠︎ Contraste bajo{ratio < 4.5 ? ` entre texto y fondo (${ratio.toFixed(1)}:1)` : ' en el color de acento'}. Algunos invitados podrían tener dificultad para leer.
          </p>
        )}
      </Group>

      <Group title="Fondo de página">
        <div className="space-y-2">
          <ColorInput label={theme.pageGradient ? 'Color inicial' : 'Color'} value={theme.pageBg} onChange={(v) => set({ pageBg: v })} />
          {theme.pageGradient && <ColorInput label="Color final" value={theme.pageBg2} onChange={(v) => set({ pageBg2: v })} />}
        </div>
        <Switch label="Degradado" description="Transición suave entre dos tonos." checked={theme.pageGradient} onChange={(v) => set({ pageGradient: v })} />
      </Group>
    </>
  )
}

/* ------------------------------ Typography -------------------------------- */

function TypePanel({ theme, set }: PanelProps) {
  return (
    <>
      <Group title="Fuente del título">
        <div className="grid grid-cols-2 gap-2">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => set({ headingFont: f.id })}
              aria-pressed={theme.headingFont === f.id}
              className={`flex flex-col items-start rounded-xl border bg-card px-3 py-2.5 text-left transition-all hover:border-ink/30 ${theme.headingFont === f.id ? 'border-ink ring-1 ring-ink' : ''}`}
            >
              <span className="text-2xl leading-tight text-ink" style={{ fontFamily: f.family }}>
                Ana &amp; Luis
              </span>
              <span className="mt-1 text-[11px] font-medium text-foreground/80">{f.label}</span>
              <span className="text-[10px] text-muted-foreground">{f.mood}</span>
            </button>
          ))}
        </div>
      </Group>

      <Group title="Fuente del texto">
        <select
          value={theme.bodyFont}
          onChange={(e) => set({ bodyFont: e.target.value as InvitationTheme['bodyFont'] })}
          className="h-10 w-full rounded-lg border bg-card px-3 text-sm outline-none focus-visible:border-ring"
          style={{ fontFamily: FONT_OPTIONS.find((f) => f.id === theme.bodyFont)?.family }}
        >
          {FONT_OPTIONS.filter((f) => f.kind !== 'script').map((f) => (
            <option key={f.id} value={f.id}>
              {f.label} — {f.mood}
            </option>
          ))}
        </select>
      </Group>

      <Group title="Ajustes">
        <Slider label="Tamaño del título" value={theme.titleScale} min={70} max={150} step={5} onChange={(v) => set({ titleScale: v })} format={(v) => `${v}%`} />
        <Field label="Alineación">
          <Segmented
            value={theme.align}
            onChange={(v) => set({ align: v })}
            options={[
              { value: 'center', label: <><AlignCenter className="size-3.5" /> Centrado</> },
              { value: 'left', label: <><AlignLeft className="size-3.5" /> Izquierda</> },
            ]}
          />
        </Field>
      </Group>
    </>
  )
}

/* -------------------------------- Style ----------------------------------- */

function StylePanel({ theme, set }: PanelProps) {
  return (
    <>
      <Group title="Composición">
        <div className="grid grid-cols-4 gap-2">
          {LAYOUTS.map((l) => (
            <OptionTile key={l} selected={theme.layout === l} onClick={() => set({ layout: l })} label={LAYOUT_META[l]} className="text-ink">
              <LayoutGlyph kind={l} />
            </OptionTile>
          ))}
        </div>
      </Group>

      <Group title="Ornamento">
        <div className="grid grid-cols-2 gap-2">
          {ORNAMENTS.map((o) => (
            <OptionTile key={o} selected={theme.ornament === o} onClick={() => set({ ornament: o })} label={ORNAMENT_META[o]}>
              <span className="flex h-7 w-full items-center justify-center" style={{ color: theme.accent }}>
                {o === 'none' ? <X className="size-4 text-muted-foreground" /> : <Divider kind={o} className="h-6 w-full" />}
              </span>
            </OptionTile>
          ))}
        </div>
      </Group>

      <Group title="Marco">
        <div className="grid grid-cols-5 gap-2">
          {FRAMES.map((f) => (
            <OptionTile key={f} selected={theme.frame === f} onClick={() => set({ frame: f })} label={FRAME_META[f]}>
              <FrameGlyph kind={f} color={theme.accent} />
            </OptionTile>
          ))}
        </div>
      </Group>

      <Group title="Textura de fondo">
        <div className="grid grid-cols-5 gap-2">
          {PATTERNS.map((pt) => (
            <OptionTile key={pt} selected={theme.pattern === pt} onClick={() => set({ pattern: pt })} label={PATTERN_META[pt]}>
              <span className="block size-10 rounded-lg ring-1 ring-black/5" style={{ background: theme.pageBg, ...patternBackground(pt, theme.accent) }} />
            </OptionTile>
          ))}
        </div>
        {theme.pattern !== 'none' && <Slider label="Intensidad" value={theme.patternOpacity} min={5} max={100} step={5} onChange={(v) => set({ patternOpacity: v })} format={(v) => `${v}%`} />}
      </Group>

      <Group title="Forma y profundidad">
        <Field label="Esquinas">
          <Segmented
            value={theme.radius}
            onChange={(v) => set({ radius: v })}
            options={[
              { value: 'none', label: 'Rectas' },
              { value: 'md', label: 'Suaves' },
              { value: 'xl', label: 'Redondas' },
              { value: 'full', label: 'Máximas' },
            ]}
          />
        </Field>
        <Field label="Sombra">
          <Segmented
            value={theme.shadow}
            onChange={(v) => set({ shadow: v })}
            options={[
              { value: 'none', label: 'Ninguna' },
              { value: 'soft', label: 'Suave' },
              { value: 'strong', label: 'Intensa' },
            ]}
          />
        </Field>
        <Field label="Estilo de botones">
          <Segmented
            value={theme.buttonStyle}
            onChange={(v) => set({ buttonStyle: v })}
            options={[
              { value: 'solid', label: 'Sólido' },
              { value: 'outline', label: 'Contorno' },
              { value: 'soft', label: 'Suave' },
            ]}
          />
        </Field>
        <Switch label="Animación de entrada" description="Los elementos aparecen con elegancia al abrir." checked={theme.animate} onChange={(v) => set({ animate: v })} />
      </Group>
    </>
  )
}

function FrameGlyph({ kind, color }: { kind: Frame; color: string }) {
  return (
    <svg viewBox="0 0 32 40" className="h-10 w-8" fill="none" stroke={color} strokeWidth={1} aria-hidden="true">
      <rect x="0.5" y="0.5" width="31" height="39" rx="3" fill="#fff" stroke="#e5e5e5" />
      {kind === 'thin' && <rect x="4" y="4" width="24" height="32" rx="1.5" />}
      {kind === 'double' && (
        <>
          <rect x="3.5" y="3.5" width="25" height="33" rx="1.5" />
          <rect x="6" y="6" width="20" height="28" rx="1" strokeOpacity={0.5} />
        </>
      )}
      {kind === 'deco' && <path d="M4 12V4h8M28 12V4h-8M4 28v8h8M28 28v8h-8M7 10V7h3M25 10V7h-3M7 30v3h3M25 30v3h-3" />}
      {kind === 'floral' && (
        <g fill={color} stroke="none">
          <path d="M4 14c1-5 4-9 10-10-1 4-5 8-10 10Z" opacity={0.8} />
          <path d="M28 26c-1 5-4 9-10 10 1-4 5-8 10-10Z" opacity={0.8} />
        </g>
      )}
      {kind === 'none' && <path d="M11 16l10 8M21 16l-10 8" stroke="#bbb" />}
    </svg>
  )
}

/* -------------------------------- Cover ----------------------------------- */

function CoverPanel({ theme, set, eventId }: PanelProps & { eventId: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const upload = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.add({ title: 'Formato no válido', description: 'Sube una imagen JPG, PNG o WEBP.', type: 'error' })
    if (file.size > 8 * 1024 * 1024) return toast.add({ title: 'Imagen muy pesada', description: 'El máximo es 8 MB.', type: 'error' })
    setUploading(true)
    try {
      const supabase = createClient()
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
      const path = `covers/${eventId}-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('covers').upload(path, file, { contentType: file.type, cacheControl: '31536000' })
      if (error) throw error
      const { data } = supabase.storage.from('covers').getPublicUrl(path)
      set({ coverImage: data.publicUrl }, 'cover-upload')
      toast.add({ title: 'Portada actualizada', type: 'success' })
    } catch (err) {
      console.error('Cover upload failed', err)
      toast.add({ title: 'No se pudo subir la imagen', description: 'Verifica que el bucket "covers" exista y tenga permisos de escritura.', type: 'error' })
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const isRemote = theme.coverImage.startsWith('http')

  return (
    <>
      <Group title="Imagen de portada">
        <div className="relative overflow-hidden rounded-2xl border bg-muted">
          {theme.coverImage ? (
            <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url("${theme.coverImage}")` }} />
          ) : (
            <div className="grid h-40 place-items-center text-sm text-muted-foreground">Sin portada</div>
          )}
          {theme.coverImage && (
            <button onClick={() => set({ coverImage: '' })} className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/75" aria-label="Quitar portada">
              <X className="size-4" />
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} tabIndex={-1} />
        <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading} className="h-10 w-full">
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />} Subir mi foto
        </Button>
        <TextInput label="…o pega un enlace" value={isRemote ? theme.coverImage : ''} onChange={(v) => set({ coverImage: v.trim() })} placeholder="https://…/foto.jpg" type="url" />
      </Group>

      <Group title="Arte original de Eso Va">
        <div className="grid grid-cols-2 gap-2">
          {COVER_LIBRARY.map((c) => (
            <button
              key={c.src}
              onClick={() => set({ coverImage: c.src }, 'cover-lib')}
              className={`overflow-hidden rounded-xl border text-left transition-all hover:-translate-y-0.5 ${theme.coverImage === c.src ? 'ring-2 ring-ink' : ''}`}
              aria-pressed={theme.coverImage === c.src}
            >
              <span className="block h-16 bg-cover bg-center" style={{ backgroundImage: `url("${c.src}")` }} />
              <span className="block bg-card px-2 py-1.5 text-[11px] font-medium">{c.label}</span>
            </button>
          ))}
        </div>
      </Group>

      {theme.coverImage && (
        <Group title="Ajustes de imagen">
          <Field label="Altura">
            <Segmented value={theme.coverHeight} onChange={(v) => set({ coverHeight: v })} options={[{ value: 'sm', label: 'Baja' }, { value: 'md', label: 'Media' }, { value: 'lg', label: 'Alta' }]} />
          </Field>
          <Field label="Encuadre">
            <Segmented value={theme.coverFocus} onChange={(v) => set({ coverFocus: v })} options={[{ value: 'top', label: 'Arriba' }, { value: 'center', label: 'Centro' }, { value: 'bottom', label: 'Abajo' }]} />
          </Field>
          <Slider label="Oscurecer imagen" value={theme.coverOverlay} min={0} max={90} step={5} onChange={(v) => set({ coverOverlay: v })} format={(v) => `${v}%`} />
        </Group>
      )}
    </>
  )
}

/* ------------------------------- Sections --------------------------------- */

function SectionsPanel({ theme, set }: PanelProps) {
  return (
    <>
      <Group title="Bloques visibles">
        <div className="space-y-2">
          <Switch label="Cuenta regresiva" description="Días, horas y minutos para el gran momento." checked={theme.showCountdown} onChange={(v) => set({ showCountdown: v })} />
          <Switch label="Programa" description="Muestra el itinerario que definiste en Contenido." checked={theme.showItinerary} onChange={(v) => set({ showItinerary: v })} />
          <Switch label="Agendar en calendario" description="Google Calendar, Apple y Outlook." checked={theme.showCalendar} onChange={(v) => set({ showCalendar: v })} />
          <Switch label="Cómo llegar" description="Abre el mapa con la ubicación del evento." checked={theme.showMap} onChange={(v) => set({ showMap: v })} />
        </div>
      </Group>

      <Group title="Confirmaciones (RSVP)">
        <Slider label="Acompañantes permitidos por invitado" value={theme.maxPlusOnes} min={0} max={10} onChange={(v) => set({ maxPlusOnes: v })} format={(v) => (v === 0 ? 'Ninguno' : `Hasta ${v}`)} />
        <Field label="Fecha límite para responder" hint={theme.rsvpDeadline ? '' : 'Opcional'}>
          <div className="flex gap-2">
            <input type="date" value={theme.rsvpDeadline} onChange={(e) => set({ rsvpDeadline: e.target.value })} className="h-9 flex-1 rounded-lg border bg-card px-3 text-sm outline-none focus-visible:border-ring" />
            {theme.rsvpDeadline && (
              <Button variant="ghost" size="icon" onClick={() => set({ rsvpDeadline: '' })} aria-label="Quitar fecha límite">
                <X />
              </Button>
            )}
          </div>
        </Field>
      </Group>
    </>
  )
}

/* ------------------------------- Settings --------------------------------- */

function SettingsPanel({ theme, set, eventId }: PanelProps & { eventId: string }) {
  return (
    <>
      <Group title="Idioma de la invitación" description="Todos los textos del sistema se traducen para tus invitados.">
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGE_OPTIONS.map((l) => (
            <button
              key={l.id}
              onClick={() => set({ language: l.id })}
              aria-pressed={theme.language === l.id}
              className={`flex h-10 items-center justify-between rounded-lg border bg-card px-3 text-sm font-medium ${theme.language === l.id ? 'border-ink ring-1 ring-ink' : 'hover:border-ink/30'}`}
            >
              {l.label} {theme.language === l.id && <Check className="size-4" />}
            </button>
          ))}
        </div>
      </Group>
      <Group title="Duración estimada" description="Se usa al agendar el evento en el calendario.">
        <Slider label="Horas" value={theme.durationHours} min={1} max={24} onChange={(v) => set({ durationHours: v })} format={(v) => `${v} h`} />
      </Group>
      <Group title="Fecha, lugar y zona horaria">
        <p className="text-sm text-muted-foreground">
          Zona horaria actual: <strong className="text-foreground">{theme.timezone.replace(/_/g, ' ')}</strong>
        </p>
        <Link href={`/dashboard/event/${eventId}/settings`} className="inline-flex text-sm font-semibold text-coral hover:underline">
          Editar datos del evento →
        </Link>
      </Group>
    </>
  )
}
