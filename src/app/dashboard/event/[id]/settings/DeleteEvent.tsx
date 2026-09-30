'use client'

import { useState, useTransition } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { deleteEvent } from '../actions'

export function DeleteEvent({ eventId, title }: { eventId: string; title: string }) {
  const [confirm, setConfirm] = useState('')
  const [pending, startTransition] = useTransition()
  const matches = confirm.trim().toLowerCase() === title.trim().toLowerCase()

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" className="h-10" />}>
        <Trash2 /> Eliminar evento
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¿Eliminar “{title}”?</DialogTitle>
          <DialogDescription>Escribe el nombre del evento para confirmar. Esta acción es permanente.</DialogDescription>
        </DialogHeader>
        <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={title} className="h-10" autoFocus />
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={!matches || pending}
            className="h-10"
            onClick={() =>
              startTransition(async () => {
                const res = await deleteEvent(eventId)
                if (res && !res.ok) toast.add({ title: 'No se pudo eliminar', description: res.error, type: 'error' })
              })
            }
          >
            {pending && <Loader2 className="animate-spin" />} Eliminar definitivamente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
