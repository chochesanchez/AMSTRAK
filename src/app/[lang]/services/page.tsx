import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageIntro from '@/components/ui/PageIntro'
import ModeIcon from '@/components/ui/ModeIcon'
import { CORE_SERVICES, MORE_SERVICES } from '@/content/site'
import { isLang, localePath, alternatesFor } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const t = getDictionary(lang)
  return { title: t.servicesPage.title, description: t.servicesPage.description, alternates: alternatesFor(lang, '/services') }
}

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const t = getDictionary(lang)
  return (
    <>
      <PageIntro title={t.servicesPage.title} lead={t.servicesPage.lead} crumbs={[{ href: localePath(lang, '/'), label: t.common.home }]} crumbLabel={t.common.breadcrumb} />

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 md:pt-20">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-8">{t.servicesPage.coreTitle}</h2>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
          {CORE_SERVICES.map((s) => (
            <Link key={s.slug} href={localePath(lang, `/services/${s.slug}`)} className="group block">
              <span className="relative block aspect-[16/10] rounded-xl overflow-hidden">
                <Image src={s.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <span className="absolute top-4 left-4 grid place-items-center h-11 w-11 rounded-full bg-white text-am-navy"><ModeIcon slug={s.slug} /></span>
              </span>
              <span className="block mt-5 font-display text-3xl font-extrabold tracking-tight group-hover:underline decoration-am-yellow decoration-[5px] underline-offset-[6px]">{t.services[s.slug].name}</span>
              <span className="block mt-2 text-lg text-am-muted leading-relaxed max-w-lg">{t.services[s.slug].summary}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 md:py-24">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-8">{t.servicesPage.moreTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {MORE_SERVICES.map((s) => (
            <Link key={s.slug} href={localePath(lang, `/services/${s.slug}`)} className="group block">
              <span className="relative block aspect-[4/3] rounded-xl overflow-hidden">
                <Image src={s.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </span>
              <span className="block mt-4 text-sm font-semibold text-am-orange">{s.partner === 'dasza' ? t.common.withDasza : t.common.withDlt}</span>
              <span className="block mt-1 font-display text-2xl font-extrabold tracking-tight">{t.services[s.slug].name}</span>
              <span className="block mt-2 text-am-muted leading-relaxed">{t.services[s.slug].summary}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
