import Link from 'next/link'
import { ArrowRight, Check, Music2, Heart } from 'lucide-react'
import { Wordmark, Divider } from '@/components/invitation/artwork'
import { CardThumbnail } from '@/components/invitation/CardThumbnail'
import { PRESETS } from '@/lib/invitation/presets'
import { sampleFor } from '@/lib/invitation/samples'
import { buttonVariants } from '@/components/ui/button'
import { IconCalendar, IconChart, IconDesign, IconGlobe, IconMusic, IconPhotos, IconQr, IconRsvp, IconShare } from '@/components/brand/illustrations'

const FEATURES = [
  { icon: IconDesign, title: 'Estudio de diseño', body: '10 plantillas de autor, 14 tipografías, marcos, ornamentos, texturas y paletas. Cada detalle es tuyo.' },
  { icon: IconRsvp, title: 'RSVP en tiempo real', body: 'Tus invitados confirman en segundos, con acompañantes y fecha límite. Tú ves la lista al instante.' },
  { icon: IconMusic, title: 'Playlist colaborativa', body: 'Cada invitado sugiere su canción. Copia la lista para tu DJ o búscalas en Spotify con un clic.' },
  { icon: IconPhotos, title: 'Galería compartida', body: 'Recibe las fotos que toman tus invitados, en un solo álbum, sin grupos ni apps extra.' },
  { icon: IconGlobe, title: 'Cinco idiomas', body: 'Español, inglés, portugués, francés e italiano, con fechas y horarios en la zona del evento.' },
  { icon: IconCalendar, title: 'Cuenta regresiva y calendario', body: 'Agenda con Google, Apple u Outlook, mapa para llegar y programa del día.' },
  { icon: IconShare, title: 'Comparte donde sea', body: 'WhatsApp, correo o redes, con una vista previa elegante generada para cada invitación.' },
  { icon: IconQr, title: 'Código QR imprimible', body: 'Descárgalo en alta resolución para invitaciones físicas, mesas o pantallas.' },
  { icon: IconChart, title: 'Panel de control', body: 'Métricas de asistencia, búsqueda de invitados y exportación a Excel (CSV).' },
]

const FAQ = [
  ['¿Mis invitados necesitan descargar algo?', 'No. La invitación se abre en cualquier navegador, desde el enlace que compartes por WhatsApp, correo o redes sociales.'],
  ['¿Puedo cambiar el diseño después de enviarla?', 'Sí. Cualquier cambio que guardes en el estudio se refleja al instante en el mismo enlace. No tienes que reenviar nada.'],
  ['¿Funciona para invitados en otros países?', 'Sí. Eliges el idioma de la invitación y la zona horaria del evento; la fecha y la hora siempre se muestran correctamente.'],
  ['¿Cómo veo quién confirmó?', 'En tu panel ves cada respuesta con acompañantes, puedes buscar, filtrar y exportar la lista a CSV para Excel o Google Sheets.'],
  ['¿Puedo usar mis propias fotos?', 'Claro. Sube tu foto de portada o elige una de nuestras ilustraciones originales, creadas especialmente para Eso Va.'],
]

export default function Home() {
  const hero = [sampleFor('noche'), sampleFor('marfil'), sampleFor('jardin')]

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-transparent bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Link href="/" aria-label="Eso Va — inicio">
            <Wordmark />
          </Link>
          <nav className="ml-6 hidden gap-1 text-sm font-medium text-foreground/75 md:flex">
            <a href="#plantillas" className="rounded-lg px-3 py-2 hover:bg-muted hover:text-foreground">Plantillas</a>
            <a href="#funciones" className="rounded-lg px-3 py-2 hover:bg-muted hover:text-foreground">Funciones</a>
            <a href="#como-funciona" className="rounded-lg px-3 py-2 hover:bg-muted hover:text-foreground">Cómo funciona</a>
            <a href="#preguntas" className="rounded-lg px-3 py-2 hover:bg-muted hover:text-foreground">Preguntas</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/login" className="hidden rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted sm:block">
              Entrar
            </Link>
            <Link href="/login?mode=signup" className={buttonVariants({ className: 'h-9 px-4' })}>
              Crear invitación
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="paper-grain absolute inset-0 -z-10" />
          <div className="absolute -top-40 -right-40 -z-10 size-[640px] rounded-full bg-coral/10 blur-3xl" />
          <div className="absolute -bottom-60 -left-40 -z-10 size-[560px] rounded-full bg-gold/15 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20 lg:pb-28">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-ink shadow-sm">
                <span className="size-1.5 rounded-full bg-coral" /> Invitaciones digitales de autor
              </span>
              <h1 className="mt-6 font-display text-[2.9rem] leading-[1.02] tracking-tight text-balance text-ink sm:text-6xl lg:text-7xl">
                Invitaciones que se sienten de <em className="text-coral">papel fino.</em>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Diseña una invitación inolvidable para tu boda, XV años o evento en minutos. Tus invitados confirman, piden canciones y comparten fotos — todo desde un solo enlace.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/login?mode=signup" className={buttonVariants({ size: 'lg', className: 'h-12 px-6 text-[15px]' })}>
                  Crear mi invitación gratis <ArrowRight />
                </Link>
                <a href="#plantillas" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-12 px-6 text-[15px]' })}>
                  Ver plantillas
                </a>
              </div>
              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {['Sin apps para tus invitados', 'Cambios en tiempo real', '5 idiomas'].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check className="size-4 text-success" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mx-auto h-[500px] w-full max-w-[540px] sm:h-[580px]" aria-hidden="true">
              <div className="absolute top-16 left-0 animate-float [--r:-9deg] sm:left-2" style={{ animationDelay: '-3s' }}>
                <CardThumbnail {...hero[0]} width={220} />
              </div>
              <div className="absolute top-24 right-0 animate-float [--r:8deg] sm:right-2" style={{ animationDelay: '-5s' }}>
                <CardThumbnail {...hero[2]} width={220} />
              </div>
              <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 animate-float">
                <CardThumbnail {...hero[1]} width={260} />
              </div>
              <div className="absolute bottom-16 -left-2 z-20 flex items-center gap-3 rounded-2xl border bg-card/95 p-3 pr-5 shadow-xl backdrop-blur animate-rise sm:left-4" style={{ animationDelay: '.6s' }}>
                <span className="grid size-9 place-items-center rounded-full bg-success/15 text-success">
                  <Heart className="size-4" />
                </span>
                <div className="text-sm">
                  <p className="font-semibold text-ink">Mariana confirmó</p>
                  <p className="text-xs text-muted-foreground">+1 acompañante · hace 2 min</p>
                </div>
              </div>
              <div className="absolute right-0 bottom-4 z-20 flex items-center gap-3 rounded-2xl border bg-card/95 p-3 pr-5 shadow-xl backdrop-blur animate-rise sm:right-6" style={{ animationDelay: '.9s' }}>
                <span className="grid size-9 place-items-center rounded-full bg-coral-soft text-coral">
                  <Music2 className="size-4" />
                </span>
                <div className="text-sm">
                  <p className="font-semibold text-ink">Nueva canción</p>
                  <p className="text-xs text-muted-foreground">“Vivir mi vida” · Marc Anthony</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Occasions */}
        <section className="border-y bg-card">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-6 text-sm font-medium text-muted-foreground sm:px-6">
            {['Bodas', 'XV años', 'Cumpleaños', 'Bautizos', 'Baby showers', 'Graduaciones', 'Aniversarios', 'Eventos corporativos'].map((o) => (
              <span key={o} className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="size-1.5 rotate-45 bg-gold" />
                {o}
              </span>
            ))}
          </div>
        </section>

        {/* Templates */}
        <section id="plantillas" className="scroll-mt-20 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Plantillas de autor" title="Un punto de partida para cada estilo" body="Diez diseños originales con ilustraciones propias. Elige uno y personalízalo hasta el último detalle." />
            <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
              {PRESETS.map((p) => {
                const s = sampleFor(p.id)
                return (
                  <Link key={p.id} href="/login?mode=signup" className="group block">
                    <div className="overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_30px_60px_-30px_rgba(16,40,74,.45)]">
                      <div className="h-72 overflow-hidden">
                        <CardThumbnail event={s.event} theme={s.theme} width={170} backdrop className="h-full [&>div:last-child]:pt-6" />
                      </div>
                    </div>
                    <p className="mt-3 font-display text-lg text-ink">{p.name}</p>
                    <p className="text-sm leading-snug text-muted-foreground">{p.tagline}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Studio */}
        <section className="relative overflow-hidden bg-ink py-20 text-paper sm:py-28">
          <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(60% 60% at 80% 20%, #2c4468 0%, transparent 70%), radial-gradient(50% 50% at 0% 100%, #f0564a40 0%, transparent 70%)' }} />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold tracking-wide text-coral">Estudio de diseño</p>
              <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight text-balance sm:text-5xl">Personalización real, no solo cambiar un color.</h2>
              <p className="mt-5 max-w-lg text-lg text-paper/70">Edita con vista previa en vivo en móvil y escritorio, con deshacer ilimitado y guardado instantáneo.</p>
              <ul className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {[
                  ['4 composiciones', 'Clásica, editorial, minimal y enmarcada'],
                  ['14 tipografías', 'Serif, caligráficas y modernas'],
                  ['8 ornamentos · 5 marcos', 'Arte vectorial original'],
                  ['10 texturas de fondo', 'Con intensidad ajustable'],
                  ['Paletas + color libre', 'Con aviso de contraste accesible'],
                  ['Secciones a la medida', 'Programa, vestimenta, regalos, mapa'],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-coral text-white">
                      <Check className="size-3" />
                    </span>
                    <span>
                      <span className="block font-semibold">{t}</span>
                      <span className="text-sm text-paper/60">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mx-auto flex items-end gap-5" aria-hidden="true">
              <div className="translate-y-8 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/10">
                <CardThumbnail {...sampleFor('deco')} width={220} backdrop />
              </div>
              <div className="overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/10">
                <CardThumbnail {...sampleFor('rosa')} width={240} backdrop />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="funciones" className="scroll-mt-20 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Todo incluido" title="Mucho más que una tarjeta bonita" body="Cada invitación es una pequeña aplicación para tu evento, sin que tus invitados instalen nada." />
            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-card p-7 transition-colors hover:bg-paper">
                  <f.icon className="size-12" />
                  <h3 className="mt-5 font-display text-xl text-ink">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="scroll-mt-20 border-y bg-sand/50 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Cómo funciona" title="De la idea al “¡Sí, ahí estaré!” en tres pasos" />
            <ol className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                ['Crea tu evento', 'Nombre, fecha, lugar y zona horaria. Elige qué pueden hacer tus invitados.'],
                ['Diseña tu invitación', 'Parte de una plantilla y ajusta textos, colores, tipografía, portada y secciones.'],
                ['Compártela y relájate', 'Envíala por WhatsApp o con un QR. Las respuestas llegan a tu panel en tiempo real.'],
              ].map(([t, d], i) => (
                <li key={t} className="relative rounded-3xl border bg-card p-8">
                  <span className="font-display text-6xl text-coral/90 italic">{i + 1}</span>
                  <h3 className="mt-4 font-display text-2xl text-ink">{t}</h3>
                  <p className="mt-2 text-muted-foreground">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section id="preguntas" className="scroll-mt-20 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionHeading eyebrow="Preguntas frecuentes" title="Todo lo que quieres saber" />
            <div className="mt-12 divide-y rounded-3xl border bg-card">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                    {q}
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-lg leading-none transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20 sm:px-6 sm:pb-28">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-coral px-6 py-16 text-center text-white sm:px-16">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
            <Divider kind="flourish" className="relative mx-auto h-6 w-56 text-white/80" />
            <h2 className="relative mt-5 font-display text-4xl leading-tight tracking-tight text-balance sm:text-5xl">Tu celebración merece una gran primera impresión.</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/85">Crea tu invitación ahora. Sin tarjeta de crédito.</p>
            <Link href="/login?mode=signup" className="relative mt-9 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 text-[15px] font-semibold text-ink shadow-lg transition-transform hover:-translate-y-0.5">
              Empezar gratis <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <Wordmark />
          <p>© {new Date().getFullYear()} Eso Va. Hecho con cariño para celebrar.</p>
        </div>
      </footer>
    </div>
  )
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold tracking-wide text-coral">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight text-balance text-ink sm:text-5xl">{title}</h2>
      {body && <p className="mt-4 text-lg text-muted-foreground">{body}</p>}
    </div>
  )
}
