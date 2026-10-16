import type { ServiceSlug } from '@/content/site'

// Simple line icons for each service, drawn on a 24px grid to match Heroicons' outline style.
const PATHS: Record<ServiceSlug, string> = {
  ocean: 'M3 17.5c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0M4.5 15 3.5 11h17l-1.5 4M7 11V8h4v3m2 0V6h4v5M9 8V5',
  air: 'M21 15.5 13.5 11V5.5a1.5 1.5 0 0 0-3 0V11L3 15.5v2l7.5-2.25V19l-2 1.5v1.5l3.5-1 3.5 1v-1.5l-2-1.5v-3.75L21 17.5v-2Z',
  land: 'M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3.5v2.5h-7M6.5 18.5a1.75 1.75 0 1 0 0-.01M17 18.5a1.75 1.75 0 1 0 0-.01',
  'cross-border': 'M12 3v18M12 3c3 0 3 3 6 3v6c-3 0-3-3-6-3M3.5 17h5m0 0-2-2m2 2-2 2M20.5 17h-5m0 0 2-2m-2 2 2 2',
  customs: 'M9 12.75 11.25 15 15 9.75M12 3l7.5 3v5.25c0 4.5-3.2 8.1-7.5 9.75-4.3-1.65-7.5-5.25-7.5-9.75V6L12 3Z',
  warehousing: 'M3 20.25V9l9-5.25L21 9v11.25M6.75 20.25V12h10.5v8.25M6.75 15h10.5M6.75 17.75h10.5',
  distribution: 'M20.25 7.5 12 3 3.75 7.5m16.5 0L12 12m8.25-4.5v9L12 21m0-9L3.75 7.5M12 12v9M3.75 7.5v9L12 21',
}

export default function ModeIcon({ slug, className = 'h-6 w-6' }: { slug: ServiceSlug; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={PATHS[slug]} />
    </svg>
  )
}
