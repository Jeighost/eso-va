import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Ticket } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center gap-2" href="/">
          <img src="/logo.jpg" alt="Eso Va Logo" className="w-8 h-8 rounded-md object-cover shadow-sm border border-muted" />
          <span className="font-bold text-2xl tracking-tighter text-primary">Eso Va</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4 flex items-center" href="#features">
            Características
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">Iniciar Sesión</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/40">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Tus invitaciones digitales, interactivas e inolvidables
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Crea invitaciones personalizadas para bodas, cumpleaños y eventos. Compártelas por WhatsApp y deja que tus invitados confirmen, sugieran canciones y suban fotos.
                </p>
              </div>
              <div className="space-x-4 mt-6">
                <Link href="/login">
                  <Button size="lg">Comenzar Gratis</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Todo lo que necesitas</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-4 bg-primary/10 rounded-full">
                  <svg className="w-6 h-6 text-primary" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <h3 className="text-xl font-bold">Distribución por WhatsApp</h3>
                <p className="text-muted-foreground">Comparte enlaces únicos con vistas previas enriquecidas que sorprenden desde el primer click.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-4 bg-primary/10 rounded-full">
                  <svg className="w-6 h-6 text-primary" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                </div>
                <h3 className="text-xl font-bold">Confirmación Fácil (RSVP)</h3>
                <p className="text-muted-foreground">Lleva el control de tu lista de invitados en tiempo real. Sin complicaciones ni hojas de cálculo.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-4 bg-primary/10 rounded-full">
                  <svg className="w-6 h-6 text-primary" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
                <h3 className="text-xl font-bold">Galería y Música</h3>
                <p className="text-muted-foreground">Deja que tus invitados sugieran canciones y suban las fotos del evento a un álbum compartido.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2026 Eso Va. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
