# Project Memory & Architecture

This document serves as the project's architectural guide, database reference, and user flow map. Use it to understand dependencies, mechanics, and design patterns when introducing new features.

---

## 🛠️ Core Tech Stack

- **Full-Stack Framework**: React powered by [TanStack Start](file:///c:/Users/jonathan/Documents/Gtemer/package.json#L46) with file-based routing and Server-Side Rendering (SSR).
- **Routing**: [TanStack Router](file:///c:/Users/jonathan/Documents/Gtemer/package.json#L45) with built-in loader functions and route grouping.
- **State & Data Fetching**: [React Query](file:///c:/Users/jonathan/Documents/Gtemer/package.json#L44) and the [Supabase Client SDK](file:///c:/Users/jonathan/Documents/Gtemer/package.json#L42).
- **Styling**: Tailwind CSS v4 and [Framer Motion](file:///c:/Users/jonathan/Documents/Gtemer/package.json#L53) for animations.
- **Localization (i18n)**: English (`en`) and Amharic (`am`) support via context and static translations.

---

## 🗄️ Database & Integrations

The application connects to Supabase via [client.ts](file:///c:/Users/jonathan/Documents/Gtemer/src/integrations/supabase/client.ts) (client) and [client.server.ts](file:///c:/Users/jonathan/Documents/Gtemer/src/integrations/supabase/client.server.ts) (server/SSR requests). Database types are mapped in [types.ts](file:///c:/Users/jonathan/Documents/Gtemer/src/integrations/supabase/types.ts).

### Core Tables

1. **`properties`**: Individual real estate listings (apartments, commercial spaces, homes).
   - Key Columns: `id`, `slug` (URL identifier), `title`, `location`, `property_type` (Residential/Commercial), `status` (For Sale/New Offer/Active), `bedrooms`, `bathrooms`, `area`, `developer`, `completion_date`, `description`, `amenities` (array), `cover_image`, `gallery` (array), `featured`, `published`.
2. **`projects`**: High-level master development projects (rendered in [ProjectsSection.tsx](file:///c:/Users/jonathan/Documents/Gtemer/src/components/site/ProjectsSection.tsx)).
   - Key Columns: `id`, `title`, `description`, `location`, `status` (Ongoing/Upcoming/Completed), `cover_image`, `gallery`, `units`, `year`, `featured`, `published`, `sort_order`.
3. **`leads`**: Client inquiries gathered from property pages or contact forms.
   - Key Columns: `id`, `name`, `phone`, `email` (optional), `message` (optional), `property_id` (foreign key), `property_title`, `status` (default: "new"), `notes` (internal).
4. **`user_roles`**: Maps user accounts to roles (enum: `admin`, `user`). Supports checking roles through the Postgres function `has_role`.

---

## 🛣️ Route & Page Structure

All pages are located in [src/routes](file:///c:/Users/jonathan/Documents/Gtemer/src/routes):

- **HTML Shell**: [\_\_root.tsx](file:///c:/Users/jonathan/Documents/Gtemer/src/routes/__root.tsx) renders the HTML document wrapper (`<html>`, `<head>`, `<body>`), injects [styles.css](file:///c:/Users/jonathan/Documents/Gtemer/src/styles.css), handles global script bundles, and initializes the `LanguageProvider` and `QueryClientProvider` providers.
- **Homepage**: [index.tsx](file:///c:/Users/jonathan/Documents/Gtemer/src/routes/index.tsx) renders the landing page, fetches and lists featured properties, displays business statistics, and loads the [ProjectsSection](file:///c:/Users/jonathan/Documents/Gtemer/src/components/site/ProjectsSection.tsx) component.
- **Properties Directory**: [properties.index.tsx](file:///c:/Users/jonathan/Documents/Gtemer/src/routes/properties.index.tsx) loads all published listings and provides filters (Property Type, Location, Developer, Bedrooms, Bathrooms, and Status) along with a text-search bar.
- **Property Detail**: [properties.$slug.tsx](file:///c:/Users/jonathan/Documents/Gtemer/src/routes/properties.$slug.tsx) renders a single property, detailed gallery carousel, completion/developer status, features, similar listings, and the [InquiryForm](file:///c:/Users/jonathan/Documents/Gtemer/src/components/site/InquiryForm.tsx).
- **About page**: [about.tsx](file:///c:/Users/jonathan/Documents/Gtemer/src/routes/about.tsx) presents sales agent information (Yonas Tesfaye), expertise fields, and direct WhatsApp buttons.
- **Contact page**: [contact.tsx](file:///c:/Users/jonathan/Documents/Gtemer/src/routes/contact.tsx) details direct phone, WhatsApp links, office location map, and a general inquiry form.
- **Sitemap**: [sitemap[.]xml.ts](file:///c:/Users/jonathan/Documents/Gtemer/src/routes/sitemap%5B.%5Dxml.ts) contains a server route handler returning a dynamically updated XML sitemap of all published listings for search engines (using the canonical domain `https://addispropertymarket.com`).

---

## 🔄 User Flows & Key Mechanics

### 1. Client Search & Filtering

- Visitors browse properties using filters or search queries inside [properties.index.tsx](file:///c:/Users/jonathan/Documents/Gtemer/src/routes/properties.index.tsx). Filtration is performed client-side using `useMemo` over pre-fetched published listings.

### 2. Lead Intake (Inquiry Form)

- Users inquire about listings via the [InquiryForm.tsx](file:///c:/Users/jonathan/Documents/Gtemer/src/components/site/InquiryForm.tsx) component.
- Input is validated with `zod` and written directly to the `leads` table in Supabase.
- Successful submissions display a notification via `sonner` (`toast.success`).

### 3. Direct Sales Agent Contacts

- Phone numbers and WhatsApp redirections reference the `CONSULTANT` configurations in [properties.ts](file:///c:/Users/jonathan/Documents/Gtemer/src/data/properties.ts).
- The `waLink(message)` helper formats links redirecting users to the WhatsApp application with pre-populated contextual messages.

### 4. Admin Authentication & Role Enforcement

- Path [route.tsx](file:///c:/Users/jonathan/Documents/Gtemer/src/routes/_authenticated/route.tsx) checks authentication server-side/client-side using `supabase.auth.getUser()`. Unauthorized sessions redirect to `/auth`.
- Inside [admin.tsx](file:///c:/Users/jonathan/Documents/Gtemer/src/routes/_authenticated/admin.tsx), the [useAuth](file:///c:/Users/jonathan/Documents/Gtemer/src/hooks/use-auth.ts) hook validates if the user matches `isAdmin === true` by querying `user_roles`.

### 5. Admin Dashboard

- The [admin.tsx](file:///c:/Users/jonathan/Documents/Gtemer/src/routes/_authenticated/admin.tsx) dashboard consists of three dynamic tabs:
  1. **Properties Tab**: Listing management. Supports creation, edit modals, image uploads using [storage.ts](file:///c:/Users/jonathan/Documents/Gtemer/src/lib/storage.ts), visibility triggers (`published`), and spotlight statuses (`featured`).
  2. **Projects Tab**: High-level master development projects editor.
  3. **Leads Tab**: Shows incoming customer inquiries, message details, and internal status toggling (e.g. tracking new vs. resolved leads).

### 6. Dynamic i18n

- The [LanguageProvider](file:///c:/Users/jonathan/Documents/Gtemer/src/i18n/LanguageContext.tsx) manages active states (`en` vs. `am`).
- `localStorage` persists the preference on client devices.
- Standard keys are mapped in [translations.ts](file:///c:/Users/jonathan/Documents/Gtemer/src/i18n/translations.ts), retrieved by calling `const t = useT()`.

### 7. Search Engine Optimization (SEO)

- Each page's route implements the `head: () => ({ meta, links, scripts })` method to inject fully rendered Title, Meta Description, canonical links, and JSON-LD schema (e.g., `Product`, `RealEstateAgent`, and `FAQPage` schemas) on the server.
- The project domain is standardized on `https://addispropertymarket.com` for canonical link tags and dynamic sitemap generation.
