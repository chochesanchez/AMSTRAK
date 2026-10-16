import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageIntro from '@/components/ui/PageIntro'
import ModeIcon from '@/components/ui/ModeIcon'
import TextButton from '@/components/ui/TextButton'
import { COMPANY, SERVICES } from '@/content/site'
import { LOCALES, isLang, localePath, alternatesFor } from '@/i18n/config'
import { getDictionary, fmt } from '@/i18n/dictionaries'

type Props = { params: Promise<{ lang: string; slug: string }> }

// Services the quote form can preselect.
const QUOTABLE = new Set(['ocean', 'air', 'land', 'cross-border', 'customs', 'warehousing'])

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => SERVICES.map((s) => ({ lang, slug: s.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  const service = SERVICES.find((s) => s.slug === slug)
  if (!isLang(lang) || !service) return {}
  const copy = getDictionary(lang).services[service.slug]
  return { title: copy.name, description: copy.summary, alternates: alternatesFor(lang, `/services/${service.slug}`), openGraph: { images: [{ url: service.image }] } }
}

export default async function ServicePage({ params }: Props) {
  const { lang, slug } = await params
  const service = SERVICES.find((s) => s.slug === slug)
  if (!isLang(lang) || !service) notFound()
  const t = getDictionary(lang)
  const copy = t.services[service.slug]
  const href = (p: string) => localePath(lang, p)
  const others = SERVICES.filter((s) => s.slug !== service.slug)
  const partner = service.partner === 'dasza' ? { name: 'Dasza', url: COMPANY.daszaUrl } : service.partner === 'dlt' ? { name: 'DLT Logistics', url: COMPANY.dltUrl } : null
  const quoteHref = href(QUOTABLE.has(service.slug) ? `/quote?service=${service.slug}` : '/quote')

  return (
    <>
      <PageIntro
        title={copy.name}
        lead={copy.summary}
        image={service.image}
        crumbs={[{ href: href('/'), label: t.common.home }, { href: href('/services'), label: t.common.services }]}
        crumbLabel={t.common.breadcrumb}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={quoteHref} className="inline-flex items-center h-12 px-6 rounded-md bg-am-yellow text-am-ink font-semibold hover:bg-am-yellowDark">{t.common.getQuote}</Link>
          <Link href={href('/contact')} className="inline-flex items-center h-12 px-6 rounded-md border-2 border-am-ink font-semibold hover:bg-am-ink hover:text-white">{t.common.talk}</Link>
        </div>
      </PageIntro>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">{t.servicePage.included}</h2>
          {partner && (
            <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-am-muted">
              {fmt(t.servicePage.groupNote, { company: partner.name })}
              <TextButton href={partner.url} external>{fmt(t.servicePage.visit, { company: partner.name })}</TextButton>
            </p>
          )}
        </div>
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {copy.features.map((f) => (
            <li key={f.title} className="border-t-[3px] border-am-yellow pt-5">
              <h3 className="font-display text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-am-muted leading-relaxed">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-am-paper">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 md:py-20">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-8">{t.servicePage.others}</h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={href(`/services/${o.slug}`)} className="group flex h-full gap-4 border-t-2 border-am-ink pt-4">
                  <ModeIcon slug={o.slug} className="h-6 w-6 shrink-0 mt-1 text-am-navy" />
                  <span>
                    <span className="block font-display text-xl font-bold group-hover:text-am-navy group-hover:underline decoration-am-yellow decoration-[3px] underline-offset-4">{t.services[o.slug].name}</span>
                    <span className="block mt-1.5 text-am-muted">{t.services[o.slug].summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
