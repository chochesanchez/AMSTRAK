'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { basePath, localePath, LOCALES } from '@/i18n/config'
import { useI18n } from '@/i18n/I18nProvider'

export default function LanguageSwitch({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { lang, t } = useI18n()
  const path = basePath(usePathname() || '/')
  return (
    <div role="group" aria-label={t.nav.language} className={`inline-flex rounded-md border p-0.5 text-[13px] font-semibold ${tone === 'dark' ? 'border-white/25' : 'border-am-line'}`}>
      {LOCALES.map((l) => {
        const on = l === lang
        return (
          <Link
            key={l}
            href={localePath(l, path)}
            hrefLang={l}
            lang={l}
            aria-current={on ? 'true' : undefined}
            className={`px-2 py-1 rounded uppercase transition-colors ${
              on ? (tone === 'dark' ? 'bg-am-yellow text-am-ink' : 'bg-am-ink text-white') : tone === 'dark' ? 'text-white/70 hover:text-white' : 'text-am-muted hover:text-am-ink'
            }`}
          >
            {l}
          </Link>
        )
      })}
    </div>
  )
}
