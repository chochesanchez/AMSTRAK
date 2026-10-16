import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowTopRightOnSquareIcon, CheckIcon } from '@heroicons/react/20/solid'
import PageIntro from '@/components/ui/PageIntro'
import { COMPANY } from '@/content/site'
import { isLang, localePath, alternatesFor } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const t = getDictionary(lang)
  return { title: t.partnersPage.title, description: t.partnersPage.description, alternates: alternatesFor(lang, '/partners') }
}

// Business partner register. The form itself is a Microsoft Form whose answers land in Amstrak's SharePoint.
export default async function PartnersPage({ params }: Props) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const t = getDictionary(lang)
  const p = t.partnersPage
  const formLink = (
    <a
      href={COMPANY.partnerFormUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 h-12 px-6 rounded-md bg-am-yellow text-am-ink font-semibold hover:bg-am-yellowDark transition-colors"
    >
      {p.cta}
      <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden />
    </a>
  )
  return (
    <>
      <PageIntro title={p.title} lead={p.lead} image="/images/site/port-ship.jpg" crumbs={[{ href: localePath(lang, '/'), label: t.common.home }]} crumbLabel={t.common.breadcrumb}>
        <div className="mt-8">{formLink}</div>
        <p className="mt-3 text-sm text-am-muted">{p.ctaNote}</p>
      </PageIntro>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 md:py-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">{p.stepsTitle}</h2>
          <ol className="mt-8 space-y-8">
            {p.steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-4">
                <span className="grid place-items-center h-12 w-12 rounded-full bg-am-navy text-white font-display text-lg font-bold">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block font-display text-xl font-bold">{s.title}</span>
                  <span className="block mt-1.5 text-am-muted leading-relaxed">
                    {s.text}
                    {i === 1 && (
                      <a href={`mailto:${COMPANY.supportEmail}`} className="block mt-1 font-semibold text-am-ink underline underline-offset-4 decoration-am-yellow">{COMPANY.supportEmail}</a>
                    )}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-am-muted">{p.docsNote}</p>
          <div className="mt-8">{formLink}</div>
        </div>
        <aside className="lg:col-span-5 rounded-xl bg-am-paper p-7 md:p-9 self-start">
          <h2 className="font-display text-2xl font-bold">{p.servicesTitle}</h2>
          <ul className="mt-5 space-y-2.5">
            {p.services.map((s) => (
              <li key={s} className="flex items-start gap-2.5">
                <CheckIcon className="h-5 w-5 mt-0.5 shrink-0 text-am-orange" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </>
  )
}
