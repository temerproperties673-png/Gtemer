import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Building2,
  Calendar,
  CheckCircle2,
  Phone,
  MessageCircle,
  CalendarDays,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CONSULTANT, SITE_URL, waLink, type Property } from "@/data/properties";
import { InquiryForm } from "@/components/site/InquiryForm";
import { PropertyCard } from "@/components/site/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Lang } from "@/i18n/translations";

export const Route = createFileRoute("/properties/$slug")({
  loaderDeps: ({ search }) => ({
    lang: search.lang,
  }),
  loader: async ({
    params,
    deps,
  }): Promise<{ property: Property; related: Property[]; search: { lang?: Lang } }> => {
    const { data: property } = await supabase
      .from("properties")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .single();

    if (!property) throw notFound();

    const { data: related } = await supabase
      .from("properties")
      .select("*")
      .eq("published", true)
      .neq("id", property.id)
      .limit(3);

    return { property: property as Property, related: (related || []) as Property[], search: deps };
  },
  validateSearch: (search: Record<string, unknown>): { lang?: Lang } => {
    return {
      lang: (search.lang as Lang) || undefined,
    };
  },
  head: ({ loaderData, params }) => {
    const activeLang: Lang = loaderData?.search?.lang || "en";
    const p = loaderData?.property;
    const url = `${SITE_URL}/properties/${params.slug}`;

    const branding: Record<Lang, string> = {
      en: "Temer Properties | Addis Property Market",
      am: "ቴምር ፕሮፐርቲስ | አዲስ ፕሮፐርቲ ማርኬት",
      om: "Temer Properties | Addis Property Market",
      ti: "ቴምር ፕሮፐርቲስ | ኣዲስ ፕሮፐርቲ ማርኬት",
      so: "Temer Properties | Addis Property Market",
    };

    const details: Record<Lang, string> = {
      en: p
        ? `${p.title} in ${p.location}. Area: ${p.area}. Contact for pricing and site visit.`
        : "Property listing",
      am: p ? `${p.title} በ${p.location}። ስፋት፡ ${p.area}። ለዋጋ እና ለቦታ ጉብኝት ያግኙን።` : "የንብረት ዝርዝር",
      om: p
        ? `${p.title} keessatti ${p.location}. Bal'ina: ${p.area}. Gatiifi daawwannaa bakkaaf quunnamaa.`
        : "Tarree qabeenyaa",
      ti: p ? `${p.title} ኣብ ${p.location}። ስፋት፡ ${p.area}። ንዋጋን ዑደትን ርኸቡና።` : "ዝርዝር ንብረት",
      so: p
        ? `${p.title} oo ku yaal ${p.location}. Baaxada: ${p.area}. Nala soo xiriir qiimaha iyo booqashada.`
        : "Liiska guriga",
    };

    const brandName = branding[activeLang];
    const desc = details[activeLang];
    const title = p ? `${p.title} — ${brandName}` : `Property — ${brandName}`;

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: p?.description?.slice(0, 160) ?? desc },
        { property: "og:image", content: p?.cover_image ?? "" },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        { name: "twitter:image", content: p?.cover_image ?? "" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: `${url}?lang=en` },
        { rel: "alternate", hrefLang: "am", href: `${url}?lang=am` },
        { rel: "alternate", hrefLang: "om", href: `${url}?lang=om` },
        { rel: "alternate", hrefLang: "ti", href: `${url}?lang=ti` },
        { rel: "alternate", hrefLang: "so", href: `${url}?lang=so` },
        { rel: "alternate", hrefLang: "x-default", href: url },
      ],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: p.title,
                description: p.description,
                image: [p.cover_image, ...(p.gallery || [])].filter(Boolean),
                category: p.property_type,
                brand: { "@type": "Organization", name: p.developer || "Temer Properties" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "ETB",
                  price: "0",
                  priceSpecification: {
                    "@type": "PriceSpecification",
                    description: "Contact for pricing",
                  },
                  url,
                  seller: {
                    "@type": "RealEstateAgent",
                    name: "Addis Property Market — Authorized Temer Properties Agent",
                    telephone: CONSULTANT.phone,
                  },
                },
              }),
            },
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                  { "@type": "ListItem", position: 2, name: "Properties", item: "/properties" },
                  { "@type": "ListItem", position: 3, name: p.title, item: url },
                ],
              }),
            },
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <div className="container-x py-24 text-center">
      <h1 className="font-display text-4xl font-bold">Property not found</h1>
      <Link to="/properties" className="btn-primary mt-6">
        Back to listings
      </Link>
    </div>
  ),
  component: PropertyDetail,
});

function PropertyDetail() {
  const { property: p, related } = Route.useLoaderData() as {
    property: Property;
    related: Property[];
  };
  const [activeImg, setActiveImg] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images = [p.cover_image, ...(p.gallery || [])].filter(Boolean) as string[];
  const activeSrc = images[activeImg] || "";

  const handleNext = () => {
    setActiveImg((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveImg((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <article className="pb-24">
      {/* Navigation Breadcrumb */}
      <div className="container-x pt-8">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>All Properties in Addis Ababa</span>
        </Link>
      </div>

      {/* GALLERY CINEMATIC CONTAINER */}
      <div className="container-x mt-6">
        <div className="grid gap-4 lg:grid-cols-[2.5fr_1fr]">
          {/* Main Visual Display */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-muted group/gallery border border-border/80 shadow-card">
            {activeSrc ? (
              <>
                <img
                  src={activeSrc}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/gallery:scale-105"
                />
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute inset-0 bg-black/20 opacity-0 group-hover/gallery:opacity-100 transition duration-300 flex items-center justify-center cursor-zoom-in"
                  aria-label="Zoom image"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-5 py-2.5 text-xs font-semibold text-white backdrop-blur-md shadow-xl transition hover:scale-105">
                    <Maximize2 className="h-3.5 w-3.5" /> Fullscreen Gallery ({activeImg + 1}/
                    {images.length})
                  </span>
                </button>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-sm text-muted-foreground">No image available</span>
              </div>
            )}

            {/* Badges on Visual */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="badge-status text-xs px-3.5 py-1 shadow-md">{p.status}</span>
              <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-md">
                {p.property_type}
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="grid grid-cols-4 gap-3 lg:grid-cols-1 lg:max-h-[500px] overflow-y-auto pr-1">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative aspect-[16/10] overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                  i === activeImg
                    ? "border-primary shadow-md scale-[1.02]"
                    : "border-border/60 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX DIALOG */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] border-none bg-black/95 p-0 text-white flex items-center justify-center overflow-hidden select-none [&>button]:text-white [&>button]:opacity-90">
          <div className="relative w-full h-full min-h-[60vh] flex items-center justify-center p-6">
            {activeSrc && (
              <img
                src={activeSrc}
                alt={p.title}
                className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
            )}

            {/* Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20 transition"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20 transition"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs font-semibold backdrop-blur text-white/90">
              {activeImg + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MAIN SPECIFICATIONS & INQUIRY GRID */}
      <div className="container-x mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* Left Column: Details, Specs, Milestones, Amenities */}
        <div>
          {/* Header & Pricing */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-8 border-b border-border/60">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{p.developer || "Temer Properties"}</span>
              </div>
              <h1 className="font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight text-foreground">
                {p.title}
              </h1>
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{p.location}</span>
              </p>
            </div>

            {/* Price Card */}
            <div className="rounded-3xl border border-primary/20 bg-primary/10 p-6 text-foreground min-w-[220px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                Pricing Structure
              </span>
              <div className="font-display text-xl font-extrabold text-foreground mt-1">
                Direct Agent Rates
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Fixed payment plans & milestone schedules available.
              </p>
            </div>
          </div>

          {/* KEY SPECS GRID */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              p.bedrooms != null
                ? { icon: Bed, label: "Bedrooms", val: `${p.bedrooms} Beds` }
                : null,
              p.bathrooms != null
                ? { icon: Bath, label: "Bathrooms", val: `${p.bathrooms} Baths` }
                : null,
              { icon: Maximize, label: "Total Area", val: p.area },
              p.completion_date
                ? { icon: Calendar, label: "Delivery", val: p.completion_date }
                : null,
            ]
              .filter(Boolean)
              .map((s, i) => {
                const sp = s as { icon: typeof Bed; label: string; val: string };
                return (
                  <div
                    key={i}
                    className="flex flex-col rounded-3xl border border-border/80 bg-card p-5 shadow-xs transition hover:border-primary/40"
                  >
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                      <sp.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {sp.label}
                    </span>
                    <span className="mt-1 font-display text-lg font-bold text-foreground">
                      {sp.val}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* PAYMENT MILESTONES VISUALIZER */}
          <section className="mt-12 rounded-3xl border border-border/80 bg-card p-8 shadow-card">
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <CreditCard className="h-4 w-4" />
              <span>Standard Payment Milestones</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Flexible Structured Installment Plan
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Off-plan purchases are divided into transparent construction milestone payments locked
              by contract:
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-4 text-xs">
              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                <span className="font-bold text-primary block text-sm">Step 1 · 20%</span>
                <span className="font-semibold text-foreground mt-1 block">Contract Signing</span>
                <span className="text-muted-foreground mt-0.5 block">
                  Locks unit price permanently
                </span>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                <span className="font-bold text-primary block text-sm">Step 2 · 30%</span>
                <span className="font-semibold text-foreground mt-1 block">Structural Framing</span>
                <span className="text-muted-foreground mt-0.5 block">
                  Concrete skeleton completed
                </span>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                <span className="font-bold text-primary block text-sm">Step 3 · 30%</span>
                <span className="font-semibold text-foreground mt-1 block">
                  Finishing & Utilities
                </span>
                <span className="text-muted-foreground mt-0.5 block">Tiles, fixtures, wiring</span>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                <span className="font-bold text-primary block text-sm">Step 4 · 20%</span>
                <span className="font-semibold text-foreground mt-1 block">Key Handover</span>
                <span className="text-muted-foreground mt-0.5 block">Title deed registration</span>
              </div>
            </div>
          </section>

          {/* OVERVIEW & DESCRIPTION */}
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Property Overview
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground font-normal">
              {p.description}
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
              <Row icon={Building2} label="Developer" value={p.developer || "Temer Properties"} />
              {p.completion_date && (
                <Row icon={Calendar} label="Completion Timeline" value={p.completion_date} />
              )}
              <Row icon={MapPin} label="Exact District" value={p.location} />
              <Row icon={Maximize} label="Floorspace" value={p.area} />
            </dl>
          </section>

          {/* AMENITIES */}
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Included Amenities & Features
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {(p.amenities || []).map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card px-5 py-4 text-sm font-semibold text-foreground shadow-xs transition hover:border-primary/40"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* GOOGLE MAPS LOCATION */}
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Neighborhood & Location
            </h2>
            <div className="mt-5 overflow-hidden rounded-3xl border border-border/80 shadow-card">
              <iframe
                title="Property location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(p.location)}&output=embed`}
                width="100%"
                height="380"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        </div>

        {/* STICKY CONCIERGE SIDEBAR */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border/80 bg-card p-7 shadow-card">
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Direct Sales Desk</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">
              Request Full Spec Sheet
            </h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Receive official unit pricing, current floor availability, and payment schedules
              directly from Yonas Tesfaye.
            </p>

            <div className="mt-6">
              <InquiryForm propertyTitle={p.title} />
            </div>

            <div className="mt-6 flex flex-col gap-2.5 pt-6 border-t border-border/60">
              <a
                href={waLink(
                  `Hi, I'm interested in ${p.title}. Could you share the current floor availability and price breakdown?`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp justify-center py-3 text-sm font-bold shadow-md hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" /> Instant WhatsApp Inquire
              </a>
              <a
                href={`tel:${CONSULTANT.phone}`}
                className="btn-outline justify-center py-3 text-sm font-semibold hover:border-primary"
              >
                <Phone className="h-4 w-4 text-primary" /> Call {CONSULTANT.phoneDisplay}
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* RELATED DEVELOPMENTS */}
      {related.length > 0 && (
        <section className="container-x mt-24 pt-16 border-t border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Discover More
              </span>
              <h2 className="font-display text-3xl font-extrabold text-foreground mt-1">
                Similar Residences
              </h2>
            </div>
            <Link to="/properties" className="text-xs font-bold text-primary hover:underline">
              View all listings →
            </Link>
          </div>
          <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((x) => (
              <PropertyCard key={x.id} p={x} />
            ))}
          </div>
        </section>
      )}

      {/* MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/70 bg-background/95 p-3.5 backdrop-blur-xl md:hidden shadow-2xl">
        <div className="grid grid-cols-3 gap-2">
          <a
            href={`tel:${CONSULTANT.phone}`}
            className="btn-outline justify-center py-2.5 text-xs font-semibold"
          >
            <Phone className="h-3.5 w-3.5 text-primary" /> Call
          </a>
          <a
            href={waLink(`Hi, I'm interested in ${p.title}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp justify-center py-2.5 text-xs font-semibold"
          >
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
          <Link to="/contact" className="btn-primary justify-center py-2.5 text-xs font-semibold">
            <CalendarDays className="h-3.5 w-3.5" /> Book Visit
          </Link>
        </div>
      </div>
      <div className="h-20 md:hidden" />
    </article>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Bed; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card px-5 py-3.5 shadow-xs">
      <span className="inline-flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}
