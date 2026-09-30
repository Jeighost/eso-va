import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Ticket } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Obtener el perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Obtener eventos
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Eso Va Logo" className="w-8 h-8 rounded-md object-cover shadow-sm border border-muted" />
          <span className="font-bold text-2xl text-primary">Eso Va</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Hola, {profile?.name || user.email}</span>
          <form action="/auth/signout" method="post">
            <button type="submit" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3">Cerrar Sesión</button>
          </form>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Mis Eventos</h1>
            <Link href="/dashboard/create">
              <Button>+ Crear Evento</Button>
            </Link>
          </div>

          {events && events.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{new Date(event.event_date).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {event.location || 'Sin ubicación'}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/event/${event.id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full">Gestionar</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] border-dashed">
              <h3 className="text-xl font-bold mb-2">No tienes eventos aún</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Crea tu primer evento para generar tu invitación interactiva y empezar a recibir confirmaciones.
              </p>
              <Link href="/dashboard/create">
                <Button>Crear mi primer evento</Button>
              </Link>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
