'use client'

import { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { submitRsvp, submitSong, submitPhoto } from './actions'
import { createClient } from '@/utils/supabase/client'
import { Music, Camera, Ticket, Upload, Loader2, CheckCircle2 } from 'lucide-react'

export default function InviteClient({ event, theme, token, radiusMap }: any) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploaderName, setUploaderName] = useState('')
  
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false)
  const [rsvpSuccess, setRsvpSuccess] = useState(false)
  
  const [isSubmittingSong, setIsSubmittingSong] = useState(false)
  const [songSuccess, setSongSuccess] = useState(false)

  const getPatternStyle = (pattern: string) => {
    if (pattern === 'dots') return { backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px', color: `${theme.color}30` }
    if (pattern === 'grid') return { backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px', color: `${theme.color}30` }
    if (pattern === 'waves') return { backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${theme.color}15 10px, transparent 10px, transparent 20px)`, color: theme.color }
    return {}
  }

  const handleRsvp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmittingRsvp(true)
    try {
      const formData = new FormData(e.currentTarget)
      await submitRsvp(formData)
      setRsvpSuccess(true)
    } catch (error) {
      alert("Hubo un error al enviar tu confirmación. Intenta de nuevo.")
    } finally {
      setIsSubmittingRsvp(false)
    }
  }

  const handleSong = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmittingSong(true)
    try {
      const formData = new FormData(e.currentTarget)
      await submitSong(formData)
      setSongSuccess(true)
      e.currentTarget.reset()
      setTimeout(() => setSongSuccess(false), 3000)
    } catch (error) {
      alert("Hubo un error al enviar tu sugerencia.")
    } finally {
      setIsSubmittingSong(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!uploaderName) {
      alert("Por favor escribe tu nombre antes de subir la foto")
      return
    }

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${event.id}-${Date.now()}.${fileExt}`
      const filePath = `gallery/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('gallery').getPublicUrl(filePath)
      
      await submitPhoto(event.id, token, data.publicUrl, uploaderName)
      
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (error: any) {
      console.error('Upload error', error)
      alert('Error al subir la foto. ¿El anfitrión habilitó la galería?')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50" style={getPatternStyle(theme.pattern)} />
      
      <Card className={`w-full max-w-md shadow-2xl border-0 overflow-hidden relative z-10 transition-all ${radiusMap[theme.borderRadius]}`} style={{ backgroundColor: theme.cardBg }}>
        {theme.coverImage && (
          <div 
            className="w-full h-56 bg-cover bg-center relative z-10"
            style={{ backgroundImage: `url(${theme.coverImage})` }}
          >
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        
        <div className={`relative z-10 p-6 text-center bg-white/95 backdrop-blur-sm m-4 mt-[-40px] shadow-sm border ${radiusMap[theme.borderRadius]}`} style={{ backgroundColor: theme.cardBg }}>
          <CardHeader className="text-center pb-2 px-0">
            {theme.hosts ? (
              <CardDescription className="tracking-wide font-medium text-sm mb-2 opacity-80" style={{ color: theme.color }}>
                {theme.hosts}
              </CardDescription>
            ) : (
              <CardDescription className="uppercase tracking-widest font-bold text-xs mb-2" style={{ color: theme.color }}>
                Estás invitado a
              </CardDescription>
            )}
            
            <CardTitle className="text-4xl font-bold mt-2 mb-4 leading-tight">{theme.customTitle || event.title}</CardTitle>
            
            <div className="w-12 h-1 mx-auto my-4 rounded" style={{ backgroundColor: theme.color }} />
            
            <div className="flex flex-col gap-1 text-gray-700 text-sm">
              <span className="font-bold text-base" style={{ color: theme.color }} suppressHydrationWarning>{new Date(event.event_date).toLocaleString()}</span>
              <span className="opacity-80">{event.location}</span>
            </div>
          </CardHeader>
          
          {theme.message && (
            <div className="mt-4 mb-2 text-sm italic text-gray-600 bg-gray-50 p-3 rounded-lg border">
              "{theme.message}"
            </div>
          )}
        </div>
        
        <CardContent className="mt-2 border-t pt-0 px-0" style={{ backgroundColor: theme.cardBg }}>
          
          <Tabs defaultValue="rsvp" className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-none border-b bg-transparent h-14">
              <TabsTrigger value="rsvp" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none"><Ticket className="w-4 h-4 mr-2"/> Asistencia</TabsTrigger>
              <TabsTrigger value="music" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none"><Music className="w-4 h-4 mr-2"/> Música</TabsTrigger>
              <TabsTrigger value="photos" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none"><Camera className="w-4 h-4 mr-2"/> Fotos</TabsTrigger>
            </TabsList>
            
            {/* TABS RSVP */}
            <TabsContent value="rsvp" className="p-6">
              <h3 className="text-lg font-bold text-center mb-6">Confirma tu asistencia</h3>
              
              {rsvpSuccess ? (
                <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center bg-green-50 rounded-xl border border-green-100">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                  <p className="text-lg font-bold text-green-800">¡Confirmación enviada!</p>
                  <p className="text-sm text-green-700">Gracias por responder a la invitación.</p>
                </div>
              ) : (
                <form onSubmit={handleRsvp} className="space-y-5">
                  <input type="hidden" name="event_id" value={event.id} />
                  <input type="hidden" name="token" value={token} />
                  
                  <div className="space-y-2 text-left">
                    <Label htmlFor="name" className="font-semibold">Tu Nombre y Apellido</Label>
                    <Input id="name" name="name" required placeholder="Ej. Carlos Martínez" className="h-11" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-semibold">Teléfono (opc)</Label>
                      <Input id="phone" name="phone" type="tel" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plus_ones" className="font-semibold">Acompañantes</Label>
                      <select 
                        id="plus_ones" 
                        name="plus_ones" 
                        className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="0">Ninguno</option>
                        <option value="1">1 Acompañante</option>
                        <option value="2">2 Acompañantes</option>
                        <option value="3">3 Acompañantes</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 text-left bg-gray-50/50 p-4 rounded-xl border">
                    <Label className="font-semibold text-base">¿Asistirás?</Label>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-colors">
                        <input type="radio" name="status" value="accepted" required className="w-5 h-5 accent-primary" style={{ accentColor: theme.color }} />
                        <span className="font-medium">Sí, allí estaré</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-colors">
                        <input type="radio" name="status" value="declined" required className="w-5 h-5 accent-primary" style={{ accentColor: theme.color }} />
                        <span className="font-medium">No podré asistir</span>
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmittingRsvp}
                    className={`mt-6 w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-bold transition-transform hover:scale-[1.02] shadow-lg text-white h-12 px-4 py-2 disabled:opacity-50 disabled:pointer-events-none ${radiusMap[theme.borderRadius]}`} 
                    style={{ backgroundColor: theme.color }}
                  >
                    {isSubmittingRsvp ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Confirmación'}
                  </button>
                </form>
              )}
            </TabsContent>

            {/* TABS MUSICA */}
            <TabsContent value="music" className="p-6">
              <h3 className="text-lg font-bold text-center mb-2">Pide una canción</h3>
              <p className="text-sm text-center text-muted-foreground mb-6">Ayúdanos a armar la mejor playlist para la fiesta.</p>
              
              {songSuccess ? (
                <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center bg-green-50 rounded-xl border border-green-100">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                  <p className="text-lg font-bold text-green-800">¡Canción añadida!</p>
                </div>
              ) : (
                <form onSubmit={handleSong} className="space-y-5">
                  <input type="hidden" name="event_id" value={event.id} />
                  <input type="hidden" name="token" value={token} />
                  
                  <div className="space-y-2 text-left">
                    <Label className="font-semibold">Nombre de la canción</Label>
                    <Input name="song_title" required placeholder="Ej. Danza Kuduro" className="h-11" />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label className="font-semibold">Artista (Opcional)</Label>
                    <Input name="artist" placeholder="Ej. Don Omar" className="h-11" />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label className="font-semibold">Tu nombre (Para saber quién la pidió)</Label>
                    <Input name="suggested_by" required placeholder="Tu nombre" className="h-11" />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmittingSong}
                    className={`mt-6 w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-bold transition-transform hover:scale-[1.02] shadow-lg text-white h-12 px-4 py-2 disabled:opacity-50 disabled:pointer-events-none ${radiusMap[theme.borderRadius]}`} 
                    style={{ backgroundColor: theme.color }}
                  >
                    {isSubmittingSong ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sugerir Canción'}
                  </button>
                </form>
              )}
            </TabsContent>

            {/* TABS FOTOS */}
            <TabsContent value="photos" className="p-6">
              <h3 className="text-lg font-bold text-center mb-2">Comparte tus fotos</h3>
              <p className="text-sm text-center text-muted-foreground mb-6">Sube las fotos que tomes durante el evento para que todos las vean.</p>
              
              <div className="space-y-5 text-left">
                <div className="space-y-2">
                  <Label className="font-semibold">Tu nombre</Label>
                  <Input 
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    required 
                    placeholder="Para saber quién la tomó" 
                    className="h-11" 
                  />
                </div>

                <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center bg-gray-50/50">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  
                  {uploadSuccess ? (
                    <div className="flex flex-col items-center text-green-600 gap-2">
                      <CheckCircle2 className="w-10 h-10" />
                      <p className="font-semibold">¡Foto enviada!</p>
                    </div>
                  ) : isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-primary">
                      <Loader2 className="w-10 h-10 animate-spin" style={{ color: theme.color }} />
                      <p className="font-semibold" style={{ color: theme.color }}>Subiendo foto...</p>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-10 h-10 text-muted-foreground opacity-50" />
                      <Button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()} 
                        className={`mt-2 ${radiusMap[theme.borderRadius]}`}
                        style={{ backgroundColor: theme.color, color: 'white' }}
                      >
                        Subir Foto
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">Formatos JPG, PNG</p>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </>
  )
}
