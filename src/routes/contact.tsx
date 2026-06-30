import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { CONSULTANT, waLink } from "@/data/properties";
import { InquiryForm } from "@/components/site/InquiryForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Addis Property Market" },
      {
        name: "description",
        content:
          "Get in touch with your Temer Properties consultant. Call, WhatsApp, email or book a site visit.",
      },
      { property: "og:title", content: "Contact Us — Addis Property Market" },
      {
        property: "og:description",
        content: "Reach out to schedule a private property consultation in Addis Ababa.",
      },
      { property: "og:url", content: "https://addispropertymarket.com/contact" },
      { property: "og:image", content: "https://addispropertymarket.com/logo.png" },
      { name: "twitter:image", content: "https://addispropertymarket.com/logo.png" },
    ],
    links: [{ rel: "canonical", href: "https://addispropertymarket.com/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Temer Consultant",
          mainEntity: {
            "@type": "RealEstateAgent",
            name: "Temer Consultant",
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
  }),
  component: Contact,
});

function Contact() {
  return (
    <section className="container-x py-16">
      <div className="max-w-2xl">
        <span className="badge-soft">Contact</span>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          Let's find your next property
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Share what you're looking for and I'll prepare a tailored shortlist with pricing and
          payment plans.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Info
              icon={Phone}
              label="Phone"
              value={CONSULTANT.phoneDisplay}
              href={`tel:${CONSULTANT.phone}`}
            />
            <Info
              icon={MessageCircle}
              label="WhatsApp"
              value={CONSULTANT.phoneDisplay}
              href={waLink("Hi, I'd like to talk about properties.")}
            />
            <Info
              icon={Mail}
              label="Email"
              value={CONSULTANT.email}
              href={`mailto:${CONSULTANT.email}`}
            />
            <Info icon={MapPin} label="Office" value={CONSULTANT.office} />
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              title="Office location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(CONSULTANT.officeCoordinates || CONSULTANT.office)}&output=embed`}
              width="100%"
              height="380"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold">Send a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">I'll respond within a few hours.</p>
          <div className="mt-5">
            <InquiryForm />
          </div>
        </aside>
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
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition hover:border-primary">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary-dark">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
    >
      {Inner}
    </a>
  ) : (
    Inner
  );
}
