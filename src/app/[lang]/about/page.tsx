import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CheckIcon } from '@heroicons/react/20/solid'
import PageIntro from '@/components/ui/PageIntro'
import TextButton from '@/components/ui/TextButton'
import { COMPANY } from '@/content/site'
import { isLang, localePath, alternatesFor } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const t = getDictionary(lang)
  return { title: t.nav.about, description: t.about.metaDescription, alternates: alternatesFor(lang, '/about') }
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const t = getDictionary(lang)
  const a = t.about
  const groupUrls = [null, COMPANY.daszaUrl, COMPANY.dltUrl]
  return (
    <>
      <PageIntro
        title={a.title}
        lead={a.lead}
        image="/images/site/port-aerial.jpg"
        imageAlt={a.heroAlt}
        crumbs={[{ href: localePath(lang, '/'), label: t.common.home }]}
        crumbLabel={t.common.breadcrumb}
      />

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed">
          <p>{a.p1}</p>
          <p className="text-am-muted">{a.p2}</p>
          <p className="text-am-muted">{a.p3}</p>
        </div>
        <aside className="lg:col-span-5 rounded-xl bg-am-ink text-white p-7 md:p-9 grid sm:grid-cols-2 lg:grid-cols-1 gap-8">
          {[
            { title: a.officesTitle, items: a.offices },
            { title: a.warehousesTitle, items: a.warehouses },
          ].map((block) => (
            <div key={block.title}>
              <h2 className="font-display text-2xl font-bold">{block.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {block.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-white/85">
                    <CheckIcon className="h-5 w-5 mt-0.5 shrink-0 text-am-yellow" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 grid sm:grid-cols-2 gap-6">
        {['/images/site/truck-mountains.jpg', '/images/site/rail.jpg'].map((src, i) => (
          <div key={src} className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <Image src={src} alt={a.photoAlts[i]} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 md:py-24">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-10">{a.groupTitle}</h2>
        <ul className="grid md:grid-cols-3 gap-5">
          {a.group.map((g, i) => (
            <li key={g.name} className={`rounded-xl p-6 md:p-7 flex flex-col ${i === 0 ? 'bg-am-navy text-white' : 'bg-am-paper'}`}>
              <span className="font-display text-2xl font-extrabold tracking-tight">{g.name}</span>
              <span className={`mt-2 leading-relaxed ${i === 0 ? 'text-white/80' : 'text-am-muted'}`}>{g.text}</span>
              {groupUrls[i] && (
                <span className="mt-auto pt-6">
                  <TextButton href={groupUrls[i] as string} external>{(groupUrls[i] as string).replace('https://', '').replace('www.', '')}</TextButton>
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
