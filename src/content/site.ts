// Structural data for Amstrak's public site: contact details, images, slugs and numbers.
// All visible text lives in src/i18n/dictionaries/{en,es}.ts.
// Figures come from "Presentación de Servicios - AMSTRAK" (Oct 2026). Review any change with Dirección General.

export const COMPANY = {
  name: 'Amstrak',
  // Pending: WhatsApp Business number. Until then this is the number published in the services deck.
  phone: '+52 55 1837 4887',
  phoneHref: 'tel:+525518374887',
  whatsapp: 'https://wa.me/525518374887',
  whatsappNumber: '525518374887',
  // Quote requests and the public contact address (alias to be configured in Microsoft 365).
  email: 'quotes@amstrak.com',
  // Suppliers send their fiscal documents here.
  supportEmail: 'support@amstrak.com',
  // Pending: street address of the Querétaro office.
  city: 'Querétaro, Qro., México',
  partnerFormUrl:
    'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=s2RHiy61gkuVAKCR7cE-fgRJv_Ly6-tFo87Vv0vdGDFUQlhLOTdLOUVQMk5PQlBSWTM2TlZYN0daMy4u',
  daszaUrl: 'https://www.dasza.com',
  dltUrl: 'https://dltlogistics.com.mx',
}

// KPI values, in the same order as `kpis` in the dictionaries.
export const KPI_VALUES: { value: string; count: boolean }[] = [
  { value: '25+', count: true },
  { value: '240,000+', count: true },
  { value: '0%', count: false },
]

export type ServiceSlug = 'ocean' | 'air' | 'land' | 'cross-border' | 'customs' | 'warehousing' | 'distribution'

// `core` services are Amstrak's own freight modes and lead every list.
// The rest are delivered with the group companies (Dasza for customs/IMMEX warehousing, DLT for last mile).
export const SERVICES: { slug: ServiceSlug; image: string; core: boolean; partner?: 'dasza' | 'dlt' }[] = [
  { slug: 'ocean', image: '/images/site/port-ship.jpg', core: true },
  { slug: 'air', image: '/images/site/air-cargo.jpg', core: true },
  { slug: 'land', image: '/images/site/truck-road.jpg', core: true },
  { slug: 'cross-border', image: '/images/site/truck-mountains.jpg', core: true },
  { slug: 'customs', image: '/images/site/port-aerial.jpg', core: false, partner: 'dasza' },
  { slug: 'warehousing', image: '/images/site/warehouse-racks.jpg', core: false, partner: 'dasza' },
  { slug: 'distribution', image: '/images/site/parcel-handoff.jpg', core: false, partner: 'dlt' },
]

export const CORE_SERVICES = SERVICES.filter((s) => s.core)
export const MORE_SERVICES = SERVICES.filter((s) => !s.core)
