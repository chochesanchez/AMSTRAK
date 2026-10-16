import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { locationFromHeaders } from '@/lib/geo'

// Lazily configure Resend so builds (e.g. CI) don't fail when the API key is missing
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

const list = z.union([z.array(z.string()), z.string()]).optional()
const text = z.string().max(4000).optional()

const schema = z.object({
  formType: z.enum(['contact', 'quote']),
  name: z.string().min(2).max(200),
  company: text,
  email: z.string().email(),
  phone: text,
  phoneCountry: text,
  message: text,
  website: text,
  solutions: list,
  // Shipment (quote form; cargo fields are optional on the contact form too)
  service: text,
  origin: text,
  destination: text,
  incoterm: text,
  load: text,
  product: text,
  pieces: text,
  cargoType: text,
  weight: text,
  dimensions: text,
  readyDate: text,
  frequency: text,
  additionalServices: list,
})

// Friendly labels for the notification email, in display order.
const LABELS: Record<string, string> = {
  name: 'Name',
  company: 'Company',
  email: 'Email',
  phone: 'Phone',
  phoneCountry: 'Phone country',
  location: 'Location (approx.)',
  solutions: 'Interested in',
  service: 'Service',
  origin: 'Origin',
  destination: 'Destination',
  incoterm: 'Incoterm',
  load: 'Load',
  product: 'Commodity',
  pieces: 'Pieces / pallets',
  cargoType: 'Cargo type',
  weight: 'Weight',
  dimensions: 'Dimensions (L × W × H)',
  readyDate: 'Ready to ship',
  frequency: 'Frequency',
  additionalServices: 'Add-ons',
  message: 'Message',
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null)
    if (!payload || typeof payload !== 'object') return NextResponse.json({ ok: false, error: 'Invalid form data' }, { status: 400 })
    if (!payload.formType) payload.formType = 'contact'
    const result = schema.safeParse(payload)
    if (!result.success) {
      console.error('Form validation failed:', result.error.flatten())
      return NextResponse.json({ ok: false, error: 'Invalid form data' }, { status: 400 })
    }
    // Approximate location from the visitor's IP (set by Vercel), never from the client.
    const parsed = { ...result.data, location: locationFromHeaders(request.headers) }

    // Honeypot: silently accept to avoid giving bots signal
    if (parsed.website) return NextResponse.json({ ok: true })

    const route = parsed.origin && parsed.destination ? `: ${parsed.origin} → ${parsed.destination}` : ''
    const subject =
      parsed.formType === 'quote'
        ? `Quote request — ${parsed.service ?? 'Freight'}${route} — ${parsed.company || parsed.name}`
        : `Contact request — ${parsed.name}${parsed.company ? ` (${parsed.company})` : ''}`

    const label = (key: string) => LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
    const display = (value: unknown) => (Array.isArray(value) ? value.join(', ') : String(value))
    const order = Object.keys(LABELS)
    const fields = Object.entries(parsed)
      .filter(([key, value]) => !['website', 'formType'].includes(key) && (Array.isArray(value) ? value.length > 0 : Boolean(value)))
      .sort(([a], [b]) => (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 99 : order.indexOf(b)))

    const rows = fields
      .map(
        ([key, value]) =>
          `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;vertical-align:top"><b>${escapeHtml(label(key))}</b></td><td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(
            display(value),
          ).replace(/\n/g, '<br/>')}</td></tr>`,
      )
      .join('')

    const html = `
      <div style="font-family:Arial,sans-serif;color:#0B1D3A">
        <h2 style="margin:0 0 10px">${escapeHtml(subject)}</h2>
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse">${rows}</table>
        <p style="color:#666;font-size:12px">Source: ${escapeHtml(request.headers.get('referer') ?? 'unknown')}</p>
      </div>
    `

    // Plain-text version (improves deliverability for providers like Outlook/Hotmail)
    const plain = [subject, '', ...fields.map(([key, value]) => `${label(key)}: ${display(value)}`)].join('\n')

    // EMAIL_TO accepts a comma-separated list; quotes@amstrak.com by default.
    const recipients = (process.env.EMAIL_TO || 'quotes@amstrak.com')
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean)

    if (!resend || !process.env.EMAIL_FROM) {
      console.error('RESEND_API_KEY or EMAIL_FROM is not configured; form submission not delivered.')
      return NextResponse.json({ ok: false, error: 'Email not configured' }, { status: 500 })
    }
    const { error: sendError } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: recipients,
      subject,
      html,
      text: plain,
      reply_to: parsed.email,
    })
    if (sendError) {
      console.error('Resend error:', sendError)
      return NextResponse.json({ ok: false, error: 'Email failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Form submission failed:', error)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
