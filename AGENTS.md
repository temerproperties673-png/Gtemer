# Project Memory & Architecture

This document serves as the project's architectural guide, database reference, and user flow map. Use it to understand dependencies, mechanics, and design patterns when introducing new features.

---

## 🛠️ Core Tech Stack

- **Full-Stack Framework**: React powered by [TanStack Start](file:///c:/Users/jonny%20personal/Documents/Gtemer/package.json#L46) with file-based routing and Server-Side Rendering (SSR).
- **Routing**: [TanStack Router](file:///c:/Users/jonny%20personal/Documents/Gtemer/package.json#L45) with built-in loader functions and route grouping.
- **State & Data Fetching**: [React Query](file:///c:/Users/jonny%20personal/Documents/Gtemer/package.json#L44) and the [Supabase Client SDK](file:///c:/Users/jonny%20personal/Documents/Gtemer/package.json#L42).
- **Styling**: Tailwind CSS v4 and [Framer Motion](file:///c:/Users/jonny%20personal/Documents/Gtemer/package.json#L53) for animations.
- **Localization (i18n)**: Multilingual support for English (`en`), Amharic (`am`), Afaan Oromoo (`om`), Tigrinya (`ti`), and Somali (`so`) via context, URL search params (`?lang=`), and static translations.

---

## 🗄️ Database & Integrations

The application connects to Supabase via [client.ts](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/integrations/supabase/client.ts) (client) and [client.server.ts](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/integrations/supabase/client.server.ts) (server/SSR requests). Database types are mapped in [types.ts](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/integrations/supabase/types.ts).

### Core Tables

1. **`properties`**: Individual real estate listings (apartments, commercial spaces, homes).
   - Key Columns: `id`, `slug` (URL identifier), `title`, `location`, `property_type` (Residential/Commercial), `status` (For Sale/New Offer/Active), `bedrooms`, `bathrooms`, `area`, `developer`, `completion_date`, `description`, `amenities` (array), `cover_image`, `gallery` (array), `featured`, `published`.
2. **`projects`**: High-level master development projects (rendered in [ProjectsSection.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/components/site/ProjectsSection.tsx)).
   - Key Columns: `id`, `title`, `description`, `location`, `status` (Ongoing/Upcoming/Completed), `cover_image`, `gallery`, `units`, `year`, `featured`, `published`, `sort_order`.
3. **`leads`**: Client inquiries gathered from property pages or contact forms.
   - Key Columns: `id`, `name`, `phone`, `email` (optional), `message` (optional), `property_id` (foreign key), `property_title`, `status` (default: "new"), `notes` (internal).
4. **`social_links`**: Configurable social media platform links managed from the Admin Dashboard and rendered via [SocialLinks.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/components/site/SocialLinks.tsx).
   - Key Columns: `id`, `platform_key` (unique), `url`, `active`, `updated_at`.
5. **`user_roles`**: Maps user accounts to roles (enum: `admin`, `user`). Supports checking roles through the Postgres function `has_role`.

---

## 🛣️ Route & Page Structure

All pages are located in [src/routes](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/routes):

- **HTML Shell**: [\_\_root.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/routes/__root.tsx) renders the HTML document wrapper (`<html lang={activeLang}>`, `<head>`, `<body>`), injects [styles.css](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/styles.css), handles Google Tag Manager and global script bundles, and initializes the `LanguageProvider` and `QueryClientProvider` providers.
- **Homepage**: [index.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/routes/index.tsx) renders the landing page, SSR-loads featured properties and master projects, displays business statistics, and hydrates the [ProjectsSection](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/components/site/ProjectsSection.tsx) component.
- **Properties Directory**: [properties.index.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/routes/properties.index.tsx) loads all published listings and provides filters (Neighborhood, Property Type, Developer, Bedrooms, Bathrooms, and Status) along with a text-search bar and grid/compact view toggle.
- **Property Detail**: [properties.$slug.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/routes/properties.$slug.tsx) renders a single property, fullscreen lightbox gallery, payment milestones, completion/developer status, features, similar listings, and the [InquiryForm](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/components/site/InquiryForm.tsx).
- **About page**: [about.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/routes/about.tsx) presents Temer Properties company background, statistics, expertise fields, and direct WhatsApp buttons.
- **Contact page**: [contact.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/routes/contact.tsx) details direct phone, WhatsApp links, office location map, and a general inquiry form.
- **Sitemap**: [sitemap[.]xml.ts](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/routes/sitemap%5B.%5Dxml.ts) contains a server route handler returning a dynamically updated XML sitemap of all published listings for search engines using `SITE_URL` (`https://temerpropertiessaless.com`).

---

## 🔄 User Flows & Key Mechanics

### 1. Client Search & Filtering

- Visitors browse properties using filters or search queries inside [properties.index.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/routes/properties.index.tsx). Filtration is performed client-side using `useMemo` over pre-fetched published listings, extracting neighborhood names (`location.split(",")[0]`).

### 2. Lead Intake (Inquiry Form)

- Users inquire about listings via the [InquiryForm.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/components/site/InquiryForm.tsx) component.
- Input is validated with `zod` and written directly to the `leads` table in Supabase.
- Successful submissions display a notification via `sonner` (`toast.success`).

### 3. Direct Sales Agent Contacts

- Phone numbers, WhatsApp redirections, and canonical `SITE_URL` reference the `CONSULTANT` and `SITE_URL` configurations in [properties.ts](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/data/properties.ts).
- The `waLink(message)` helper formats links redirecting users to the WhatsApp application with pre-populated contextual messages.

### 4. Admin Authentication & Role Enforcement

- Path [route.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/routes/_authenticated/route.tsx) checks authentication and verifies the `admin` role in `user_roles` inside `beforeLoad`. Unauthorized or non-admin sessions redirect to `/auth`.
- Inside [admin.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/routes/_authenticated/admin.tsx), the [useAuth](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/hooks/use-auth.ts) hook provides reactive session and `isAdmin` states.

### 5. Admin Dashboard

- The [admin.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/routes/_authenticated/admin.tsx) dashboard delegates to modular tab components under [src/components/admin](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/components/admin):
  1. **Properties Tab** ([PropertiesTab.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/components/admin/PropertiesTab.tsx)): Listing management, creation/edit modals, client-side WebP compression & public CDN image uploads via [storage.ts](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/lib/storage.ts), visibility triggers (`published`), and spotlight statuses (`featured`).
  2. **Projects Tab** ([ProjectsTab.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/components/admin/ProjectsTab.tsx)): Master development projects editor.
  3. **Leads Tab** ([LeadsTab.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/components/admin/LeadsTab.tsx)): Real-time incoming customer inquiries (`supabase.channel`) and status toggling.
  4. **Social Tab** ([SocialLinksTab.tsx](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/components/admin/SocialLinksTab.tsx)): Social media platform URL management.

### 6. Dynamic i18n

- The [LanguageProvider](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/i18n/LanguageContext.tsx) manages active states (`en`, `am`, `om`, `ti`, `so`).
- `localStorage` and `?lang=` search parameters persist the preference across SSR and client navigation.
- Standard keys are mapped in [translations.ts](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/i18n/translations.ts), retrieved by calling `const t = useT()`.

### 7. Search Engine Optimization (SEO)

- Each page's route implements `head: () => ({ meta, links, scripts })` to inject localized Title, Meta Description, canonical links, `hrefLang` alternates, and JSON-LD schema (`Product`, `RealEstateAgent`, `FAQPage`, `BreadcrumbList`) on the server.
- The canonical domain is centralized in `SITE_URL` (`https://temerpropertiessaless.com`) inside [properties.ts](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/data/properties.ts) and matched in [robots.txt](file:///c:/Users/jonny%20personal/Documents/Gtemer/public/robots.txt) and [sitemap[.]xml.ts](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/routes/sitemap%5B.%5Dxml.ts). To switch domains in the future, update `SITE_URL` in [properties.ts](file:///c:/Users/jonny%20personal/Documents/Gtemer/src/data/properties.ts) and [robots.txt](file:///c:/Users/jonny%20personal/Documents/Gtemer/public/robots.txt).
