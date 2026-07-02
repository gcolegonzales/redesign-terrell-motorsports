# Terrell Motorsports LLC — Website Redesign Concept

A polished, single-page marketing website concept for **Terrell Motorsports LLC**, a **mobile**
powersports repair & maintenance service based in Prairieville, Louisiana, serving Ascension
Parish and the greater Baton Rouge area.

This is an **unsolicited redesign concept** — a "this could be your site right now" pitch piece.

## Why this site exists

Terrell Motorsports currently has **no website at all** — their entire web presence is a single
Facebook page, and business comes 100% from word of mouth. That means when someone in the area
Googles **"mobile motorcycle repair near me"** or **"ATV repair Prairieville"**, Terrell doesn't
show up — even though they offer exactly that.

This concept gives them a real, fast, mobile-first web presence built around their single biggest
advantage: **they're mobile — they come to you.** No storefront, no tow bill, no hauling.

The current problems it solves:

- **No website / not discoverable on Google** — invisible to anyone not already referred.
- **No way to request service online** — the only path today is calling or messaging Facebook.
- **The mobile "we come to you" differentiator isn't marketed anywhere** — it's the whole pitch and it's buried.

## What's in it

- **Hero** built around the tagline "Got a bike sitting because it won't run? We'll come fix it," with a prominent **Request Mobile Service** CTA and click-to-call.
- **Services** for all 5 vehicle types (motorcycles, dirt bikes, ATVs, UTVs, watercraft) with inline SVG icons.
- **How it works** — 1) Call/request, 2) We come to you, 3) Fixed, no hauling.
- **Why us** — mobile, factory-trained, 13 years experience, reasonable pricing.
- **Request Mobile Service form** (the money feature) — name, phone, location, vehicle type, make & model, and issue description. Styled and client-side validated; **not wired to a backend** (demo only).
- **Reviews** (100% recommended, illustrative testimonials), **service-area** section, and a footer with click-to-call + Facebook link.
- **Sticky click-to-call** everywhere, plus a persistent tap-to-call bar on mobile.

## Real business details used

- **Phone:** (225) 363-8923 (click-to-call throughout)
- **Service area:** Prairieville, LA + Ascension Parish / greater Baton Rouge (mobile — no storefront)
- **Facebook:** https://www.facebook.com/minemofonotyoz/

## Tech

Fully static and self-contained: `index.html` + `styles.css` + `script.js`. No build step, no
frameworks, no npm. The only external resource is a single Google Fonts `<link>` (Oswald + Inter);
everything else — icons, illustrations, the service-area "map" — is inline SVG or CSS. Motion
respects `prefers-reduced-motion`.

## SEO

On-page SEO is built in: unique `<title>` + meta description, a single `<h1>`, complete Open Graph
+ Twitter Card tags, a `<link rel="canonical">`, and **JSON-LD structured data** (`@type: AutoRepair`,
modeling the mobile powersports business — `name`, `telephone`, `url`, `image`, `priceRange`,
`areaServed` for Prairieville / Baton Rouge / Ascension Parish, and `sameAs` Facebook). Because the
business is fully mobile with no storefront, **no street address / geo is emitted** — only
`areaServed`. `robots.txt` and `sitemap.xml` live at the repo root.

**Base URL placeholder:** the canonical URL, `og:url`, `og:image`, sitemap `<loc>`, robots `Sitemap:`
line, and the JSON-LD `url`/`image` all use the literal placeholder `https://terrellmotorsports.com/`.
Before deploy, do a single find-and-replace of `terrellmotorsports.com` with the real domain across
`index.html`, `robots.txt`, and `sitemap.xml`. (Also drop a real share image at
`assets/photos/og-image.jpg`, referenced by the OG/Twitter/schema `image`.)

## How to view

Just **open `index.html`** by double-clicking it, or serve the folder with any static server.
There's no build step.

---

*Unsolicited redesign concept — not affiliated with or endorsed by Terrell Motorsports LLC.*
