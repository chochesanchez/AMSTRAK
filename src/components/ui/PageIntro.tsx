import Image from 'next/image'
import Link from 'next/link'

type Crumb = { href: string; label: string }

export default function PageIntro({
  title,
  lead,
  image,
  crumbs,
  crumbLabel = 'Breadcrumb',
  imageAlt = '',
  children,
}: {
  title: string
  lead?: string
  image?: string
  crumbs?: Crumb[]
  crumbLabel?: string
  imageAlt?: string
  children?: React.ReactNode
}) {
  return (
    <section className="bg-white">
      <div className={`mx-auto max-w-7xl px-5 sm:px-8 py-12 md:py-16 grid gap-10 items-center ${image ? 'lg:grid-cols-12' : ''}`}>
        <div className={image ? 'lg:col-span-6' : 'max-w-3xl'}>
          {crumbs && (
            <nav aria-label={crumbLabel} className="mb-5 text-sm text-am-muted">
              <ol className="flex flex-wrap gap-2">
                {crumbs.map((c, i) => (
                  <li key={c.href} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden>/</span>}
                    <Link href={c.href} className="underline-offset-4 hover:underline">{c.label}</Link>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.04] tracking-tight text-balance">{title}</h1>
          {lead && <p className="mt-5 text-lg md:text-xl leading-relaxed max-w-xl text-am-muted">{lead}</p>}
          {children}
        </div>
        {image && (
          <div className="lg:col-span-6 relative aspect-[16/10] rounded-lg overflow-hidden">
            <Image src={image} alt={imageAlt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
      <div className="h-1.5 brand-rule" aria-hidden />
    </section>
  )
}
