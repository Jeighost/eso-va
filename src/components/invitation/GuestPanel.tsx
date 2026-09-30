'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Camera, Check, Loader2, Music2, PartyPopper, X, ImagePlus, Heart } from 'lucide-react'
import type { InvitationTheme } from '@/lib/invitation/theme'
import type { InviteStrings } from '@/lib/invitation/i18n'
import { zonedLocalToUtc } from '@/lib/invitation/datetime'
import { submitPhoto, submitRsvp, submitSong, type ActionResult } from '@/app/invite/[token]/actions'
import { createClient } from '@/utils/supabase/client'
import { Confetti } from './Confetti'
import type { Palette } from './InvitationCard'

type Mode = 'live' | 'preview'
type Tab = 'rsvp' | 'music' | 'photos'

const MAX_BYTES = 10 * 1024 * 1024
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function GuestPanel({
  eventId,
  allowSongs,
  allowPhotos,
  theme,
  t,
  token,
  mode,
  palette,
  radius,
  deadlineLabel,
}: {
  eventId: string
  allowSongs: boolean
  allowPhotos: boolean
  theme: InvitationTheme
  t: InviteStrings
  token: string
  mode: Mode
  palette: Palette
  radius: number
  deadlineLabel: string
}) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'rsvp', label: t.tabRsvp, icon: <Check className="size-4" /> },
    ...(allowSongs ? [{ id: 'music' as const, label: t.tabMusic, icon: <Music2 className="size-4" /> }] : []),
    ...(allowPhotos ? [{ id: 'photos' as const, label: t.tabPhotos, icon: <Camera className="size-4" /> }] : []),
  ]
  const [tab, setTab] = useState<Tab>('rsvp')
  const active = tabs.some((x) => x.id === tab) ? tab : 'rsvp'
  const baseId = useId()

  const inputStyle: React.CSSProperties = {
    borderColor: palette.line,
    color: palette.text,
    borderRadius: Math.min(radius, 14),
    backgroundColor: palette.field,
  }
  const inputCls =
    'h-11 w-full border px-3.5 text-[15px] outline-none transition-shadow placeholder:opacity-45 focus:ring-2 focus:ring-[var(--inv-ring)]'

  return (
    <div className="px-5 pb-6 sm:px-8" style={{ '--inv-ring': palette.ring } as React.CSSProperties}>
      {mode === 'preview' && (
        <p className="mb-4 rounded-full px-3 py-1 text-center text-[11px] font-medium tracking-wide" style={{ background: palette.soft, color: palette.muted }}>
          {t.previewNote}
        </p>
      )}

      {tabs.length > 1 && (
        <div role="tablist" aria-label="Opciones" className="mb-6 flex gap-1 p-1" style={{ background: palette.soft, borderRadius: Math.min(radius, 16) + 4 }}>
          {tabs.map((x) => {
            const selected = x.id === active
            return (
              <button
                key={x.id}
                role="tab"
                id={`${baseId}-${x.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-${x.id}-panel`}
                onClick={() => setTab(x.id)}
                className="flex h-10 flex-1 items-center justify-center gap-1.5 text-sm font-semibold transition-all"
                style={{
                  borderRadius: Math.min(radius, 16),
                  background: selected ? palette.card : 'transparent',
                  color: selected ? palette.accent : palette.muted,
                  boxShadow: selected ? '0 1px 3px rgba(0,0,0,.08), 0 4px 12px -4px rgba(0,0,0,.08)' : 'none',
                }}
              >
                {x.icon}
                {x.label}
              </button>
            )
          })}
        </div>
      )}

      <div role="tabpanel" id={`${baseId}-${active}-panel`} aria-labelledby={`${baseId}-${active}`}>
        {active === 'rsvp' && (
          <RsvpForm
            {...{ theme, t, token, mode, palette, radius, inputStyle, inputCls, deadlineLabel }}
          />
        )}
        {active === 'music' && <SongForm {...{ t, token, mode, palette, radius, inputStyle, inputCls, theme }} />}
        {active === 'photos' && <PhotoForm {...{ t, token, mode, palette, radius, inputStyle, inputCls, eventId, theme }} />}
      </div>
    </div>
  )
}

type FormProps = {
  t: InviteStrings
  token: string
  mode: Mode
  palette: Palette
  radius: number
  inputStyle: React.CSSProperties
  inputCls: string
  theme: InvitationTheme
}

function errorText(t: InviteStrings, res: ActionResult) {
  if (res.ok) return ''
  if (res.error === 'closed') return t.rsvpClosed
  return t.errorGeneric
}

export function ActionButton({
  children,
  palette,
  radius,
  style,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { palette: Palette; radius: number; loading?: boolean; style?: InvitationTheme['buttonStyle'] }) {
  const variant = style ?? 'solid'
  const s: React.CSSProperties =
    variant === 'solid'
      ? { background: palette.accent, color: palette.onAccent, boxShadow: `0 10px 24px -12px ${palette.accent}` }
      : variant === 'outline'
        ? { border: `1.5px solid ${palette.accent}`, color: palette.accent, background: 'transparent' }
        : { background: palette.soft, color: palette.accent }
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex h-12 w-full items-center justify-center gap-2 px-5 text-[15px] font-semibold tracking-wide transition-all hover:brightness-[1.06] active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-60 ${props.className ?? ''}`}
      style={{ ...s, borderRadius: Math.min(radius, 999) }}
    >
      {loading ? <Loader2 className="size-5 animate-spin" /> : children}
    </button>
  )
}

function Field({ label, hint, htmlFor, children, palette }: { label: string; hint?: string; htmlFor?: string; children: React.ReactNode; palette: Palette }) {
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={htmlFor} className="text-[13px] font-semibold" style={{ color: palette.text }}>
        {label}
        {hint && <span className="ml-1 font-normal" style={{ color: palette.muted }}>({hint})</span>}
      </label>
      {children}
    </div>
  )
}

function Success({ title, body, palette, action }: { title: string; body?: string; palette: Palette; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center animate-rise">
      <span className="grid size-16 place-items-center rounded-full" style={{ background: palette.soft, color: palette.accent }}>
        <PartyPopper className="size-7" />
      </span>
      <p className="text-xl font-semibold" style={{ color: palette.text, fontFamily: 'var(--inv-heading)' }}>
        {title}
      </p>
      {body && (
        <p className="max-w-xs text-sm" style={{ color: palette.muted }}>
          {body}
        </p>
      )}
      {action}
    </div>
  )
}

function RsvpForm({ theme, t, token, mode, palette, radius, inputStyle, inputCls, deadlineLabel }: FormProps & { deadlineLabel: string }) {
  const storageKey = `esova:rsvp:${token}`
  const [status, setStatus] = useState<'accepted' | 'declined' | ''>('')
  const [plusOnes, setPlusOnes] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<null | { status: string; previous?: boolean }>(null)
  const uid = useIdSafe()

  useEffect(() => {
    if (mode !== 'live') return
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved) as { status: string }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring a persisted reply after mount
        setDone({ status: parsed.status, previous: true })
      }
    } catch {}
  }, [mode, storageKey])

  const closed = deadlinePassed(theme)

  if (done) {
    const yes = done.status === 'accepted'
    return (
      <>
        {yes && !done.previous && <Confetti colors={[palette.accent, palette.text, '#F5C542', '#FF8FA3', '#7CC6FE']} />}
        <Success
          palette={palette}
          title={yes ? t.rsvpThanksYes : t.rsvpThanksNo}
          body={done.previous ? t.alreadyAnswered : t.rsvpThanksBody}
          action={
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem(storageKey)
                } catch {}
                setDone(null)
                setStatus('')
              }}
              className="mt-1 text-sm font-semibold underline-offset-4 hover:underline"
              style={{ color: palette.accent }}
            >
              {t.respondAgain}
            </button>
          }
        />
      </>
    )
  }

  if (closed && mode === 'live') {
    return <p className="py-8 text-center text-sm" style={{ color: palette.muted }}>{t.rsvpClosed}</p>
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (!status) return
    setLoading(true)
    setError('')
    const payload = { name: String(fd.get('name') ?? ''), phone: String(fd.get('phone') ?? ''), status, plusOnes }
    const res: ActionResult = mode === 'live' ? await submitRsvp(token, payload) : (await wait(700), { ok: true })
    setLoading(false)
    if (!res.ok) return setError(errorText(t, res))
    if (mode === 'live') {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ status, name: payload.name }))
      } catch {}
    }
    setDone({ status })
  }

  const choice = (value: 'accepted' | 'declined', label: string, icon: React.ReactNode) => {
    const selected = status === value
    return (
      <label
        className="flex cursor-pointer items-center gap-3 border px-4 py-3.5 text-[15px] font-medium transition-all"
        style={{
          borderRadius: Math.min(radius, 14),
          borderColor: selected ? palette.accent : palette.line,
          background: selected ? palette.soft : palette.field,
          color: palette.text,
          boxShadow: selected ? `0 0 0 1px ${palette.accent}` : 'none',
        }}
      >
        <input type="radio" name="status" value={value} className="sr-only" checked={selected} onChange={() => setStatus(value)} required />
        <span
          className="grid size-8 shrink-0 place-items-center rounded-full transition-colors"
          style={{ background: selected ? palette.accent : palette.soft, color: selected ? palette.onAccent : palette.muted }}
        >
          {icon}
        </span>
        {label}
      </label>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="text-center">
        <h3 className="text-2xl" style={{ color: palette.text, fontFamily: 'var(--inv-heading)' }}>
          {t.rsvpTitle}
        </h3>
        {deadlineLabel && (
          <p className="mt-1 text-[13px]" style={{ color: palette.muted }}>
            {t.rsvpBy} <strong style={{ color: palette.text }}>{deadlineLabel}</strong>
          </p>
        )}
      </div>

      <Field label={t.fullName} htmlFor={`${uid}-name`} palette={palette}>
        <input id={`${uid}-name`} name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder={t.fullNamePh} className={inputCls} style={inputStyle} />
      </Field>

      <div className={`grid gap-4 ${theme.maxPlusOnes > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <Field label={t.phone} hint={t.optional} htmlFor={`${uid}-phone`} palette={palette}>
          <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={40} className={inputCls} style={inputStyle} />
        </Field>
        {theme.maxPlusOnes > 0 && (
          <Field label={t.plusOnes} htmlFor={`${uid}-plus`} palette={palette}>
            <select
              id={`${uid}-plus`}
              value={plusOnes}
              onChange={(e) => setPlusOnes(Number(e.target.value))}
              disabled={status === 'declined'}
              className={`${inputCls} appearance-none bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-9`}
              style={{
                ...inputStyle,
                backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'><path d='M1 1.5l5 5 5-5' fill='none' stroke='${palette.muted}' stroke-width='1.6' stroke-linecap='round'/></svg>`)}")`,
              }}
            >
              <option value={0}>{t.none}</option>
              {Array.from({ length: theme.maxPlusOnes }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  +{n} {n === 1 ? t.companion : t.companions}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      <fieldset className="space-y-2.5">
        <legend className="mb-2 text-[13px] font-semibold" style={{ color: palette.text }}>
          {t.willAttend}
        </legend>
        {choice('accepted', t.yes, <Heart className="size-4" />)}
        {choice('declined', t.no, <X className="size-4" />)}
      </fieldset>

      {error && (
        <p role="alert" className="text-center text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <ActionButton type="submit" palette={palette} radius={radius} loading={loading} style={theme.buttonStyle} disabled={!status}>
        {theme.rsvpButtonText || t.send}
      </ActionButton>
    </form>
  )
}

function deadlinePassed(theme: InvitationTheme) {
  if (!theme.rsvpDeadline) return false
  const d = zonedLocalToUtc(`${theme.rsvpDeadline}T23:59`, theme.timezone)
  return !!d && Date.now() > d.getTime()
}

// Stable ids for label/input pairs inside sub-forms.
function useIdSafe() {
  return useId().replace(/:/g, '')
}

function SongForm({ t, token, mode, palette, radius, inputStyle, inputCls, theme }: FormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const uid = useIdSafe()

  if (done) {
    return (
      <Success
        palette={palette}
        title={t.songThanks}
        action={
          <button type="button" onClick={() => setDone(false)} className="mt-1 text-sm font-semibold underline-offset-4 hover:underline" style={{ color: palette.accent }}>
            {t.anotherSong}
          </button>
        }
      />
    )
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setLoading(true)
    setError('')
    const payload = { title: String(fd.get('title') ?? ''), artist: String(fd.get('artist') ?? ''), by: String(fd.get('by') ?? '') }
    const res: ActionResult = mode === 'live' ? await submitSong(token, payload) : (await wait(600), { ok: true })
    setLoading(false)
    if (!res.ok) return setError(errorText(t, res))
    setDone(true)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="text-center">
        <h3 className="text-2xl" style={{ color: palette.text, fontFamily: 'var(--inv-heading)' }}>
          {t.musicTitle}
        </h3>
        <p className="mt-1 text-[13px]" style={{ color: palette.muted }}>
          {t.musicBody}
        </p>
      </div>
      <Field label={t.songTitle} htmlFor={`${uid}-song`} palette={palette}>
        <input id={`${uid}-song`} name="title" required maxLength={140} placeholder={t.songTitlePh} className={inputCls} style={inputStyle} />
      </Field>
      <Field label={t.artist} hint={t.optional} htmlFor={`${uid}-artist`} palette={palette}>
        <input id={`${uid}-artist`} name="artist" maxLength={140} placeholder={t.artistPh} className={inputCls} style={inputStyle} />
      </Field>
      <Field label={t.yourName} htmlFor={`${uid}-by`} palette={palette}>
        <input id={`${uid}-by`} name="by" required maxLength={80} autoComplete="name" className={inputCls} style={inputStyle} />
      </Field>
      {error && (
        <p role="alert" className="text-center text-sm font-medium text-red-600">
          {error}
        </p>
      )}
      <ActionButton type="submit" palette={palette} radius={radius} loading={loading} style={theme.buttonStyle}>
        <Music2 className="size-4" /> {t.suggest}
      </ActionButton>
    </form>
  )
}

type Upload = { name: string; preview: string; state: 'uploading' | 'done' | 'error' }

function PhotoForm({ t, token, mode, palette, radius, inputStyle, inputCls, eventId }: FormProps & { eventId: string }) {
  const [name, setName] = useState('')
  const [uploads, setUploads] = useState<Upload[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const uid = useIdSafe()

  const previews = useRef<string[]>([])
  useEffect(() => () => previews.current.forEach((p) => URL.revokeObjectURL(p)), [])

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return
    if (name.trim().length < 2) {
      setError(t.namePhotoFirst)
      return
    }
    setError('')
    const list = Array.from(files).slice(0, 20)
    const problems: string[] = []
    const valid = list.filter((f) => {
      if (!f.type.startsWith('image/')) return problems.push(`${f.name} ${t.fileNotImage}`), false
      if (f.size > MAX_BYTES) return problems.push(`${f.name} ${t.fileTooBig}`), false
      return true
    })
    if (problems.length) setError(problems.join(' '))
    if (!valid.length) return

    const startIndex = uploads.length
    const added = valid.map((f) => ({ name: f.name, preview: URL.createObjectURL(f), state: 'uploading' as const }))
    previews.current.push(...added.map((a) => a.preview))
    setUploads((u) => [...u, ...added])
    setBusy(true)

    const supabase = mode === 'live' ? createClient() : null
    for (let i = 0; i < valid.length; i++) {
      const file = valid[i]
      let ok = false
      try {
        if (supabase) {
          const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
          const path = `gallery/${eventId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
          const { error: upErr } = await supabase.storage.from('gallery').upload(path, file, { contentType: file.type, cacheControl: '31536000' })
          if (upErr) throw upErr
          const { data } = supabase.storage.from('gallery').getPublicUrl(path)
          const res = await submitPhoto(token, data.publicUrl, name)
          ok = res.ok
        } else {
          await wait(500)
          ok = true
        }
      } catch (err) {
        console.error('Upload failed', err)
      }
      setUploads((u) => u.map((x, idx) => (idx === startIndex + i ? { ...x, state: ok ? 'done' : 'error' } : x)))
      if (!ok) setError(t.errorGeneric)
    }
    setBusy(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const doneCount = uploads.filter((u) => u.state === 'done').length

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h3 className="text-2xl" style={{ color: palette.text, fontFamily: 'var(--inv-heading)' }}>
          {t.photosTitle}
        </h3>
        <p className="mt-1 text-[13px]" style={{ color: palette.muted }}>
          {t.photosBody}
        </p>
      </div>

      <Field label={t.yourName} htmlFor={`${uid}-uploader`} palette={palette}>
        <input id={`${uid}-uploader`} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" className={inputCls} style={inputStyle} />
      </Field>

      <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} tabIndex={-1} />

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          onFiles(e.dataTransfer.files)
        }}
        className="flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed px-4 py-8 text-center transition-colors disabled:opacity-70"
        style={{ borderColor: palette.line, borderRadius: Math.min(radius, 18), background: palette.field, color: palette.muted }}
      >
        <span className="grid size-12 place-items-center rounded-full" style={{ background: palette.soft, color: palette.accent }}>
          {busy ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
        </span>
        <span className="text-[15px] font-semibold" style={{ color: palette.accent }}>
          {busy ? `${t.uploading}… ${doneCount}/${uploads.length}` : t.choosePhotos}
        </span>
        <span className="text-xs">{t.photoHint}</span>
      </button>

      {uploads.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {uploads.map((u, i) => (
            <div key={i} className="relative aspect-square overflow-hidden" style={{ borderRadius: Math.min(radius, 10) }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
              <img src={u.preview} alt="" className="size-full object-cover" />
              <div className={`absolute inset-0 grid place-items-center ${u.state === 'done' ? 'bg-black/20' : 'bg-black/45'}`}>
                {u.state === 'uploading' && <Loader2 className="size-5 animate-spin text-white" />}
                {u.state === 'done' && <Check className="size-5 text-white" />}
                {u.state === 'error' && <X className="size-5 text-white" />}
              </div>
            </div>
          ))}
        </div>
      )}

      {doneCount > 0 && !busy && (
        <p className="text-center text-sm font-semibold" style={{ color: palette.accent }}>
          {t.photoThanks}
        </p>
      )}
      {error && (
        <p role="alert" className="text-center text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
