'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useI18n } from '@/i18n/I18nProvider'
import { basePath } from '@/i18n/config'
import LanguageSwitch from './LanguageSwitch'

export function Header() {
  const { t, href } = useI18n()
  const pathname = usePathname() || '/'
  const current = basePath(pathname)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const NAV = [
    { path: '/services', label: t.nav.services },
    { path: '/#how-it-works', label: t.nav.how },
    { path: '/about', label: t.nav.about },
    { path: '/partners', label: t.nav.partners },
    { path: '/contact', label: t.nav.contact },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (p: string) => !p.includes('#') && current.startsWith(p)

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-[0_1px_0_#E4E2DC]' : ''}`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 md:h-[72px] flex items-center justify-between gap-6">
        <Link href={href('/')} className="flex items-center gap-2.5 shrink-0" aria-label={t.nav.home}>
          <Image src="/brand/amstrak-mark.png" alt="" width={47} height={40} className="h-9 w-auto" priority />
          <Image src="/brand/amstrak-wordmark.png" alt="Amstrak" width={513} height={64} className="h-[18px] md:h-5 w-auto" priority />
        </Link>

        <nav aria-label={t.nav.main} className="hidden lg:flex items-center gap-7 text-[15px] font-medium">
          {NAV.map((item) => (
            <Link
              key={item.path}
              href={href(item.path)}
              aria-current={isActive(item.path) ? 'page' : undefined}
              className={`py-2 border-b-[3px] transition-colors ${isActive(item.path) ? 'border-am-yellow text-am-ink' : 'border-transparent text-am-muted hover:text-am-ink'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block"><LanguageSwitch /></div>
          <Link href={href('/quote')} className="hidden sm:inline-flex items-center h-11 px-5 rounded-md bg-am-yellow text-am-ink font-semibold hover:bg-am-yellowDark transition-colors">
            {t.nav.quote}
          </Link>
          <button
            className="lg:hidden grid place-items-center h-10 w-10 -mr-2"
            aria-label={open ? t.nav.close : t.nav.open}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="lg:hidden fixed inset-x-0 top-16 md:top-[72px] bottom-0 bg-white overflow-y-auto">
        <nav aria-label={t.nav.mobile} className="px-5 sm:px-8 py-6 flex flex-col">
          {NAV.map((item) => (
            <Link key={item.path} href={href(item.path)} className="font-display text-2xl font-bold py-4 border-b border-am-line">
              {item.label}
            </Link>
          ))}
          <div className="mt-8 flex items-center gap-4">
            <LanguageSwitch />
            <Link href={href('/quote')} className="flex-1 inline-flex justify-center items-center h-12 rounded-md bg-am-yellow font-semibold">
              {t.nav.quote}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
