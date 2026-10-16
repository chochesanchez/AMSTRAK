import { notFound } from 'next/navigation'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import TextButton from '@/components/ui/TextButton'
import { COMPANY } from '@/content/site'
import { isLang, localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

export default async function ThankYouPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const t = getDictionary(lang).thanks
  return (
    <div className="bg-am-paper py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="bg-white rounded-lg border border-am-line p-8 sm:p-12">
          <CheckCircleIcon className="h-14 w-14 text-am-ink mb-6" />
          <h1 className="font-display text-5xl font-extrabold leading-none mb-4">{t.title}</h1>
          <p className="text-am-muted text-lg mb-8">{t.text}</p>
          <p className="text-sm text-am-muted">{t.questions}</p>
          <p className="mt-2">{t.phone}: <a href={COMPANY.phoneHref} className="font-semibold whitespace-nowrap">{COMPANY.phone}</a></p>
          <p>{t.email}: <a href={`mailto:${COMPANY.email}`} className="font-semibold">{COMPANY.email}</a></p>
          <div className="mt-8"><TextButton href={localePath(lang, '/')}>{t.back}</TextButton></div>
        </div>
      </div>
    </div>
  )
}
