'use client'

import React, { useState } from 'react'
import Modal from './Modal'
import { PHONE_COUNTRIES } from '@/lib/phoneCountries'
import { COMPANY } from '@/content/site'
import { useI18n } from '@/i18n/I18nProvider'
import { fmt } from '@/i18n/dictionaries'
import { cargoFromForm } from '@/lib/cargo'
import CargoFields from './CargoFields'

export default function BusinessContactForm() {
  const { t } = useI18n()
  const f = t.form
  const solutions = f.solutions
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [failedMessage, setFailedMessage] = useState<string | null>(null)
  const toggle = (s: string) => setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    if (fd.get('website')) return // honeypot
    const country = PHONE_COUNTRIES.find((c) => c.code === fd.get('phoneCountry')) ?? PHONE_COUNTRIES[0]
    const name = String(fd.get('name') || '').trim()
    const email = String(fd.get('email') || '').trim()
    const phone = `${country.dial} ${String(fd.get('phone') || '').trim()}`.trim()
    const company = String(fd.get('company') || '').trim()
    const message = String(fd.get('message') || '').trim()
    const cargo = cargoFromForm(fd, t.cargo)

    setSubmitting(true)
    setFailedMessage(null)
    let sent = false
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'contact',
          name,
          email,
          phone,
          phoneCountry: country.label,
          company: company || undefined,
          message: message || undefined,
          solutions: selected,
          ...cargo,
        }),
      })
      sent = res.ok
    } catch {
      sent = false
    } finally {
      setSubmitting(false)
    }

    if (sent) {
      setOpen(true)
      setSelected([])
      form.reset()
    } else {
      // Keep the form filled and give the visitor a one-click way to still reach us.
      setFailedMessage(
        [
          `${f.waHello} ${name}${company ? ` ${f.waFrom} ${company}` : ''}.`,
          selected.length ? `${f.waInterested} ${selected.join(', ')}.` : '',
          [cargo.cargoType, cargo.weight, cargo.dimensions].filter(Boolean).join(' · '),
          message,
          fmt(f.waContact, { email, phone }),
        ].filter(Boolean).join('\n'),
      )
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bc-name" className="block text-sm font-medium text-gray-700 mb-1">{f.name} *</label>
            <input id="bc-name" name="name" required minLength={2} autoComplete="name" className="input-field" />
          </div>
          <div>
            <label htmlFor="bc-email" className="block text-sm font-medium text-gray-700 mb-1">{f.email} *</label>
            <input id="bc-email" type="email" name="email" required autoComplete="email" className="input-field" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bc-phone" className="block text-sm font-medium text-gray-700 mb-1">{f.phone} *</label>
            <div className="flex gap-2">
              <select name="phoneCountry" aria-label={f.countryCode} defaultValue="MX" className="border border-gray-300 rounded-lg px-2 bg-white focus:ring-2 focus:ring-am-yellow">
                {PHONE_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.code === 'OTHER' ? f.other : `${c.code} ${c.dial}`}</option>
                ))}
              </select>
              <input id="bc-phone" type="tel" name="phone" required minLength={7} autoComplete="tel-national" placeholder={f.phonePh} className="input-field flex-1 min-w-0" />
            </div>
          </div>
          <div>
            <label htmlFor="bc-company" className="block text-sm font-medium text-gray-700 mb-1">{f.company}</label>
            <input id="bc-company" name="company" autoComplete="organization" className="input-field" />
          </div>
        </div>

        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-2">{f.need}</legend>
          <div className="flex flex-wrap gap-2">
            {solutions.map((s) => {
              const on = selected.includes(s)
              return (
                <button
                  type="button"
                  key={s}
                  aria-pressed={on}
                  onClick={() => toggle(s)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${on ? 'bg-black border-black text-white' : 'border-gray-300 text-gray-700 hover:border-black'}`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </fieldset>

        <details className="group rounded-lg border border-am-line open:bg-am-paper/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-gray-700 [&::-webkit-details-marker]:hidden">
            <span>
              {f.shipment} <span className="font-normal text-am-muted">· {f.shipmentHint}</span>
            </span>
            <span className="text-lg leading-none text-am-muted transition-transform group-open:rotate-45" aria-hidden>+</span>
          </summary>
          <div className="px-4 pb-4">
            <CargoFields idPrefix="bc" />
          </div>
        </details>

        <div>
          <label htmlFor="bc-message" className="block text-sm font-medium text-gray-700 mb-1">{f.message}</label>
          <textarea id="bc-message" name="message" rows={3} className="input-field" placeholder={f.messagePh} />
        </div>

        {failedMessage && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-medium">{f.failTitle}</p>
            <p className="mt-1">{f.failText}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(failedMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-[#25D366] text-black font-medium hover:brightness-95"
              >
                {f.viaWhatsapp}
              </a>
              <a
                href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(f.emailSubject)}&body=${encodeURIComponent(failedMessage)}`}
                className="px-4 py-2 rounded-lg border border-red-300 text-red-800 hover:bg-red-100"
              >
                {f.viaEmail}
              </a>
            </div>
          </div>
        )}

        <button type="submit" className="w-full btn-primary disabled:opacity-60" disabled={submitting}>{submitting ? f.sending : f.send}</button>
      </form>

      <Modal open={open} onClose={() => setOpen(false)} title={f.sentTitle} closeLabel={t.common.close}>
        <p>{f.sentText}</p>
      </Modal>
    </>
  )
}
