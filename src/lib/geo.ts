// Approximate visitor location from Vercel's edge headers (no input needed from the visitor).
// Empty when running locally or outside Vercel.
export function locationFromHeaders(headers: Headers): string | undefined {
  const decode = (v: string | null) => {
    if (!v) return undefined
    try {
      return decodeURIComponent(v)
    } catch {
      return v
    }
  }
  const parts = [
    decode(headers.get('x-vercel-ip-city')),
    decode(headers.get('x-vercel-ip-country-region')),
    decode(headers.get('x-vercel-ip-country')),
  ].filter(Boolean)
  return parts.length ? parts.join(', ') : undefined
}
