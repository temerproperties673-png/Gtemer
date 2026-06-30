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
} from "lucide-react";
import { CONSULTANT, waLink, type Property } from "@/data/properties";
import { InquiryForm } from "@/components/site/InquiryForm";
import { PropertyCard } from "@/components/site/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Lang } from "@/i18n/translations";

export const Route = createFileRoute("/properties/$slug")({
  loaderDeps: ({ search }) => ({
    lang: search.lang,
  }),
  loader: async ({ params, deps }): Promise<{ property: Property; related: Property[]; search: any }> => {
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
    const activeLang = ((loaderData as any)?.search?.lang as Lang) || "en";
    const p = loaderData?.property;
    const url = `https://addispropertymarket.com/properties/${params.slug}`;

    const branding: Record<Lang, string> = {
      en: "Addis Property Market",
      am: "አዲስ ፕሮፐርቲ ማርኬት",
      om: "Addis Property Market",
      ti: "ኣዲስ ፕሮፐርቲ ማርኬት",
      so: "Addis Property Market",
    };

    const details: Record<Lang, string> = {
      en: p ? `${p.title} in ${p.location}. Area: ${p.area}. Contact for pricing and site visit.` : "Property listing",
      am: p ? `${p.title} በ${p.location}። ስፋት፡ ${p.area}። ለዋጋ እና ለቦታ ጉብኝት ያግኙን።` : "የንብረት ዝርዝር",
      om: p ? `${p.title} keessatti ${p.location}. Bal'ina: ${p.area}. Gatiifi daawwannaa bakkaaf quunnamaa.` : "Tarree qabeenyaa",
      ti: p ? `${p.title} ኣብ ${p.location}። ስፋት፡ ${p.area}። ንዋጋን ዑደትን ርኸቡና።` : "ዝርዝር ንብረት",
      so: p ? `${p.title} oo ku yaal ${p.location}. Baaxada: ${p.area}. Nala soo xiriir qiimaha iyo booqashada.` : "Liiska guriga",
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
        { rel: "alternate", hreflang: "en", href: `${url}?lang=en` },
        { rel: "alternate", hreflang: "am", href: `${url}?lang=am` },
        { rel: "alternate", hreflang: "om", href: `${url}?lang=om` },
        { rel: "alternate", hreflang: "ti", href: `${url}?lang=ti` },
        { rel: "alternate", hreflang: "so", href: `${url}?lang=so` },
        { rel: "alternate", hreflang: "x-default", href: url },
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
                brand: { "@type": "Organization", name: p.developer },
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
                    name: "Addis Property Market",
                    telephone: CONSULTANT.phone,
                  },
                },
                additionalProperty: [
                  p.bedrooms != null && {
                    "@type": "PropertyValue",
                    name: "Bedrooms",
                    value: p.bedrooms,
                  },
                  p.bathrooms != null && {
                    "@type": "PropertyValue",
                    name: "Bathrooms",
                    value: p.bathrooms,
                  },
                  { "@type": "PropertyValue", name: "Area", value: p.area },
                  { "@type": "PropertyValue", name: "Location", value: p.location },
                  { "@type": "PropertyValue", name: "Completion", value: p.completion_date },
                ].filter(Boolean),
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

  return (
    <article>
      <div className="container-x pt-8">
        <Link
          to="/properties"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All properties
        </Link>
      </div>

      {/* GALLERY */}
      <div className="container-x mt-6">
        <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted w-full text-left group/gallery cursor-zoom-in"
          >
            {activeSrc ? (
              <>
                <img
                  src={activeSrc}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-500 group-hover/gallery:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/gallery:opacity-100 transition duration-300 flex items-center justify-center">
                  <span className="bg-black/60 text-white rounded-full px-4 py-2 text-sm font-medium backdrop-blur">
                    Click to zoom
                  </span>
                </div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
            <span className="absolute left-4 top-4 badge-status">{p.status}</span>
          </button>
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {images.slice(0, 3).map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition ${i === activeImg ? "border-primary" : "border-transparent"}`}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LIGHTBOX DIALOG */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] border-none bg-black/95 p-0 text-white flex items-center justify-center overflow-hidden select-none [&>button]:text-white [&>button]:opacity-90 [&>button]:h-8 [&>button]:w-8">
          <div className="relative w-full h-full min-h-[50vh] flex items-center justify-center p-4">
            {activeSrc && (
              <img
                src={activeSrc}
                alt={p.title}
                className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="container-x mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* MAIN */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="badge-soft">{p.property_type}</span>
              <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{p.title}</h1>
              <p className="mt-2 inline-flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {p.location}
              </p>
            </div>
            <div className="rounded-2xl bg-accent px-5 py-3 text-accent-foreground">
              <div className="text-xs font-semibold uppercase tracking-wide">Pricing</div>
              <div className="font-display text-lg font-semibold">Contact for Pricing</div>
              <div className="text-xs">Payment Plans Available</div>
            </div>
          </div>

          {/* SPECS */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              p.bedrooms != null ? { icon: Bed, label: "Bedrooms", val: p.bedrooms } : null,
              p.bathrooms != null ? { icon: Bath, label: "Bathrooms", val: p.bathrooms } : null,
              { icon: Maximize, label: "Area", val: p.area },
              p.completion_date
                ? { icon: Calendar, label: "Completion", val: p.completion_date }
                : null,
            ]
              .filter(Boolean)
              .map((s, i) => {
                const sp = s as { icon: typeof Bed; label: string; val: string | number };
                return (
                  <div key={i} className="rounded-2xl border border-border bg-card p-4">
                    <sp.icon className="h-5 w-5 text-primary" />
                    <div className="mt-2 text-xs text-muted-foreground">{sp.label}</div>
                    <div className="font-semibold">{sp.val}</div>
                  </div>
                );
              })}
          </div>

          {/* DESCRIPTION */}
          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold">Overview</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{p.description}</p>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2 text-sm">
              <Row icon={Building2} label="Developer" value={p.developer} />
              {p.completion_date && (
                <Row icon={Calendar} label="Completion Date" value={p.completion_date} />
              )}
              <Row icon={MapPin} label="Location" value={p.location} />
              <Row icon={Maximize} label="Area" value={p.area} />
            </dl>
          </section>

          {/* AMENITIES */}
          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold">Amenities</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {(p.amenities || []).map((a) => (
                <li
                  key={a}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {a}
                </li>
              ))}
            </ul>
          </section>

          {/* LOCATION */}
          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold">Location</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Property location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(p.location)}&output=embed`}
                width="100%"
                height="360"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        </div>

        {/* INQUIRY ASIDE */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-xl font-semibold">Interested in this property?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Send a message — I'll respond within hours.
            </p>
            <div className="mt-5">
              <InquiryForm propertyTitle={p.title} />
            </div>
            <div className="mt-5 flex gap-2">
              <a
                href={`tel:${CONSULTANT.phone}`}
                className="btn-outline flex-1 px-4 py-2.5 text-sm"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <a
                href={waLink(`Hi, I'm interested in ${p.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex-1"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="container-x mt-20">
          <h2 className="font-display text-2xl font-semibold">You may also like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((x) => (
              <PropertyCard key={x.id} p={x} />
            ))}
          </div>
        </section>
      )}

      {/* STICKY MOBILE BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="grid grid-cols-3 gap-2">
          <a href={`tel:${CONSULTANT.phone}`} className="btn-outline justify-center py-2.5 text-xs">
            <Phone className="h-4 w-4" /> Call
          </a>
          <a
            href={waLink(`Hi, I'm interested in ${p.title}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp justify-center text-xs"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <Link to="/contact" className="btn-primary justify-center text-xs">
            <CalendarDays className="h-4 w-4" /> Visit
          </Link>
        </div>
      </div>
      <div className="h-20 md:hidden" />
    </article>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Bed; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
