'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updatePassword, type AuthState } from '@/app/login/actions'

export function ResetForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(updatePassword, undefined)
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="password">Nueva contraseña</Label>
        <Input id="password" name="password" type="password" minLength={8} autoComplete="new-password" required className="h-11" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm">Confirmar contraseña</Label>
        <Input id="confirm" name="confirm" type="password" minLength={8} autoComplete="new-password" required className="h-11" />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="h-11 w-full">
        {pending && <Loader2 className="animate-spin" />} Guardar contraseña
      </Button>
    </form>
  )
}
