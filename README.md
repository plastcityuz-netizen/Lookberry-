# LOOKBERRY — Premium Dessert & Fruit Gift Website

A production-ready Next.js + TypeScript + Tailwind CSS website for LOOKBERRY, a premium Uzbek dessert and fruit gift box brand.

## Features

- Premium editorial homepage with product-focused hero
- Clear product catalog with search, category filters and sorting
- Product detail pages with large images, quantity control and zoom
- Working cart with persistent localStorage
- Quick order flow: product → quantity/options → customer info → confirmation → Telegram
- Backend `/api/orders` integration with Telegram Bot API
- Real error handling: if Telegram fails, the website shows an error instead of fake success
- Admin dashboard for products, images, prices, descriptions, availability, delivery settings and order statuses
- SEO metadata, OpenGraph, Product schema and LocalBusiness schema

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Telegram configuration

The frontend never sees the bot token. Orders are sent by the backend route `/api/orders`.

Create `.env.local` or configure these environment variables in hosting:

```env
TELEGRAM_BOT_TOKEN=123456:your_real_bot_token
TELEGRAM_CHAT_ID=@lookberrys
DELIVERY_FEE_UZS=15000
ADMIN_PASSWORD=choose-a-strong-password
```

### Important Telegram notes

1. Create a bot with BotFather and copy the bot token into `TELEGRAM_BOT_TOKEN`.
2. Add the bot to the destination chat/channel/group.
3. If `@lookberrys` is a public channel/group and the bot has permission, `TELEGRAM_CHAT_ID=@lookberrys` can work.
4. For reliable private group/supergroup delivery, use the numeric chat id (often like `-1001234567890`) as `TELEGRAM_CHAT_ID`.
5. Do **not** commit `.env.local` or real secrets to GitHub.

If Telegram returns an error, the checkout displays:

> Buyurtmani yuborishda xatolik yuz berdi.

and shows retry controls. No fake success is shown.

## Admin dashboard

Visit `/admin`.

- In production, set `ADMIN_PASSWORD`.
- Enter the same password in the dashboard to manage products, orders and delivery settings.
- Product image upload is stored as a data URL in `data/products.json`; for larger production catalogs, move uploaded media to object storage (S3, Cloudinary, etc.).

## Data files

This project uses simple JSON storage for a lightweight deployment/demo:

- `data/products.json`
- `data/orders.json`
- `data/settings.json`

For multi-instance production hosting, replace JSON storage with a database.

## Scripts

```bash
npm run dev        # start dev server on 0.0.0.0
npm run build      # production build
npm run start      # production server
npm run type-check # TypeScript validation
```
