'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CargoFields from '@/components/ui/CargoFields'
import { COMPANY } from '@/content/site'
import { PHONE_COUNTRIES } from '@/lib/phoneCountries'
import { cargoFromForm } from '@/lib/cargo'
import { useI18n } from '@/i18n/I18nProvider'

const MODES = ['ocean', 'air', 'land', 'cross-border', 'customs', 'warehousing'] as const
type Mode = (typeof MODES)[number]
const INCOTERMS = ['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'] as const
// Load options that make sense for each mode; other modes don't ask.
const LOADS: Partial<Record<Mode, readonly ('fcl20' | 'fcl40' | 'fcl40hc' | 'lcl' | 'ftl' | 'ltl' | 'unsure')[]>> = {
  ocean: ['fcl20', 'fcl40', 'fcl40hc', 'lcl', 'unsure'],
  land: ['ftl', 'ltl', 'unsure'],
  'cross-border': ['ftl', 'ltl', 'unsure'],
}
const FREQUENCIES = ['one-time', 'weekly', 'monthly', 'other'] as const
const EXTRAS = ['customs', 'insurance', 'storage', 'delivery', 'tower'] as const

function Section({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="flex items-center gap-3 font-display text-xl font-bold pb-3 border-b border-am-line">
      <span className="grid place-items-center h-8 w-8 rounded-full bg-am-navy text-white text-sm">{n}</span>
      {title}
    </h2>
  )
}
function Label({ htmlFor, children, required, optional }: { htmlFor?: string; children: React.ReactNode; required?: boolean; optional?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold mb-1.5">
      {children}
      {required && ' *'}
      {optional && <span className="font-normal text-am-muted"> ({optional})</span>}
    </label>
  )
}

export default function QuotePage() {
  const { t, href } = useI18n()
  const q = t.quote
  const router = useRouter()
  const search = useSearchParams()
  const initial = search.get('service')
  const [mode, setMode] = useState<Mode>(MODES.includes(initial as Mode) ? (initial as Mode) : 'ocean')
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (fd.get('website')) return // honeypot
    const country = PHONE_COUNTRIES.find((c) => c.code === fd.get('phoneCountry')) ?? PHONE_COUNTRIES[0]
    const phone = String(fd.get('phone') || '').trim()
    const load = String(fd.get('load') || '')
    const incoterm = String(fd.get('incoterm') || '')
    const payload = {
      formType: 'quote',
      name: fd.get('name'),
      company: fd.get('company'),
      email: fd.get('email'),
      phone: phone ? `${country.dial} ${phone}`.trim() : undefined,
      service: q.modes[mode],
      origin: fd.get('origin'),
      destination: fd.get('destination'),
      incoterm: incoterm || undefined,
      load: load ? q.loads[load as keyof typeof q.loads] : undefined,
      product: fd.get('commodity') || undefined,
      pieces: fd.get('pieces') || undefined,
      ...cargoFromForm(fd, t.cargo),
      readyDate: fd.get('readyDate') || undefined,
      frequency: q.frequencies[fd.get('frequency') as (typeof FREQUENCIES)[number]],
      additionalServices: fd.getAll('extras').map((x) => q.extraOptions[x as (typeof EXTRAS)[number]]),
      message: fd.get('comments') || undefined,
    }
    setSending(true)
    setFailed(null)
    let ok = false
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      ok = res.ok
    } catch {
      ok = false
    } finally {
      setSending(false)
    }
    if (ok) {
      router.push(href('/quote/thank-you'))
      return
    }
    // Keep the form filled and offer a prefilled email so the request isn't lost.
    setFailed(
      Object.entries(payload)
        .filter(([k, v]) => k !== 'formType' && v && (!Array.isArray(v) || v.length))
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join('\n'),
    )
  }

  const loads = LOADS[mode]

  return (
    <div className="bg-am-paper py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="bg-white rounded-xl border border-am-line p-6 sm:p-10">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] mb-4">{q.title}</h1>
          <p className="text-am-muted text-lg mb-10 max-w-2xl">{q.lead}</p>

          <form onSubmit={handleSubmit} className="space-y-10">
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

            <div className="space-y-5">
              <Section n={1} title={q.sections.contact} />
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="name" required>{q.name}</Label>
                  <input id="name" name="name" required minLength={2} autoComplete="name" className="input-field" />
                </div>
                <div>
                  <Label htmlFor="company" required>{q.company}</Label>
                  <input id="company" name="company" required autoComplete="organization" className="input-field" />
                </div>
                <div>
                  <Label htmlFor="email" required>{q.email}</Label>
                  <input id="email" name="email" type="email" required autoComplete="email" className="input-field" />
                </div>
                <div>
                  <Label htmlFor="phone" optional={q.optional}>{q.phone}</Label>
                  <div className="flex gap-2">
                    <select name="phoneCountry" aria-label={t.form.countryCode} defaultValue="MX" className="h-12 rounded-md border border-am-line bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-am-yellow">
                      {PHONE_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.code === 'OTHER' ? t.form.other : `${c.code} ${c.dial}`}</option>
                      ))}
                    </select>
                    <input id="phone" name="phone" type="tel" autoComplete="tel-national" className="input-field flex-1 min-w-0" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <Section n={2} title={q.sections.route} />
              <fieldset>
                <legend className="block text-sm font-semibold mb-2">{q.mode} *</legend>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MODES.map((m) => (
                    <label
                      key={m}
                      className={`flex items-center justify-center text-center h-12 px-3 rounded-md border text-sm font-semibold cursor-pointer transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-am-navy ${
                        mode === m ? 'bg-am-navy border-am-navy text-white' : 'border-am-line hover:border-am-navy'
                      }`}
                    >
                      <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
                      {q.modes[m]}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="origin" required>{q.origin}</Label>
                  <input id="origin" name="origin" required placeholder={q.originPh} className="input-field" />
                </div>
                <div>
                  <Label htmlFor="destination" required>{q.destination}</Label>
                  <input id="destination" name="destination" required placeholder={q.destinationPh} className="input-field" />
                </div>
                <div>
                  <Label htmlFor="incoterm" optional={q.optional}>{q.incoterm}</Label>
                  <select id="incoterm" name="incoterm" defaultValue="" className="input-field">
                    <option value="">{q.incotermUnsure}</option>
                    {INCOTERMS.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                {loads && (
                  <div>
                    <Label htmlFor="load" optional={q.optional}>{q.load}</Label>
                    <select id="load" name="load" key={mode} defaultValue="" className="input-field">
                      <option value="">{t.cargo.choose}</option>
                      {loads.map((l) => <option key={l} value={l}>{q.loads[l]}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <Section n={3} title={q.sections.cargo} />
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="commodity" optional={q.optional}>{q.commodity}</Label>
                  <input id="commodity" name="commodity" placeholder={q.commodityPh} className="input-field" />
                </div>
                <div>
                  <Label htmlFor="pieces" optional={q.optional}>{q.pieces}</Label>
                  <input id="pieces" name="pieces" placeholder={q.piecesPh} className="input-field" />
                </div>
              </div>
              <CargoFields idPrefix="q" />
            </div>

            <div className="space-y-5">
              <Section n={4} title={q.sections.service} />
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="readyDate" optional={q.optional}>{q.readyDate}</Label>
                  <input id="readyDate" name="readyDate" type="date" className="input-field" />
                </div>
                <div>
                  <Label htmlFor="frequency">{q.frequency}</Label>
                  <select id="frequency" name="frequency" defaultValue="one-time" className="input-field">
                    {FREQUENCIES.map((f) => <option key={f} value={f}>{q.frequencies[f]}</option>)}
                  </select>
                </div>
              </div>
              <fieldset>
                <legend className="block text-sm font-semibold mb-2">{q.extras} <span className="font-normal text-am-muted">({q.optional})</span></legend>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {EXTRAS.map((x) => (
                    <label key={x} className="flex items-center gap-2.5 text-sm">
                      <input type="checkbox" name="extras" value={x} className="h-4 w-4 accent-am-navy" />
                      {q.extraOptions[x]}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <Label htmlFor="comments" optional={q.optional}>{q.comments}</Label>
                <textarea id="comments" name="comments" rows={3} placeholder={q.commentsPh} className="input-field h-auto py-3" />
              </div>
            </div>

            {failed && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-medium">{q.errorTitle}</p>
                <p className="mt-1">{q.errorText}</p>
                <a
                  href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(q.title)}&body=${encodeURIComponent(failed)}`}
                  className="mt-3 inline-flex px-4 py-2 rounded-lg border border-red-300 font-medium hover:bg-red-100"
                >
                  {COMPANY.email}
                </a>
              </div>
            )}

            <button type="submit" disabled={sending} className="w-full btn-primary disabled:opacity-60">{sending ? q.sending : q.send}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
