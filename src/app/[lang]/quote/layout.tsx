import type { Metadata } from 'next'
import { Suspense } from 'react'
import { isLang, alternatesFor } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const t = getDictionary(lang)
  return { title: t.quote.title, description: t.quote.lead, alternates: alternatesFor(lang, '/quote') }
}

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  // The quote form reads ?service= from the URL, which needs a Suspense boundary when prerendered.
  return <Suspense>{children}</Suspense>
}
