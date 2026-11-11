import { Link } from "@tanstack/react-router";
import { Bed, Bath, Maximize, MapPin, MessageCircle, ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Property } from "@/data/properties";
import { waLink } from "@/data/properties";

const statusConfig: Record<
  Property["status"],
  { label: string; badgeCls: string; dotCls: string }
> = {
  "For Sale": {
    label: "For Sale",
    badgeCls: "border-primary/40 bg-primary/90 text-primary-foreground",
    dotCls: "bg-white",
  },
  "New Offer": {
    label: "New Offer",
    badgeCls: "border-status-new/40 bg-status-new/90 text-white",
    dotCls: "bg-white animate-pulse",
  },
  Active: {
    label: "Available",
    badgeCls: "border-status-active/40 bg-status-active/90 text-white",
    dotCls: "bg-white",
  },
};

export function PropertyCard({ p }: { p: Property }) {
  const currentStatus = statusConfig[p.status] || statusConfig["For Sale"];

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-hover"
    >
      {/* Visual Canvas Container */}
      <Link
        to="/properties/$slug"
        params={{ slug: p.slug }}
        className="relative block aspect-[16/11] overflow-hidden bg-muted"
      >
        {p.cover_image ? (
          <img
            src={p.cover_image}
            alt={p.title}
            loading="lazy"
            width={1280}
            height={880}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-108"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-sm font-medium text-muted-foreground">
              Residence preview pending
            </span>
          </div>
        )}

        {/* Cinematic Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5 opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

        {/* Floating Top Badges */}
        <div className="absolute left-3.5 top-3.5 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide backdrop-blur-md shadow-md ${currentStatus.badgeCls}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${currentStatus.dotCls}`} />
            {currentStatus.label}
          </span>
        </div>

        <div className="absolute right-3.5 top-3.5">
          <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md shadow-md">
            {p.property_type}
          </span>
        </div>

        {/* Floating developer tag at bottom of visual */}
        {p.developer && (
          <div className="absolute bottom-3 left-3.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/90 drop-shadow-md">
              <Sparkles className="h-3 w-3 text-primary" />
              {p.developer}
            </span>
          </div>
        )}
      </Link>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Link to="/properties/$slug" params={{ slug: p.slug }}>
          <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
            {p.title}
          </h3>
        </Link>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate">{p.location}</span>
        </p>

        {/* Specs Badges */}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium text-foreground/80">
          {p.bedrooms != null && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/60 px-3 py-1.5">
              <Bed className="h-3.5 w-3.5 text-primary" /> {p.bedrooms} Beds
            </span>
          )}
          {p.bathrooms != null && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/60 px-3 py-1.5">
              <Bath className="h-3.5 w-3.5 text-primary" /> {p.bathrooms} Baths
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/60 px-3 py-1.5">
            <Maximize className="h-3.5 w-3.5 text-primary" /> {p.area}
          </span>
        </div>

        {/* Action Row */}
        <div className="mt-6 flex items-center gap-2.5 border-t border-border/60 pt-4">
          <Link
            to="/properties/$slug"
            params={{ slug: p.slug }}
            className="btn-primary flex-1 py-2.5 text-xs font-semibold shadow-sm"
          >
            Explore{" "}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <a
            href={waLink(`Hi, I'm interested in ${p.title}. Could you share more details?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp px-4 py-2.5 text-xs font-semibold shadow-sm"
            aria-label="Inquire via WhatsApp"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.article>
  );
}
