import { Link } from "@tanstack/react-router";
import { Bed, Bath, Maximize, MapPin, MessageCircle, ArrowUpRight } from "lucide-react";
import type { Property } from "@/data/properties";
import { waLink } from "@/data/properties";

const statusStyles: Record<Property["status"], string> = {
  "For Sale": "bg-primary text-primary-foreground",
  "New Offer": "bg-status-new text-white",
  Active: "bg-status-active text-white",
};

export function PropertyCard({ p }: { p: Property }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-hover">
      <Link
        to="/properties/$slug"
        params={{ slug: p.slug }}
      className="relative block aspect-[4/3] overflow-hidden"
    >
      {p.cover_image ? (
        <img
          src={p.cover_image}
          alt={p.title}
          loading="lazy"
          width={1280}
          height={896}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <span className="text-muted-foreground">No image</span>
        </div>
      )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        <span
          className={`absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-lg ${statusStyles[p.status]}`}
        >
          {p.status}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-background/95 px-3 py-1 text-xs font-medium text-foreground shadow backdrop-blur">
          {p.property_type}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link to="/properties/$slug" params={{ slug: p.slug }}>
          <h3 className="font-display text-lg font-semibold leading-tight transition group-hover:text-primary">
            {p.title}
          </h3>
        </Link>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" /> {p.location}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {p.bedrooms != null && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5">
              <Bed className="h-4 w-4 text-primary" /> {p.bedrooms} Beds
            </span>
          )}
          {p.bathrooms != null && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5">
              <Bath className="h-4 w-4 text-primary" /> {p.bathrooms} Baths
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5">
            <Maximize className="h-4 w-4 text-primary" /> {p.area}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
          <Link
            to="/properties/$slug"
            params={{ slug: p.slug }}
            className="btn-primary flex-1 px-4 py-2.5 text-sm"
          >
            View Details <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a
            href={waLink(`Hi, I'm interested in ${p.title}. Could you share more details?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp px-4"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
