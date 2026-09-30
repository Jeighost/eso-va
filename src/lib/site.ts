/** Public base URL of the app, used for absolute links (invites, OG images). */
export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

/** Base URL for the current request (honours proxies), falling back to `siteUrl()`. */
export async function requestBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return siteUrl()
  const { headers } = await import('next/headers')
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  if (!host) return siteUrl()
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}
