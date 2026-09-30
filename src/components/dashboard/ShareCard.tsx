'use client'

import { useState } from 'react'
import { Check, Copy, Download, Mail, MessageCircle, Share2 } from 'lucide-react'
import type { InvitationTheme } from '@/lib/invitation/theme'
import { inviteStrings } from '@/lib/invitation/i18n'
import { CardThumbnail } from '@/components/invitation/CardThumbnail'
import type { InviteEvent } from '@/components/invitation/InvitationCard'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'

export function ShareCard({ event, theme, inviteUrl, qrSvg, qrPng }: { event: InviteEvent; theme: InvitationTheme; inviteUrl: string; qrSvg: string; qrPng: string }) {
  const t = inviteStrings(theme.language)
  const title = theme.customTitle || event.title
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState(`${t.invited} ${title} ✨\n\n${inviteUrl}`)
  const withLink = message.includes(inviteUrl) ? message : `${message}\n\n${inviteUrl}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      toast.add({ title: 'Enlace copiado', type: 'success' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.add({ title: 'No se pudo copiar', description: 'Selecciona el enlace y cópialo manualmente.', type: 'error' })
    }
  }

  const nativeShare = async () => {
    if (!navigator.share) return copy()
    try {
      await navigator.share({ title, text: message.replace(inviteUrl, '').trim(), url: inviteUrl })
    } catch {}
  }

  const download = (href: string, name: string) => {
    const a = document.createElement('a')
    a.href = href
    a.download = name
    a.click()
  }
  const slug = title.toLowerCase().normalize('NFD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'invitacion'

  return (
    <div className="overflow-hidden rounded-3xl border bg-card">
      <div className="h-64 overflow-hidden border-b">
        <CardThumbnail event={event} theme={{ ...theme, showCountdown: false }} width={220} backdrop className="h-full [&>div:last-child]:pt-6" />
      </div>
      <div className="space-y-5 p-5">
        <div>
          <h2 className="font-display text-xl text-ink">Comparte tu invitación</h2>
          <p className="text-sm text-muted-foreground">Cada invitado usa el mismo enlace.</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-muted/50 p-1.5 pl-3">
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground select-all">{inviteUrl.replace(/^https?:\/\//, '')}</span>
          <Button size="sm" variant="secondary" onClick={copy} className="h-8 shrink-0">
            {copied ? <Check /> : <Copy />} {copied ? 'Copiado' : 'Copiar'}
          </Button>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="wa-message" className="text-xs font-semibold text-muted-foreground">
            Mensaje para enviar
          </label>
          <textarea
            id="wa-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(withLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1FAF5A] text-sm font-semibold text-white transition-colors hover:bg-[#189A4E]"
          >
            <MessageCircle className="size-4" /> Enviar por WhatsApp
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(`${t.invited} ${title}`)}&body=${encodeURIComponent(withLink)}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-medium hover:bg-muted"
          >
            <Mail className="size-4" /> Correo
          </a>
          <button type="button" onClick={nativeShare} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-medium hover:bg-muted">
            <Share2 className="size-4" /> Más
          </button>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-muted/50 p-3">
          <div className="size-24 shrink-0 overflow-hidden rounded-lg bg-white p-1 [&_svg]:size-full" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <div className="min-w-0 space-y-2">
            <p className="text-sm font-semibold">Código QR</p>
            <p className="text-xs text-muted-foreground">Para invitaciones impresas, mesas o pantallas.</p>
            <div className="flex gap-1.5">
              <Button size="xs" variant="outline" onClick={() => download(qrPng, `qr-${slug}.png`)}>
                <Download /> PNG
              </Button>
              <Button size="xs" variant="outline" onClick={() => download(URL.createObjectURL(new Blob([qrSvg], { type: 'image/svg+xml' })), `qr-${slug}.svg`)}>
                <Download /> SVG
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
