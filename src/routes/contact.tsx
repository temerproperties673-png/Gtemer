import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle, Sparkles, Clock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { CONSULTANT, SITE_URL, waLink } from "@/data/properties";
import { InquiryForm } from "@/components/site/InquiryForm";

import type { Lang } from "@/i18n/translations";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { lang?: Lang } => {
    return {
      lang: (search.lang as Lang) || undefined,
    };
  },
  loaderDeps: ({ search }) => ({
    lang: search.lang,
  }),
  loader: ({ deps }) => {
    return { search: deps };
  },
  head: ({ loaderData }) => {
    const activeLang: Lang = loaderData?.search?.lang || "en";

    const titles: Record<Lang, string> = {
      en: "Contact Temer Properties Sales — Addis Property Market",
      am: "የቴምር ፕሮፐርቲስ ሽያጭ ያግኙ — አዲስ ፕሮፐርቲ ማርኬት",
      om: "Qabeenya Teemer Properties Quunnamaa — Addis Property Market",
      ti: "ናይ ቴምር ፕሮፐርቲስ መሸጣ ርኸቡ — ኣዲስ ፕሮፐርቲ ማርኬት",
      so: "La Xiriir Temer Properties — Addis Property Market",
    };

    const descriptions: Record<Lang, string> = {
      en: "Get in touch with your Temer Properties sales agent. Call, WhatsApp, email or book a site visit.",
      am: "ከቴምር ፕሮፐርቲስ የሽያጭ ወኪል ጋር ይገናኙ። በስልክ፣ በዋትስኣፕ፣ በኢሜይል ያግኙን ወይም የአየር ላይ ጉብኝት ይያዙ።",
      om: "Gareen gurgurtaa Teemer properties quunnamaa. Bilbila, WhatsApp, email ykn daawwannaa qabadhaa.",
      ti: "ምስ ቴምር ፕሮፐርቲስ ክፍሊ መሸጣ ርክብ ግበሩ። ብስልኪ፣ ብዋትስኣፕ፣ ብኢመይል ርኸቡና ወይ ዑደት ይሓዙ።",
      so: "La xiriir wakiilka iibka ee Temer Properties. Wicitaan, WhatsApp, email ama ballanso booqasho.",
    };

    const ogTitle = titles[activeLang];
    const ogDesc = descriptions[activeLang];

    return {
      meta: [
        { title: ogTitle },
        { name: "description", content: ogDesc },
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: ogDesc },
        { property: "og:url", content: `${SITE_URL}/contact` },
        { property: "og:image", content: `${SITE_URL}/logo.png` },
        { name: "twitter:image", content: `${SITE_URL}/logo.png` },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/contact` },
        { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/contact?lang=en` },
        { rel: "alternate", hrefLang: "am", href: `${SITE_URL}/contact?lang=am` },
        { rel: "alternate", hrefLang: "om", href: `${SITE_URL}/contact?lang=om` },
        { rel: "alternate", hrefLang: "ti", href: `${SITE_URL}/contact?lang=ti` },
        { rel: "alternate", hrefLang: "so", href: `${SITE_URL}/contact?lang=so` },
        { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/contact` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Temer Sales Agent",
            mainEntity: {
              "@type": "RealEstateAgent",
              name: "Temer Sales Agent",
              telephone: CONSULTANT.phone,
              email: CONSULTANT.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Bole",
                addressLocality: "Addis Ababa",
                addressCountry: "ET",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: CONSULTANT.phone,
                contactType: "sales",
                areaServed: "ET",
                availableLanguage: ["en", "am"],
              },
            },
          }),
        },
      ],
    };
  },
  component: Contact,
});

function Contact() {
  return (
    <section className="container-x py-16 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
          <Sparkles className="h-3 w-3" />
          <span>Concierge Desk</span>
        </div>
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight text-foreground">
          Let's find your next residence
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Share your desired neighborhood, unit specifications, and timeline. I'll personally curate
          a verified shortlist with direct pricing and payment plans.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_420px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Quick Contact Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Info
              icon={Phone}
              label="Direct Hotline"
              value={CONSULTANT.phoneDisplay}
              href={`tel:${CONSULTANT.phone}`}
            />
            <Info
              icon={MessageCircle}
              label="Instant WhatsApp"
              value={CONSULTANT.phoneDisplay}
              href={waLink("Hi Yonas, I'd like to consult on verified Temer Properties.")}
            />
            <Info
              icon={Mail}
              label="Email Inquiries"
              value={CONSULTANT.email}
              href={`mailto:${CONSULTANT.email}`}
            />
            <Info icon={MapPin} label="Sales Office" value={CONSULTANT.office} />
          </div>

          {/* Office Location Map */}
          <div>
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Visit Our Addis Ababa Office
              </span>
              <span className="text-xs text-primary font-medium">Bole District</span>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border/80 shadow-card">
              <iframe
                title="Office location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(CONSULTANT.officeCoordinates || CONSULTANT.office)}&output=embed`}
                width="100%"
                height="400"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </motion.div>

        {/* Inquiry Card Form */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl border border-border/80 bg-card p-8 shadow-card"
        >
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Direct Inquiries</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Request a Consultation
          </h2>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Fill out the details below. Our sales office will reach out with customized
            availability.
          </p>
          <div className="mt-6">
            <InquiryForm />
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function Info({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
}) {
  const Inner = (
    <div className="flex items-start gap-4 rounded-3xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-300 hover:border-primary/50 hover:shadow-soft">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 font-bold text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="block"
    >
      {Inner}
    </a>
  ) : (
    Inner
  );
}
