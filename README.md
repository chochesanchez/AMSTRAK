# Amstrak website

Public site for Amstrak (www.amstrak.com), built on the same structure as dltlogistics.com.mx:
Next.js 15 (App Router), Tailwind, English at `/` and Spanish at `/es`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3002
```

## Where things live

- `src/content/site.ts`: contact details, services, images, KPI numbers. **Pending items are marked here.**
- `src/i18n/dictionaries/en.ts` / `es.ts`: every visible text (Spanish uses "tú").
- `src/app/api/contact/route.ts`: sends contact and quote requests by email (Resend).
- `public/videos/`: hero loop (Mixkit #4012, Mixkit Free License).
- `public/brand/`: logo files cut from the PNG logo. Replace with the vector versions when available.

## Environment variables

See `.env.example`. Without `RESEND_API_KEY` and `EMAIL_FROM` the forms show a fallback
(prefilled email / WhatsApp) instead of sending.
