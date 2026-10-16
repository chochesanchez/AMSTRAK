import type { MetadataRoute } from 'next'
import { SERVICES } from '@/content/site'
import { localePath } from '@/i18n/config'

const BASE = 'https://www.amstrak.com'
const PATHS = ['/', '/about', '/services', ...SERVICES.map((s) => `/services/${s.slug}`), '/quote', '/contact', '/partners']
const url = (p: string) => `${BASE}${p === '/' ? '' : p}`

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((p) => ({
    url: url(localePath('en', p)),
    lastModified: new Date(),
    alternates: { languages: { en: url(localePath('en', p)), es: url(localePath('es', p)) } },
  }))
}
