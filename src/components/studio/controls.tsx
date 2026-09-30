'use client'

import { useId, useState } from 'react'
import { cn } from 'cn'

export function Group({ title, description, children, action }: { title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-2">
        <div>
          <h3 className="text-[13px] font-semibold text-ink">{title}</h3>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="flex items-baseline justify-between text-xs font-medium text-foreground/80">
        {label}
        {hint && <span className="font-normal text-muted-foreground">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-input bg-card px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40'

export function TextInput({
  label,
  hint,
  value,
  onChange,
  placeholder,
  maxLength,
  type = 'text',
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
  type?: string
}) {
  const id = useId()
  return (
    <Field label={label} hint={hint ?? (maxLength ? `${value.length}/${maxLength}` : undefined)} htmlFor={id}>
      <input id={id} type={type} value={value} maxLength={maxLength} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cn(inputCls, 'h-9')} />
    </Field>
  )
}

export function TextArea({ label, value, onChange, placeholder, maxLength, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; rows?: number }) {
  const id = useId()
  return (
    <Field label={label} hint={maxLength ? `${value.length}/${maxLength}` : undefined} htmlFor={id}>
      <textarea id={id} rows={rows} value={value} maxLength={maxLength} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cn(inputCls, 'resize-none py-2 leading-relaxed')} />
    </Field>
  )
}

export function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: React.ReactNode; title?: string }[]; label?: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-lg bg-muted p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          title={o.title}
          onClick={() => onChange(o.value)}
          className={cn(
            'flex h-8 flex-1 items-center justify-center gap-1 rounded-md px-2 text-xs font-medium transition-all',
            value === o.value ? 'bg-card text-ink shadow-sm' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Slider({ label, value, min, max, step = 1, onChange, format }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string }) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <Field label={label} hint={format ? format(value) : String(value)} htmlFor={id}>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-ink [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-ink [&::-webkit-slider-thumb]:shadow-md focus-visible:[&::-webkit-slider-thumb]:ring-3 focus-visible:[&::-webkit-slider-thumb]:ring-ring/40"
        style={{ background: `linear-gradient(to right, var(--brand-ink) ${pct}%, var(--input) ${pct}%)` }}
      />
    </Field>
  )
}

export function Switch({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border bg-card px-3.5 py-3 transition-colors hover:bg-muted/40">
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative h-5 w-9 shrink-0 rounded-full bg-input transition-colors peer-checked:bg-ink peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4" />
    </label>
  )
}

const HEX = /^#[0-9a-f]{6}$/i

export function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId()
  // Local text while typing an incomplete hex; falls back to the committed value.
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <div className="flex items-center gap-2.5 rounded-xl border bg-card p-2">
      <span className="relative size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10" style={{ background: value }}>
        <input type="color" value={value.length === 7 ? value : '#000000'} onChange={(e) => onChange(e.target.value.toUpperCase())} className="absolute inset-0 size-full cursor-pointer opacity-0" aria-label={label} />
      </span>
      <label htmlFor={id} className="min-w-0 flex-1 text-xs font-medium text-foreground/80">
        {label}
      </label>
      <input
        id={id}
        value={draft ?? value}
        spellCheck={false}
        onChange={(e) => {
          const v = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`
          setDraft(v)
          if (HEX.test(v)) onChange(v.toUpperCase())
        }}
        onBlur={() => setDraft(null)}
        className="h-8 w-[5.5rem] rounded-md border bg-transparent px-2 font-mono text-xs uppercase outline-none focus-visible:border-ring"
      />
    </div>
  )
}

export function OptionTile({ selected, onClick, children, label, className }: { selected: boolean; onClick: () => void; children: React.ReactNode; label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      title={label}
      className={cn(
        'group flex flex-col items-center gap-1.5 rounded-xl border bg-card p-2 text-[11px] font-medium text-muted-foreground transition-all hover:border-ink/30 hover:text-foreground',
        selected && 'border-ink text-ink ring-1 ring-ink',
        className
      )}
    >
      {children}
      <span className="truncate">{label}</span>
    </button>
  )
}

/** WCAG contrast ratio between two hex colours. */
export function contrastRatio(a: string, b: string) {
  const lum = (hex: string) => {
    const h = hex.replace('#', '')
    const [r, g, bl] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}
