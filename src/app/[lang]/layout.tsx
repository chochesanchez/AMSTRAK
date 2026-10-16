import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import '../globals.css'
import { LOCALES, isLang, alternatesFor } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { I18nProvider } from '@/i18n/I18nProvider'
import { COMPANY } from '@/content/site'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-jakarta', display: 'swap' })

const SITE_URL = 'https://www.amstrak.com'
const WA_PATH = 'M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.49 0 .2 5.29.2 11.86c0 2.09.55 4.13 1.6 5.94L0 24l6.35-1.66a11.77 11.77 0 0 0 5.71 1.46h.01c6.56 0 11.86-5.29 11.86-11.86 0-3.17-1.24-6.16-3.41-8.4ZM12.07 21.2h-.01a9.83 9.83 0 0 1-5.01-1.38l-.36-.21-3.77.99 1-3.67-.24-.38a9.84 9.84 0 0 1-1.51-5.22c0-5.43 4.42-9.85 9.86-9.85a9.82 9.82 0 0 1 6.97 2.88 9.81 9.81 0 0 1 2.89 6.97c0 5.43-4.42 9.85-9.86 9.85Zm5.56-7.36c-.3-.15-1.77-.87-2.04-.98-.27-.1-.47-.15-.66.16-.2.3-.76.98-.93 1.18-.17.2-.34.23-.64.08-.3-.15-1.27-.47-2.41-1.5-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.47.13-.62.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.58-.91-2.16-.24-.58-.49-.5-.66-.5-.17 0-.37-.02-.56-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.08 1.77-.73 2.02-1.43.25-.7.25-1.3.18-1.43-.07-.13-.27-.2-.57-.35Z'

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const t = getDictionary(lang)
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: '%s | Amstrak' },
    description: t.meta.description,
    alternates: alternatesFor(lang, '/'),
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      siteName: 'Amstrak',
      locale: lang === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
      images: [{ url: '/videos/amstrak-road-poster.jpg', width: 1920, height: 1080, alt: t.meta.ogAlt }],
    },
    twitter: { card: 'summary_large_image', title: t.meta.title, description: t.meta.description, images: ['/videos/amstrak-road-poster.jpg'] },
    icons: { icon: '/favicon.png' },
  }
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Amstrak',
  url: SITE_URL,
  logo: `${SITE_URL}/brand/amstrak-logo-512.png`,
  email: COMPANY.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Querétaro', addressRegion: 'Qro.', addressCountry: 'MX' },
  contactPoint: { '@type': 'ContactPoint', email: COMPANY.email, telephone: COMPANY.phone, contactType: 'sales', areaServed: ['MX', 'US', 'CA'], availableLanguage: ['English', 'Spanish'] },
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const t = getDictionary(lang)
  return (
    <html lang={lang === 'es' ? 'es-MX' : 'en'} className={jakarta.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <I18nProvider lang={lang} dict={t}>
          <Header />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
        <a
          href={COMPANY.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.nav.whatsapp}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-[#25D366] hover:bg-[#1DA955] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white" aria-hidden>
            <path d={WA_PATH} />
          </svg>
        </a>
      </body>
    </html>
  )
}
