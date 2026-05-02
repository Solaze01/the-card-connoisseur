This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase Setup

This project saves orders to Supabase before redirecting users to WhatsApp.

### 1. Create the database tables

Run the SQL in [supabase/schema.sql](C:/Users/USER/The%20Card%20Connoisseur/supabase/schema.sql) inside the Supabase SQL editor.

### 2. Add environment variables

Create a `.env.local` file in the project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SECRET_KEY=your-supabase-secret-key
SUPABASE_PRODUCT_IMAGES_BUCKET=product-images
```

Notes:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is safe for client-side use.
- `SUPABASE_SECRET_KEY` is server-only and must never be exposed in the browser.
- `SUPABASE_PRODUCT_IMAGES_BUCKET` is optional. It defaults to `product-images`.
- The server-side order creation logic uses [lib/supabase-admin.ts](C:/Users/USER/The%20Card%20Connoisseur/lib/supabase-admin.ts).

### 3. Set up product image uploads

Create a public Supabase Storage bucket named `product-images`, or use your own name and match it in `SUPABASE_PRODUCT_IMAGES_BUCKET`.

Product images uploaded from the admin area are stored in Supabase Storage, and the resulting public URL is saved into the `products.image` field.

### 4. Configure WhatsApp

Set your WhatsApp number in [lib/site.ts](C:/Users/USER/The%20Card%20Connoisseur/lib/site.ts).

### 5. Restart the dev server

After updating environment variables, restart:

```bash
npm run dev
```

### Checkout flow

When a user clicks `Continue on WhatsApp`:

1. The cart is sent to `/api/orders`
2. The server creates an order in Supabase
3. A real order ID is generated in the format `TCC-YYYYMMDD-XXXX`
4. The WhatsApp message is built with that order ID
5. The user is redirected to WhatsApp

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
