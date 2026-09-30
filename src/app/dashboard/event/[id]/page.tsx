import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Ticket, ArrowLeft, Users, Copy, ExternalLink, Camera, Music } from 'lucide-react'

export default async function ManageEventPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!event) redirect('/dashboard')

  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', event.id)

  const { data: songs } = await supabase
    .from('song_requests')
    .select('*')
    .eq('event_id', event.id)
    .order('created_at', { ascending: false })

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('event_id', event.id)
    .order('created_at', { ascending: false })
    .order('created_at', { ascending: false })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const inviteUrl = `${baseUrl}/invite/${event.unique_token}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`¡Estás invitado a ${event.title}! Confirma tu asistencia aquí: ${inviteUrl}`)}`

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Volver al panel
        </Link>
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Eso Va Logo" className="w-8 h-8 rounded-md object-cover shadow-sm border border-muted" />
          <span className="font-bold text-xl text-primary">Eso Va</span>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            <p className="text-muted-foreground">
              {new Date(event.event_date).toLocaleString()} • {event.location}
            </p>
          </div>
          <Link href={`/dashboard/event/${event.id}/edit`}>
            <Button className="gap-2"><Ticket className="w-4 h-4"/> Personalizar Diseño</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Tarjeta de Compartir */}
          <Card className="md:col-span-1 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ExternalLink className="w-5 h-5" /> Compartir Invitación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">Envía este enlace único a tus invitados por WhatsApp.</p>
              <div className="p-2 bg-background border rounded text-xs truncate select-all">
                {inviteUrl}
              </div>
              <div className="flex flex-col gap-2">
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white gap-2">
                    Enviar por WhatsApp
                  </Button>
                </a>
                <a href={inviteUrl} target="_blank" rel="noreferrer" className="w-full">
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="w-4 h-4" /> Ver Tarjeta Pública
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Tarjeta de Invitados */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5" /> Confirmaciones (RSVP)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {guests && guests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase border-b">
                      <tr>
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Teléfono</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Acompañantes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guests.map((guest: any) => (
                        <tr key={guest.id} className="border-b">
                          <td className="px-4 py-3 font-medium">{guest.name}</td>
                          <td className="px-4 py-3">{guest.phone || '-'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              guest.status === 'accepted' ? 'bg-green-100 text-green-700' :
                              guest.status === 'declined' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {guest.status === 'accepted' ? 'Confirmado' : guest.status === 'declined' ? 'No asistirá' : 'Pendiente'}
                            </span>
                          </td>
                          <td className="px-4 py-3">{guest.plus_ones}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aún nadie ha confirmado asistencia.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tarjetas de Módulos (Fotos/Canciones) */}
        <div className="grid md:grid-cols-2 gap-6">
          {event.allow_photos && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Camera className="w-5 h-5" /> Galería de Fotos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {photos && photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {photos.map(photo => (
                      <div key={photo.id} className="relative group rounded-md overflow-hidden aspect-square">
                        <img src={photo.photo_url} alt="Foto" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                          <span className="text-white text-xs font-medium">De: {photo.uploaded_by}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Aún no han subido fotos.</p>
                )}
              </CardContent>
            </Card>
          )}
          {event.allow_songs && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Music className="w-5 h-5" /> Canciones Sugeridas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {songs && songs.length > 0 ? (
                  <ul className="space-y-3">
                    {songs.map(song => (
                      <li key={song.id} className="text-sm border-b pb-2">
                        <p className="font-semibold">{song.song_title}</p>
                        <p className="text-muted-foreground">{song.artist || 'Sin artista'} <span className="text-xs opacity-70">(por {song.suggested_by})</span></p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No hay canciones sugeridas.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
