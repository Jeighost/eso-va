import Link from 'next/link'
import { createEvent } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function CreateEventPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="font-bold text-2xl text-primary" href="/dashboard">
          Eso Va
        </Link>
      </header>
      
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Crear Nuevo Evento</CardTitle>
            <CardDescription>
              Llena los detalles de tu evento. Podrás personalizar la tarjeta después.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createEvent} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Nombre del Evento (ej. La Boda de Ana y Juan)</Label>
                <Input id="title" name="title" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_type">Tipo de Evento</Label>
                  <select 
                    id="event_type" 
                    name="event_type" 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  >
                    <option value="boda">Boda</option>
                    <option value="cumpleanos">Cumpleaños</option>
                    <option value="quinceanero">Quinceañero</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_date">Fecha y Hora</Label>
                  <Input id="event_date" name="event_date" type="datetime-local" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación / Dirección</Label>
                <Input id="location" name="location" required />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium text-sm">Funcionalidades para invitados</h3>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="allow_photos" name="allow_photos" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                  <Label htmlFor="allow_photos" className="font-normal cursor-pointer">
                    Permitir que los invitados suban fotos a la galería
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="allow_songs" name="allow_songs" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                  <Label htmlFor="allow_songs" className="font-normal cursor-pointer">
                    Permitir que los invitados sugieran canciones
                  </Label>
                </div>
              </div>

              {searchParams?.message && (
                <p className="text-sm text-destructive font-medium">
                  Error: {searchParams.message}
                </p>
              )}

              <div className="flex gap-4 pt-4">
                <Link href="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">Cancelar</Button>
                </Link>
                <button type="submit" className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                  Guardar Evento
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
