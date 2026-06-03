# Organic Scales International (OSI)

Production-ready one-page Next.js 15 website for a Bangladesh-based international fish scale exporter.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui primitives
- next-intl (EN / JA / ZH)
- Firebase Firestore + Storage (RFQ submissions)
- Vercel Analytics

## Getting started

```bash
npm install
cp .env.example .env.local
# Add Firebase and site URL values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/en`.

Admin dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web app config |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO |
| `NEXT_PUBLIC_DOC_*` | Optional Firebase Storage PDF URLs |
| `ADMIN_PASSWORD` | Password for `/admin` dashboard login |
| `ADMIN_SECRET` | Optional session signing secret (defaults to `ADMIN_PASSWORD`) |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase Admin service account JSON (single line) for dashboard reads/writes |

## Admin dashboard

Routes:

| Path | Purpose |
|------|---------|
| `/admin/login` | Sign in |
| `/admin` | Overview stats |
| `/admin/rfq` | RFQ inbox and status updates |
| `/admin/products` | Firestore product catalog |
| `/admin/content` | Hero / About / Trust copy per locale |

## Deploy

Connect the repository to Vercel. Set environment variables in the project dashboard. Deploy via GitHub push.

## Firestore

Deploy security rules from the comment block in `lib/firebase.ts`. Collections: `rfq_submissions`, `products`, `site_content` (public read; writes via Admin SDK only).
