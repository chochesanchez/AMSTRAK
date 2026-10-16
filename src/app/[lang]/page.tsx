import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import BusinessContactForm from '@/components/ui/BusinessContactForm'
import ModeIcon from '@/components/ui/ModeIcon'
import TextButton from '@/components/ui/TextButton'
import VideoHero from '@/components/home/VideoHero'
import NetworkMap from '@/components/home/NetworkMap'
import OrderFlow from '@/components/home/OrderFlow'
import CountUp from '@/components/motion/CountUp'
import { COMPANY, CORE_SERVICES, KPI_VALUES, MORE_SERVICES } from '@/content/site'
import { isLang, localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

// Shared column template so the "Beyond the freight" header lines up with the rows below it.
const MORE_COLS = 'md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_10rem]'

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const t = getDictionary(lang)
  const href = (p: string) => localePath(lang, p)

  return (
    <>
      {/* Hero: looping port video pinned under the header */}
      <VideoHero
        desktop={{ mp4: '/videos/amstrak-port-1080.mp4', webm: '/videos/amstrak-port-1080.webm' }}
        mobile={{ mp4: '/videos/amstrak-port-720.mp4', webm: '/videos/amstrak-port-720.webm' }}
        poster="/videos/amstrak-port-poster.jpg"
        label={t.home.videoLabel}
        scrollHint={t.home.scrollHint}
      >
        <p className="text-white/80 font-medium text-sm sm:text-base">{t.home.identity}</p>
        <h1 className="mt-4 font-display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-balance">{t.home.heroTitle}</h1>
        <p className="mt-6 text-lg md:text-xl leading-relaxed max-w-2xl text-white/85">{t.home.heroText}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={href('/quote')} className="inline-flex items-center h-12 px-6 rounded-md bg-am-yellow text-am-ink font-semibold hover:bg-am-yellowDark transition-colors">
            {t.common.getQuote}
          </Link>
          <Link href={href('/services')} className="inline-flex items-center h-12 px-6 rounded-md border-2 border-white/70 text-white font-semibold backdrop-blur-sm hover:bg-white hover:text-am-ink transition-colors">
            {t.common.seeServices}
          </Link>
        </div>
      </VideoHero>

      {/* Content layer: slides up over the pinned video */}
      <div className="relative z-10 -mt-6 rounded-t-[28px] overflow-clip bg-white shadow-[0_-24px_48px_-12px_rgba(0,0,0,0.35)]">
        {/* Freight modes */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 md:pt-24 pb-16 md:pb-24">
          <div className="grid lg:grid-cols-12 gap-6 items-end mb-10 md:mb-12">
            <h2 className="lg:col-span-6 font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] text-balance">{t.home.modesTitle}</h2>
            <p className="lg:col-span-6 text-lg text-am-muted leading-relaxed">{t.home.modesText}</p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {CORE_SERVICES.map((s) => {
              const copy = t.services[s.slug]
              return (
                <li key={s.slug}>
                  <Link href={href(`/services/${s.slug}`)} className="group relative block aspect-[4/3] sm:aspect-[16/11] rounded-xl overflow-hidden bg-am-ink text-white">
                    <Image src={s.image} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-am-ink via-am-ink/55 to-am-ink/0" aria-hidden />
                    <span className="absolute top-4 left-4 grid place-items-center h-11 w-11 rounded-full bg-white/95 text-am-navy">
                      <ModeIcon slug={s.slug} />
                    </span>
                    <span className="absolute top-4 right-4 grid place-items-center h-10 w-10 rounded-full bg-am-yellow text-am-ink opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100" aria-hidden>
                      <ArrowUpRightIcon className="h-5 w-5" />
                    </span>
                    <span className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                      <span className="block font-display text-2xl md:text-3xl font-extrabold tracking-tight">{copy.name}</span>
                      <span className="block mt-2 text-white/80 leading-relaxed max-w-md">{copy.summary}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        {/* KPI band */}
        <section className="bg-am-ink text-white">
          <div className="h-1.5 brand-rule" aria-hidden />
          <dl className="mx-auto max-w-7xl px-5 sm:px-8 grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {t.kpis.map((k, i) => {
              const v = KPI_VALUES[i]
              return (
                <div key={k.label} className="py-7 sm:py-9 sm:px-8 sm:first:pl-0 flex flex-col">
                  <dt className="order-2 mt-2 text-white/75 leading-snug">{k.label}</dt>
                  <dd className="order-1 font-display text-4xl md:text-5xl font-extrabold tracking-tight text-am-yellow leading-none">
                    {v.count ? <CountUp value={v.value} /> : v.value}
                  </dd>
                </div>
              )
            })}
          </dl>
        </section>

        {/* Customs, warehousing, delivery */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 md:py-28">
          <div className={`grid gap-4 md:gap-x-8 ${MORE_COLS} items-end mb-10`}>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">{t.home.moreTitle}</h2>
            <p className="text-lg text-am-muted leading-relaxed">{t.home.moreText}</p>
          </div>
          <ul className="border-t-2 border-am-ink">
            {MORE_SERVICES.map((s) => {
              const copy = t.services[s.slug]
              const badge = s.partner === 'dasza' ? t.common.withDasza : t.common.withDlt
              return (
                <li key={s.slug} className="border-b border-am-line">
                  <Link href={href(`/services/${s.slug}`)} className="group block py-6 md:py-7">
                    {/* Phones: thumbnail beside the text */}
                    <span className="md:hidden grid grid-cols-[6.5rem_1fr] gap-4 items-start">
                      <span className="relative block aspect-[4/3] rounded-md overflow-hidden">
                        <Image src={s.image} alt="" fill sizes="104px" className="object-cover" />
                      </span>
                      <span>
                        <span className="block font-display text-xl font-bold leading-tight">{copy.name}</span>
                        <span className="inline-block mt-1.5 text-xs font-semibold text-am-orange">{badge}</span>
                        <span className="block mt-1 text-am-muted leading-relaxed">{copy.summary}</span>
                      </span>
                    </span>
                    {/* Desktop: name, summary, photo in shared columns */}
                    <span className={`hidden md:grid gap-x-8 ${MORE_COLS} items-center`}>
                      <span>
                        <span className="block font-display text-3xl lg:text-4xl font-extrabold tracking-tight group-hover:underline decoration-am-yellow decoration-[5px] underline-offset-[6px]">{copy.name}</span>
                        <span className="inline-block mt-2 text-sm font-semibold text-am-orange">{badge}</span>
                      </span>
                      <span className="text-lg text-am-muted leading-relaxed">{copy.summary}</span>
                      <span className="relative block h-24 w-40 rounded-md overflow-hidden">
                        <Image src={s.image} alt="" fill sizes="160px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 bg-am-ink text-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 md:py-28">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] max-w-2xl text-balance">{t.home.flowTitle}</h2>
            <OrderFlow />
            <div className="mt-16 md:mt-20 rounded-xl border border-white/10 p-6 md:p-8">
              <h3 className="font-display text-xl font-bold text-am-yellow">{t.home.addonsTitle}</h3>
              <ul className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {t.addons.map((a) => (
                  <li key={a.title}>
                    <span className="block font-semibold">{a.title}</span>
                    <span className="block mt-1 text-white/70 leading-relaxed">{a.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* One point of contact + visibility */}
        <section className="bg-am-paper">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 md:py-28 grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <Image src="/brand/amstrak-mark.png" alt="" width={70} height={60} className="h-14 w-auto" />
              <h2 className="mt-6 font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] text-balance">{t.home.whyTitle}</h2>
              <p className="mt-5 text-lg text-am-muted leading-relaxed max-w-md">{t.home.whyText}</p>
            </div>
            <ul className="lg:col-span-7 grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {t.why.map((w) => (
                <li key={w.title} className="border-t-[3px] border-am-yellow pt-4">
                  <h3 className="font-display text-xl font-bold">{w.title}</h3>
                  <p className="mt-2 text-am-muted leading-relaxed">{w.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Network */}
        <section className="bg-am-ink text-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 md:py-28 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">{t.home.mapTitle}</h2>
              <p className="mt-5 text-lg text-white/75 leading-relaxed">{t.home.mapText}</p>
            </div>
            <div className="lg:col-span-8">
              <NetworkMap />
            </div>
          </div>
        </section>

        {/* Group */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">{t.home.groupTitle}</h2>
            <p className="mt-5 text-lg text-am-muted leading-relaxed">{t.home.groupText}</p>
          </div>
          <ul className="mt-10 grid md:grid-cols-3 gap-5">
            {t.about.group.map((g, i) => {
              const url = i === 1 ? COMPANY.daszaUrl : i === 2 ? COMPANY.dltUrl : null
              return (
                <li key={g.name} className={`rounded-xl p-6 md:p-7 flex flex-col ${i === 0 ? 'bg-am-navy text-white' : 'bg-am-paper'}`}>
                  <span className="font-display text-2xl font-extrabold tracking-tight">{g.name}</span>
                  <span className={`mt-2 leading-relaxed ${i === 0 ? 'text-white/80' : 'text-am-muted'}`}>{g.text}</span>
                  {url && (
                    <span className="mt-auto pt-6">
                      <TextButton href={url} external>{url.replace('https://', '').replace('www.', '')}</TextButton>
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {/* Partner register */}
        <section className="bg-am-yellow">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 md:py-16 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.08]">{t.home.partnersTitle}</h2>
              <p className="mt-3 text-am-ink/80 text-lg leading-relaxed">{t.home.partnersText}</p>
            </div>
            <Link href={href('/partners')} className="inline-flex items-center justify-center h-12 px-6 rounded-md bg-am-ink text-white font-semibold hover:bg-am-navy">
              {t.home.partnersCta}
            </Link>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="bg-am-paper">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 md:py-28 grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">{t.home.contactTitle}</h2>
              <p className="mt-5 text-lg text-am-muted leading-relaxed">{t.home.contactText}</p>
              <ul className="mt-8 space-y-3 text-lg">
                <li><a href={`mailto:${COMPANY.email}`} className="font-semibold hover:text-am-muted">{COMPANY.email}</a></li>
                <li><a href={COMPANY.phoneHref} className="whitespace-nowrap hover:text-am-muted">{COMPANY.phone}</a></li>
              </ul>
            </div>
            <div className="lg:col-span-8 rounded-xl bg-white border border-am-line p-6 sm:p-8">
              <BusinessContactForm />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
