import { redirect } from 'next/navigation'

/** Legacy URL — the editor now lives in the full-screen studio. */
export default async function LegacyEditRedirect(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  redirect(`/studio/${id}`)
}
