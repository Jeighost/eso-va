import type { InviteEvent } from '@/components/invitation/InvitationCard'
import { getPreset, PRESETS, applyPreset } from './presets'
import { DEFAULT_THEME, type InvitationTheme } from './theme'

/** Demo content used by the marketing pages. */
export const SAMPLE_EVENTS: Record<string, { event: InviteEvent; theme: Partial<InvitationTheme> }> = {
  marfil: { event: sample('Valeria & Andrés', 'Hacienda San Gabriel, Querétaro'), theme: { hosts: 'Junto a sus familias', eyebrow: 'Nos casamos' } },
  noche: { event: sample('Graduación 2027', 'Terraza Skyline, Bogotá'), theme: { eyebrow: 'Generación 2027' } },
  jardin: { event: sample('Camila & Mateo', 'Jardín Botánico, Lisboa'), theme: { hosts: 'Con la bendición de sus padres', language: 'pt', eyebrow: 'Vamos casar' } },
  deco: { event: sample('Gala 25 Aniversario', 'Hotel Palace, Madrid'), theme: { eyebrow: 'Soirée de Gala' } },
  terracota: { event: sample('Lucía & Diego', 'Viñedo El Encanto, Mendoza'), theme: { eyebrow: 'Save the date' } },
  rosa: { event: sample('Mis XV · Sofía', 'Salón Versalles, Guadalajara'), theme: { hosts: 'Mis papás y yo te invitamos', eyebrow: 'Mis quince años' } },
  fiesta: { event: sample('¡Mateo cumple 30!', 'Rooftop Condesa, CDMX'), theme: { eyebrow: '¡A celebrar!' } },
  minimal: { event: sample('Emma & Noah', 'The Glasshouse, London'), theme: { language: 'en', eyebrow: 'Together with their families' } },
  lavanda: { event: sample('Baby Shower · Olivia', 'Casa Lavanda, Santiago'), theme: { eyebrow: 'Viene en camino' } },
  corporativo: { event: sample('Summit Innovación 2027', 'Centro Banamex, CDMX'), theme: { eyebrow: 'Conferencia anual' } },
}

function sample(title: string, location: string): InviteEvent {
  return { id: `sample-${title}`, title, location, event_date: '2027-06-12T23:30:00.000Z', allow_photos: true, allow_songs: true }
}

export function sampleFor(presetId: string) {
  const preset = getPreset(presetId) ?? PRESETS[0]
  const s = SAMPLE_EVENTS[preset.id] ?? SAMPLE_EVENTS.marfil
  const theme: InvitationTheme = { ...applyPreset(DEFAULT_THEME, preset), timezone: 'America/Mexico_City', showCountdown: false, ...s.theme }
  return { event: s.event, theme }
}
