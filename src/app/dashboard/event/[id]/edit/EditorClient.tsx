'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { saveTheme } from './actions'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, Save, Sparkles, Type, Image as ImageIcon, Layout, Palette, Upload, Loader2, Eye, PenTool } from 'lucide-react'
import Link from 'next/link'

// Mapa de fuentes con nombres legibles
export const FONT_MAP: Record<string, string> = {
  'sans': 'ui-sans-serif, system-ui, sans-serif',
  'serif': 'ui-serif, Georgia, serif',
  'mono': 'ui-monospace, SFMono-Regular, monospace',
  'Playfair Display': '"Playfair Display", serif',
  'Montserrat': '"Montserrat", sans-serif',
  'Dancing Script': '"Dancing Script", cursive',
  'Cinzel': '"Cinzel", serif',
  'Great Vibes': '"Great Vibes", cursive',
  'Lato': '"Lato", sans-serif',
  'Pacifico': '"Pacifico", cursive',
  'Oswald': '"Oswald", sans-serif'
}

export default function EditorClient({ event, initialTheme }: { event: any, initialTheme: any }) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [theme, setTheme] = useState({
    color: initialTheme.color || '#FF2600',
    font: initialTheme.font || 'Playfair Display',
    coverImage: initialTheme.coverImage || '',
    pattern: initialTheme.pattern || 'none',
    cardBg: initialTheme.cardBg || '#ffffff',
    customTitle: initialTheme.customTitle || '',
    hosts: initialTheme.hosts || '',
    message: initialTheme.message || '',
    borderRadius: initialTheme.borderRadius || 'xl'
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveTheme(event.id, JSON.stringify(theme))
      router.push(`/dashboard/event/${event.id}`)
    } catch (error) {
      alert('Error guardando el diseño')
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // 1. Subir archivo a bucket 'covers'
      const fileExt = file.name.split('.').pop()
      const fileName = `${event.id}-${Date.now()}.${fileExt}`
      const filePath = `covers/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Obtener URL pública
      const { data } = supabase.storage.from('covers').getPublicUrl(filePath)
      
      setTheme({ ...theme, coverImage: data.publicUrl })
    } catch (error: any) {
      console.error('Upload error', error)
      alert('Asegúrate de haber creado el bucket "covers" usando el SQL que te envié y tener permisos.')
    } finally {
      setIsUploading(false)
    }
  }

  const getPatternStyle = (pattern: string) => {
    if (pattern === 'dots') return { backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px', color: `${theme.color}30` }
    if (pattern === 'grid') return { backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px', color: `${theme.color}30` }
    if (pattern === 'waves') return { backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${theme.color}15 10px, transparent 10px, transparent 20px)`, color: theme.color }
    return {}
  }

  const radiusMap: any = {
    'none': 'rounded-none',
    'md': 'rounded-md',
    'xl': 'rounded-xl',
    'full': 'rounded-3xl'
  }

  // Extraemos el contenido JSX para evitar crear componentes internos
  const editorControlsJSX = (
    <div className="space-y-8 p-1">
      <section className="space-y-4">
        <h3 className="font-bold flex items-center gap-2 text-primary border-b pb-2"><Type className="w-4 h-4"/> Textos</h3>
        <div className="space-y-2">
          <Label>Anfitrión / Anfitriones (Opcional)</Label>
          <Input 
            placeholder="Ej. La Familia Martínez"
            value={theme.hosts} 
            onChange={(e) => setTheme({ ...theme, hosts: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Título del Evento en Tarjeta (Opcional)</Label>
          <Input 
            placeholder={event.title}
            value={theme.customTitle} 
            onChange={(e) => setTheme({ ...theme, customTitle: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Mensaje Especial / Dress Code</Label>
          <Textarea 
            placeholder="Ej. ¡No faltes! Vestimenta formal."
            value={theme.message} 
            onChange={(e) => setTheme({ ...theme, message: e.target.value })}
            className="resize-none"
            rows={2}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-bold flex items-center gap-2 text-primary border-b pb-2"><Palette className="w-4 h-4"/> Colores y Fuentes</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Color de Letra</Label>
            <div className="flex gap-2">
              <input type="color" value={theme.color} onChange={(e) => setTheme({ ...theme, color: e.target.value })} className="w-full h-9 rounded cursor-pointer border-0 p-0"/>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Color de Tarjeta</Label>
            <div className="flex gap-2">
              <input type="color" value={theme.cardBg} onChange={(e) => setTheme({ ...theme, cardBg: e.target.value })} className="w-full h-9 rounded cursor-pointer border-0 p-0"/>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Estilo de Letra</Label>
          <Select value={theme.font} onValueChange={(value) => setTheme({ ...theme, font: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una fuente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Playfair Display">Tradicional y Romántica</SelectItem>
              <SelectItem value="Cinzel">Clásica y Muy Formal</SelectItem>
              <SelectItem value="Dancing Script">Cursiva Alegría</SelectItem>
              <SelectItem value="Great Vibes">Elegancia Extrema (Manuscrita)</SelectItem>
              <SelectItem value="Montserrat">Moderna y Limpia</SelectItem>
              <SelectItem value="Pacifico">Fiesta y Diversión</SelectItem>
              <SelectItem value="Lato">Sencilla y Minimalista</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-bold flex items-center gap-2 text-primary border-b pb-2"><Layout className="w-4 h-4"/> Estructura</h3>
        <div className="space-y-2">
          <Label>Bordes de la Tarjeta</Label>
          <Select value={theme.borderRadius} onValueChange={(value) => setTheme({ ...theme, borderRadius: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Cuadrados</SelectItem>
              <SelectItem value="md">Ligeramente redondeados</SelectItem>
              <SelectItem value="xl">Redondeados (Moderno)</SelectItem>
              <SelectItem value="full">Tipo Píldora</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Fondo de la Página (Patrón)</Label>
          <Select value={theme.pattern} onValueChange={(value) => setTheme({ ...theme, pattern: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Color Sólido</SelectItem>
              <SelectItem value="dots">Puntos Elegantes</SelectItem>
              <SelectItem value="grid">Cuadrícula Técnica</SelectItem>
              <SelectItem value="waves">Ondas (Vintage)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="space-y-4 pb-12">
        <h3 className="font-bold flex items-center gap-2 text-primary border-b pb-2"><ImageIcon className="w-4 h-4"/> Portada</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center hover:bg-muted/50 transition-colors">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            {isUploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground" />
            )}
            <p className="text-sm font-medium">Subir foto desde mi computadora</p>
            <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              Seleccionar Archivo
            </Button>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-muted"></div>
            <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase">O usar enlace (URL)</span>
            <div className="flex-grow border-t border-muted"></div>
          </div>

          <div className="space-y-2">
            <Input 
              placeholder="https://ejemplo.com/foto.jpg" 
              value={theme.coverImage}
              onChange={(e) => setTheme({ ...theme, coverImage: e.target.value })}
            />
          </div>
        </div>
      </section>
    </div>
  )

  const previewCardJSX = (
    <div className="flex-1 w-full h-full min-h-[600px] flex flex-col items-center py-12 px-4 relative overflow-hidden bg-slate-50">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50" style={getPatternStyle(theme.pattern)} />
      
      <div className={`w-full max-w-md shadow-2xl overflow-hidden relative z-10 transition-all duration-300 ${radiusMap[theme.borderRadius]}`} 
           style={{ backgroundColor: theme.cardBg, fontFamily: FONT_MAP[theme.font] || FONT_MAP['sans'] }}>
        
        {theme.coverImage && (
          <div className="w-full h-56 bg-cover bg-center relative" style={{ backgroundImage: `url(${theme.coverImage})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}

        <div className={`relative z-10 p-8 text-center bg-white/90 backdrop-blur-sm m-4 mt-[-40px] shadow-sm border ${radiusMap[theme.borderRadius]}`} style={{ backgroundColor: theme.cardBg }}>
          
          {theme.hosts ? (
            <p className="tracking-wide text-sm font-medium mb-3 opacity-80">{theme.hosts}</p>
          ) : (
            <p className="uppercase tracking-widest text-xs font-bold mb-3" style={{ color: theme.color }}>Estás invitado a</p>
          )}
          
          <h2 className="text-4xl font-bold mb-4 leading-tight">{theme.customTitle || event.title}</h2>
          
          <div className="w-12 h-1 mx-auto my-6 rounded" style={{ backgroundColor: theme.color }} />
          
          <div className="space-y-2 mb-6 text-sm text-gray-700">
            <p className="font-bold text-base" style={{ color: theme.color }} suppressHydrationWarning>
              {new Date(event.event_date).toLocaleString()}
            </p>
            <p className="opacity-80">{event.location}</p>
          </div>

          {theme.message && (
            <div className="mb-8 text-sm italic text-gray-600 bg-gray-50 p-3 rounded-lg border">
              "{theme.message}"
            </div>
          )}

          <Button type="button" className={`w-full pointer-events-none shadow-lg transition-transform text-white text-base py-6 ${radiusMap[theme.borderRadius]}`} style={{ backgroundColor: theme.color }}>
            Confirmar Asistencia
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-muted/20">
      <header className="px-4 h-14 flex items-center border-b bg-background justify-between z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/event/${event.id}`}>
            <Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4"/> Cancelar</Button>
          </Link>
          <span className="font-semibold text-sm hidden sm:inline-block">Diseñando: {event.title}</span>
        </div>
        <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="w-4 h-4"/> {isSaving ? 'Guardando...' : 'Guardar Diseño'}
        </Button>
      </header>

      {/* VISTA DESKTOP (Split Screen) */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <ScrollArea className="w-[450px] border-r bg-background shadow-inner z-10">
          <div className="p-6">
            {editorControlsJSX}
          </div>
        </ScrollArea>
        <div className="flex-1 overflow-y-auto">
          {previewCardJSX}
        </div>
      </div>

      {/* VISTA MOBILE (Tabs) */}
      <div className="md:hidden flex-1 overflow-hidden flex flex-col">
        <Tabs defaultValue="editor" className="w-full flex-1 flex flex-col">
          <div className="px-4 pt-4 pb-2 bg-background border-b z-10">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="editor" className="gap-2"><PenTool className="w-4 h-4"/> Editor</TabsTrigger>
              <TabsTrigger value="preview" className="gap-2"><Eye className="w-4 h-4"/> Vista Previa</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="editor" className="flex-1 overflow-hidden m-0 data-[state=active]:flex">
            <ScrollArea className="w-full h-full bg-background px-4 py-2">
              {editorControlsJSX}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 overflow-y-auto m-0">
            {previewCardJSX}
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}
