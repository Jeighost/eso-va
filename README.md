# Eso Va — Invitaciones digitales premium

Plataforma para diseñar invitaciones digitales interactivas (bodas, XV años, cumpleaños, eventos corporativos…) con confirmación RSVP, playlist colaborativa y galería de fotos, compartibles por un solo enlace.

## Funcionalidades

**Estudio de diseño** (`/studio/[id]`)
- 10 plantillas de autor con portadas SVG originales (`public/covers`).
- 4 composiciones (clásica, editorial, minimal, enmarcada), 14 tipografías, 8 ornamentos, 5 marcos y 10 texturas vectoriales.
- Paletas curadas + color libre con aviso de contraste (WCAG).
- Contenido: frase superior, anfitriones, mensaje, programa del evento, código de vestimenta, mesa de regalos, enlace de mapa, texto del botón.
- Secciones activables: cuenta regresiva, programa, agendar (Google / .ics), cómo llegar.
- RSVP: límite de acompañantes y fecha límite.
- Vista previa en vivo (móvil / escritorio), deshacer/rehacer (Ctrl+Z / Ctrl+Shift+Z), guardar con Ctrl+S, aviso de cambios sin guardar.

**Invitación pública** (`/invite/[token]`)
- 5 idiomas (es, en, pt, fr, it) y fechas en la zona horaria del evento.
- RSVP, sugerencia de canciones y subida múltiple de fotos (solo si el anfitrión lo habilitó).
- Imagen Open Graph generada dinámicamente para WhatsApp y redes.

**Panel** (`/dashboard`)
- Métricas de asistencia, lista de invitados con búsqueda, filtros, exportación CSV y borrado.
- Playlist (copiar lista / buscar en Spotify) y galería con visor.
- Compartir por WhatsApp (mensaje editable), correo, menú nativo y código QR (PNG/SVG).
- Edición de datos del evento y eliminación segura.

## Stack

Next.js 16 (App Router, `proxy.ts`), React 19, Tailwind CSS 4, Base UI, Supabase (Auth, Postgres, Storage).

## Configuración

```bash
npm install
cp .env.example .env.local   # completa las variables
npm run dev
```

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase |
| `NEXT_PUBLIC_SITE_URL` | (Opcional) URL pública, p. ej. `https://esova.app`. Si falta se deduce de la petición. |

### Supabase

- Tablas usadas: `profiles(id, name)`, `events(id, user_id, title, event_type, event_date, location, allow_photos, allow_songs, theme_id, unique_token, created_at)`, `guests`, `song_requests`, `photos`.
- El diseño se guarda como JSON versionado en `events.theme_id`; los diseños antiguos se migran automáticamente al leerlos (`src/lib/invitation/theme.ts`).
- Buckets de Storage públicos: `covers` (portadas) y `gallery` (fotos de invitados).
- Para borrar respuestas, canciones y fotos desde el panel, el dueño del evento necesita políticas RLS de `delete` en `guests`, `song_requests` y `photos`.
- En *Auth → URL Configuration* añade `https://TU-DOMINIO/auth/callback` como Redirect URL (confirmación de correo y recuperación de contraseña).
