# Lealene-Forma — FORMA

> **Considered furniture, made to order in Porto.** Solid oak, natural wool, and quiet, considered lines. Pieces built once, kept for decades.

Headless e-commerce monorepo: **Strapi 5** CMS (`forma-cms`) + **Next.js 16** storefront (`practice-forma`) + **PostgreSQL 17** (Docker). Products and categories are managed in Strapi and consumed by the Next.js app via the Strapi REST API.

---

## Architecture

```
Lealene-Forma/
├── docker-compose.yml      # PostgreSQL 17 (forma-postgres:5432)
├── backups/                # ignored — local DB dumps
├── forma-cms/              # Strapi 5 headless CMS (port 1337)
└── practice-forma/         # Next.js 16 storefront (port 3000)
        │
        └── lib/strapi.ts ──► fetch → http://localhost:1337/api/{products,categories}
```

| Layer | Runs on | Data flow |
|-------|---------|-----------|
| **PostgreSQL** | `localhost:5432` (Docker) | Persistent volume `postgres_data` — Strapi's sole datastore |
| **Strapi CMS** | `localhost:1337` | Admin panel at `/admin`, REST API at `/api/*` with `populate=*` |
| **Next.js** | `localhost:3000` | Server Components fetch from Strapi at build/request time (`cache: no-store`) |

---

## Tech Stack

| Area | Technology |
|------|------------|
| **CMS** | Strapi 5.50.0, Node >=20, TypeScript 5, `pg` + `better-sqlite3` |
| **Storefront** | Next.js 16.2.9 (App Router, Turbopack), React 19.2, TypeScript 5, Tailwind CSS 4 |
| **Database** | PostgreSQL 17 (Docker) |
| **Icons / Fonts** | `lucide-react`, `next/font` (Geist) |
| **State** | React Context — `CartContext`, `WishlistContext`, `PreviewContext` + `local-storage-store` |
| **Images** | `next/image` with remote patterns for Strapi uploads + `images.unsplash.com` |

---

## Project Structure

```
forma-cms/
├── config/          # admin.ts, api.ts, database.ts (postgres), server.ts, middlewares.ts
├── src/api/         # product + category (content-types, controllers, routes, services)
├── public/uploads/  # Strapi media
└── .env.example     # required env vars

practice-forma/
├── app/
│   ├── page.tsx              # Home: Hero + FeaturesBar + CategorySection + ProductSection + Editorial + Newsletter
│   ├── layout.tsx            # Geist fonts, Cart/Wishlist/Preview providers, CartDrawer, ProductPreview
│   ├── products/page.tsx     # Filterable catalog (?category=slug)
│   └── products/[slug]/page.tsx  # Product detail (getProduct)
├── components/      # 21 components — Navbar, Hero, ProductCard, ProductGallery, CartDrawer, etc.
├── lib/
│   ├── strapi.ts         # safeFetch, mapProduct/mapCategory, getProducts/getCategories/getProduct/filterProductsByCategory
│   ├── site-data.ts      # announcements, features, stats, footerColumns (static content)
│   └── local-storage-store.ts
├── types/product.ts # Product, Category, ProductImage
└── next.config.ts   # images.remotePatterns for Strapi + Turbopack root
```

### Strapi Content Types

**Product** (`api::product.product`) — `collectionType`, `draftAndPublish: true`

| Field | Type |
|-------|------|
| `title` | string |
| `slug` | uid |
| `description` | richtext (Strapi blocks → normalized to string in `lib/strapi.ts:104`) |
| `price` | integer |
| `stock` | biginteger |
| `featured` | boolean |
| `image` | media (multiple, images/files/videos/audios) |
| `category` | relation `oneToOne` → `api::category.category` |

**Category** (`api::category.category`) — `name`, `slug` (uid), `image` (media)

---

## Prerequisites

- **Node.js** 20–26 (see `forma-cms/package.json:35` engines)
- **pnpm** or **npm** (both lockfiles present)
- **Docker Desktop** (for PostgreSQL)

---

## Quick Start

### 1. Start PostgreSQL

```bash
docker compose up -d
# → forma-postgres listening on localhost:5432
#   DB: forma | user: postgres | password: postgres
```

### 2. Configure Strapi

```bash
cd forma-cms
cp .env.example .env
# Edit .env — set APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET,
# TRANSFER_TOKEN_SALT, JWT_SECRET, ENCRYPTION_KEY
# (generate with: openssl rand -base64 32)

# Database vars default to docker-compose values, override if needed:
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_NAME=forma
# DATABASE_USERNAME=postgres
# DATABASE_PASSWORD=postgres
# DATABASE_SSL=false
```

Install and run:

```bash
pnpm install        # or npm install
pnpm dev            # strapi develop → http://localhost:1337/admin
```

On first run, create the admin user at `/admin`.

In **Settings → Users & Permissions Plugin → Roles → Public**, enable `find` / `findOne` for `Product` and `Category` so the storefront can read them unauthenticated. Create a few Categories and Products (with images) to populate the home page.

### 3. Configure Storefront

```bash
cd practice-forma
pnpm install

# Create .env.local (optional — defaults to http://localhost:1337)
echo "NEXT_PUBLIC_STRAPI_URL=http://localhost:1337" > .env.local
# or for server-only: STRAPI_URL=http://localhost:1337
```

Run:

```bash
pnpm dev    # → http://localhost:3000
pnpm build  # production build
pnpm start  # serve production
pnpm lint   # eslint
```

> The storefront degrades gracefully — `lib/strapi.ts:12` `safeFetch` returns `[]` / `undefined` and logs to console if Strapi is unreachable.

---

## Environment Variables

### `forma-cms/.env`

| Var | Required | Default | Notes |
|-----|----------|---------|-------|
| `HOST` | — | `0.0.0.0` | |
| `PORT` | — | `1337` | |
| `APP_KEYS` | **yes** | — | Comma-separated, e.g. `"key1,key2"` |
| `API_TOKEN_SALT` | **yes** | — | |
| `ADMIN_JWT_SECRET` | **yes** | — | |
| `TRANSFER_TOKEN_SALT` | **yes** | — | |
| `JWT_SECRET` | **yes** | — | |
| `ENCRYPTION_KEY` | **yes** | — | |
| `DATABASE_HOST` | — | `localhost` | |
| `DATABASE_PORT` | — | `5432` | |
| `DATABASE_NAME` | — | `forma` | |
| `DATABASE_USERNAME` | — | `postgres` | |
| `DATABASE_PASSWORD` | — | `postgres` | |
| `DATABASE_SSL` | — | `false` | |

### `practice-forma/.env.local`

| Var | Required | Default | Notes |
|-----|----------|---------|-------|
| `NEXT_PUBLIC_STRAPI_URL` | — | `http://localhost:1337` | Base URL used to build image URLs (`lib/api.ts:6`). Must be reachable by the Next.js image optimizer — in Docker Compose use `http://strapi:1337`, on Railway use the public Strapi URL |
| `STRAPI_URL` | — | `http://localhost:1337` | Server-only fallback |

---

## Frontend Details

- **Home** (`app/page.tsx:31`) — async Server Component, reads `searchParams.category` to filter, fetches `getProducts()` + `getCategories()`, derives hero product, product counts per category, and selected category name.
- **Catalog** (`app/products/page.tsx`) + **Detail** (`app/products/[slug]/page.tsx`) — category filtering via query string, individual product lookup via `getProduct(slug)` (`lib/strapi.ts:205`).
- **Image handling** — `absoluteUrl()` in `lib/strapi.ts:74` prefixes relative Strapi upload URLs; `next.config.ts:23` allowlists Strapi host + `localhost` + `host.docker.internal` + Unsplash/Bing for editorial images.
- **Static site data** (`lib/site-data.ts`) — announcements ticker, feature bar, stats, editorial image, and footer columns (Shop / Studio / Help) kept outside the CMS.

---

## Scripts Reference

| Location | Command | Description |
|----------|---------|-------------|
| `forma-cms` | `pnpm dev` / `pnpm develop` | Strapi with autoReload |
| `forma-cms` | `pnpm start` | Strapi without autoReload |
| `forma-cms` | `pnpm build` | Build admin panel |
| `forma-cms` | `pnpm console` | Strapi console |
| `practice-forma` | `pnpm dev` | Next.js dev (Turbopack) |
| `practice-forma` | `pnpm build` | Next.js production build |
| `practice-forma` | `pnpm start` | Serve production |
| `practice-forma` | `pnpm lint` | ESLint |
| root | `docker compose up -d` | Start PostgreSQL |
| root | `docker compose down` | Stop PostgreSQL |

---

## Backups

`backups/` is gitignored. Place `pg_dump` archives there — they will not be committed.

---

## Deployment Notes

- **Strapi** — `yarn strapi deploy` or any Node host; set `DATABASE_SSL=true` when targeting a managed Postgres. See [Strapi deployment docs](https://docs.strapi.io/dev-docs/deployment).
- **Next.js** — `next build` output is standard; deploy to Vercel or any Node host. Set `NEXT_PUBLIC_STRAPI_URL` to the deployed Strapi URL and ensure Strapi's CORS allows the storefront origin (`config/middlewares.ts`).

---

## License

Private — all rights reserved.
