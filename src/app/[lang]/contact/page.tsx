import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageIntro from '@/components/ui/PageIntro'
import BusinessContactForm from '@/components/ui/BusinessContactForm'
import { COMPANY } from '@/content/site'
import { isLang, localePath, alternatesFor } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const t = getDictionary(lang)
  return { title: t.nav.contact, description: t.contactPage.description, alternates: alternatesFor(lang, '/contact') }
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const t = getDictionary(lang)
  const c = t.contactPage
  return (
    <>
      <PageIntro title={c.title} lead={c.lead} crumbs={[{ href: localePath(lang, '/'), label: t.common.home }]} crumbLabel={t.common.breadcrumb} />
      <section className="bg-am-paper">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 md:py-20 grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 rounded-xl bg-white border border-am-line p-6 sm:p-8">
            <BusinessContactForm />
          </div>
          <aside className="lg:col-span-4 rounded-xl bg-am-ink text-white p-7 flex flex-col gap-6">
            <div>
              <h2 className="text-white/55 text-sm">{c.quotes}</h2>
              <a href={`mailto:${COMPANY.email}`} className="font-display text-xl font-bold hover:text-am-yellow">{COMPANY.email}</a>
            </div>
            <div>
              <h2 className="text-white/55 text-sm">{c.phone}</h2>
              <a href={COMPANY.phoneHref} className="font-display text-xl font-bold whitespace-nowrap hover:text-am-yellow">{COMPANY.phone}</a>
            </div>
            <div>
              <h2 className="text-white/55 text-sm">{c.offices}</h2>
              <p className="leading-relaxed">{c.officesText}</p>
            </div>
            <div>
              <h2 className="text-white/55 text-sm">{c.partners}</h2>
              <Link href={localePath(lang, '/partners')} className="underline underline-offset-4 decoration-am-yellow hover:text-am-yellow">{c.partnersLink}</Link>
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center h-11 px-5 rounded-md bg-[#25D366] text-am-ink font-semibold">{t.common.whatsapp}</a>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
