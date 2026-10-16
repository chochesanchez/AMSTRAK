import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/20/solid'

// Secondary action that reads as a button, not an underlined link.
export default function TextButton({
  href,
  children,
  tone = 'light',
  external = false,
}: {
  href: string
  children: React.ReactNode
  tone?: 'light' | 'dark'
  external?: boolean
}) {
  const cls = `group inline-flex items-center gap-2 h-10 px-4 rounded-md border text-[15px] font-semibold transition-colors ${
    tone === 'dark' ? 'border-white/30 text-white hover:border-white hover:bg-white/10' : 'border-am-line bg-white text-am-ink hover:border-am-ink'
  }`
  const content = (
    <>
      {children}
      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </>
  )
  return external ? <a href={href} className={cls}>{content}</a> : <Link href={href} className={cls}>{content}</Link>
}
