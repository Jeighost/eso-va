'use client'

import { useActionState, useState } from 'react'
import { Eye, EyeOff, Loader2, MailCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { login, requestPasswordReset, signup, type AuthState } from './actions'

type Mode = 'login' | 'signup' | 'reset'

const COPY: Record<Mode, { title: string; subtitle: string; cta: string }> = {
  login: { title: 'Bienvenido de vuelta', subtitle: 'Entra para gestionar tus eventos e invitados.', cta: 'Iniciar sesión' },
  signup: { title: 'Crea tu cuenta', subtitle: 'Diseña tu primera invitación en menos de 5 minutos.', cta: 'Crear cuenta gratis' },
  reset: { title: 'Recupera tu acceso', subtitle: 'Te enviaremos un enlace para crear una nueva contraseña.', cta: 'Enviar enlace' },
}

export function AuthForm({ initialMode, next, linkError }: { initialMode: 'login' | 'signup'; next: string; linkError: boolean }) {
  const [mode, setMode] = useState<Mode>(initialMode)
  return <ModeForm key={mode} mode={mode} setMode={setMode} next={next} linkError={linkError && mode === initialMode} />
}

function ModeForm({ mode, setMode, next, linkError }: { mode: Mode; setMode: (m: Mode) => void; next: string; linkError: boolean }) {
  const action = mode === 'login' ? login : mode === 'signup' ? signup : requestPasswordReset
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, undefined)
  const [show, setShow] = useState(false)
  const copy = COPY[mode]

  if (state?.info) {
    return (
      <div className="animate-rise space-y-5 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-coral-soft text-coral">
          <MailCheck className="size-6" />
        </span>
        <h1 className="font-display text-3xl text-ink">Revisa tu correo</h1>
        <p className="text-muted-foreground">{state.info}</p>
        <Button variant="outline" className="h-10 w-full" onClick={() => setMode('login')}>
          Volver a iniciar sesión
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-rise space-y-7">
      {mode !== 'reset' && (
        <div className="grid grid-cols-2 rounded-xl bg-muted p-1 text-sm font-medium" role="tablist">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`h-9 rounded-lg transition-all ${mode === m ? 'bg-card text-ink shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        <h1 className="font-display text-[2rem] leading-tight text-ink">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.subtitle}</p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        {mode === 'signup' && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" autoComplete="name" placeholder="Tu nombre" required className="h-11" />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" defaultValue={state?.email} required className="h-11" />
        </div>
        {mode !== 'reset' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              {mode === 'login' && (
                <button type="button" onClick={() => setMode('reset')} className="text-xs font-medium text-coral hover:underline">
                  ¿La olvidaste?
                </button>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={show ? 'text' : 'password'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                minLength={mode === 'signup' ? 8 : undefined}
                required
                className="h-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
                aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {mode === 'signup' && <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>}
          </div>
        )}

        {(state?.error || linkError) && (
          <p role="alert" className="rounded-lg bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
            {state?.error ?? 'El enlace expiró o ya fue usado. Solicita uno nuevo.'}
          </p>
        )}

        <Button type="submit" disabled={pending} className="h-11 w-full text-[15px]">
          {pending && <Loader2 className="animate-spin" />}
          {copy.cta}
        </Button>

        {mode === 'reset' && (
          <button type="button" onClick={() => setMode('login')} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
            ← Volver a iniciar sesión
          </button>
        )}
      </form>
    </div>
  )
}
