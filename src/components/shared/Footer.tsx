'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { COMPANY, SERVICES } from '@/content/site'
import { useI18n } from '@/i18n/I18nProvider'
import { basePath } from '@/i18n/config'
import LanguageSwitch from './LanguageSwitch'

export function Footer() {
  const { t, href } = useI18n()
  const path = basePath(usePathname() || '/')
  const showCta = !(path === '/' || path.startsWith('/contact') || path.startsWith('/quote'))

  return (
    <footer className="bg-am-ink text-white">
      {showCta && (
        <div className="bg-am-yellow text-am-ink">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.05] max-w-2xl">{t.footer.ctaTitle}</h2>
            <div className="flex flex-wrap gap-3">
              <Link href={href('/quote')} className="inline-flex items-center h-12 px-6 rounded-md bg-am-ink text-white font-semibold hover:bg-am-navy">{t.common.getQuote}</Link>
              <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center h-12 px-6 rounded-md border-2 border-am-ink font-semibold hover:bg-am-ink hover:text-white">{t.common.whatsapp}</a>
            </div>
          </div>
        </div>
      )}
      <div className="h-1.5 brand-rule" aria-hidden />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-12 text-[15px]">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <Image src="/brand/amstrak-mark-light.png" alt="" width={56} height={48} className="h-12 w-auto" />
            <Image src="/brand/amstrak-wordmark-light.png" alt="Amstrak" width={513} height={64} className="h-6 w-auto" />
          </div>
          <p className="mt-5 text-white/65 max-w-xs leading-relaxed">{t.footer.tagline}</p>
          <div className="mt-6"><LanguageSwitch tone="dark" /></div>
        </div>
        <div className="md:col-span-3">
          <h3 className="text-white/50 mb-4">{t.footer.services}</h3>
          <ul className="space-y-2.5">
            {SERVICES.map((s) => (
              <li key={s.slug}><Link href={href(`/services/${s.slug}`)} className="text-white/85 hover:text-am-yellow">{t.services[s.slug].name}</Link></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-white/50 mb-4">{t.footer.company}</h3>
          <ul className="space-y-2.5">
            <li><Link href={href('/about')} className="text-white/85 hover:text-am-yellow">{t.footer.about}</Link></li>
            <li><Link href={href('/quote')} className="text-white/85 hover:text-am-yellow">{t.footer.quote}</Link></li>
            <li><Link href={href('/contact')} className="text-white/85 hover:text-am-yellow">{t.footer.contactLink}</Link></li>
            <li><Link href={href('/partners')} className="text-white/85 hover:text-am-yellow">{t.footer.partners}</Link></li>
            <li><a href={COMPANY.daszaUrl} className="text-white/85 hover:text-am-yellow">{t.footer.dasza}</a></li>
            <li><a href={COMPANY.dltUrl} className="text-white/85 hover:text-am-yellow">{t.footer.dlt}</a></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h3 className="text-white/50 mb-4">{t.footer.contact}</h3>
          <ul className="space-y-2.5 text-white/85">
            <li><a href={`mailto:${COMPANY.email}`} className="hover:text-am-yellow">{COMPANY.email}</a></li>
            <li><a href={COMPANY.phoneHref} className="hover:text-am-yellow whitespace-nowrap">{COMPANY.phone}</a></li>
            <li><a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-am-yellow">WhatsApp</a></li>
            <li className="text-white/60">{COMPANY.city}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 text-xs text-white/50 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} Amstrak. {t.footer.rights}</span>
          <span>{t.footer.location}</span>
        </div>
      </div>
    </footer>
  )
}
