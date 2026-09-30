'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { requestBaseUrl } from '@/lib/site'

export type AuthState = { error?: string; info?: string; email?: string } | undefined

const MESSAGES: [RegExp, string][] = [
  [/invalid login credentials/i, 'Correo o contraseña incorrectos.'],
  [/already registered|already exists/i, 'Ya existe una cuenta con este correo. Inicia sesión.'],
  [/email not confirmed/i, 'Confirma tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.'],
  [/password should be at least|weak password/i, 'La contraseña debe tener al menos 8 caracteres.'],
  [/rate limit|too many/i, 'Demasiados intentos. Espera un momento e inténtalo de nuevo.'],
  [/invalid email|unable to validate email/i, 'Ese correo no parece válido.'],
]

function friendly(message: string) {
  return MESSAGES.find(([re]) => re.test(message))?.[1] ?? 'No pudimos completar la solicitud. Inténtalo de nuevo.'
}

function safeNext(value: FormDataEntryValue | null) {
  const v = typeof value === 'string' ? value : ''
  return /^\/(dashboard|studio)(\/|$)/.test(v) ? v : '/dashboard'
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email || !password) return { error: 'Escribe tu correo y contraseña.', email }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: friendly(error.message), email }

  revalidatePath('/', 'layout')
  redirect(safeNext(formData.get('next')))
}

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get('name') ?? '').trim().slice(0, 80)
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!name) return { error: 'Escribe tu nombre.', email }
  if (password.length < 8) return { error: 'La contraseña debe tener al menos 8 caracteres.', email }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name }, emailRedirectTo: `${await requestBaseUrl()}/auth/callback?next=/dashboard` },
  })
  if (error) return { error: friendly(error.message), email }

  // Email confirmation enabled → no session yet.
  if (!data.session) {
    return { info: `Te enviamos un enlace de confirmación a ${email}. Ábrelo para activar tu cuenta.`, email }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function requestPasswordReset(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim()
  if (!email) return { error: 'Escribe el correo de tu cuenta.' }
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await requestBaseUrl()}/auth/callback?next=/auth/reset`,
  })
  if (error) return { error: friendly(error.message), email }
  return { info: `Si existe una cuenta para ${email}, recibirás un enlace para restablecer tu contraseña.`, email }
}

export async function updatePassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')
  if (password.length < 8) return { error: 'La contraseña debe tener al menos 8 caracteres.' }
  if (password !== confirm) return { error: 'Las contraseñas no coinciden.' }
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: friendly(error.message) }
  redirect('/dashboard?toast=password')
}
