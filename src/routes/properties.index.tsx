import { createFileRoute } from "@tanstack/react-router";
import type { Lang } from "@/i18n/translations";
import { useMemo, useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  MapPin,
  Sparkles,
  RotateCcw,
  Building2,
  Bed,
  Bath,
  Maximize,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyCard } from "@/components/site/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import type { Property } from "@/data/properties";
import { SITE_URL, waLink } from "@/data/properties";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/properties/")({
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    lang?: Lang;
    location?: string;
    type?: string;
    beds?: string;
    q?: string;
  } => {
    return {
      lang: (search.lang as Lang) || undefined,
      location: typeof search.location === "string" ? search.location : undefined,
      type: typeof search.type === "string" ? search.type : undefined,
      beds: typeof search.beds === "string" ? search.beds : undefined,
      q: typeof search.q === "string" ? search.q : undefined,
    };
  },
  loaderDeps: ({ search }) => ({
    lang: search.lang,
  }),
  loader: async ({ deps }) => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    return { properties: (data || []) as Property[], search: deps };
  },
  head: ({ loaderData }) => {
    const activeLang: Lang = loaderData?.search?.lang || "en";

    const titles: Record<Lang, string> = {
      en: "Temer Properties for Sale in Addis Ababa — Addis Property Market",
      am: "የቴምር ፕሮፐርቲስ ሽያጭ በአዲስ አበባ — አዲስ ፕሮፐርቲ ማርኬት",
      om: "Qabeenya Teemer Properties Gurgurtaa Finfinnee — Addis Property Market",
      ti: "ናይ ቴምር ፕሮፐርቲስ መሸጣ ኣብ ኣዲስ ኣበባ — ኣዲስ ፕሮፐርቲ ማርኬት",
      so: "Guryaha Temer Properties ee Addis Ababa — Addis Property Market",
    };

    const descriptions: Record<Lang, string> = {
      en: "Browse verified apartments, modern homes, and commercial spaces from Temer Properties in Addis Ababa. Direct sales agent listings.",
      am: "በአዲስ አበባ የቴምር ፕሮፐርቲስ የተረጋገጡ አፓርትመንቶች፣ ዘመናዊ ቤቶች እና የንግድ ቦታዎችን ያስሱ። ከሽያጭ ወኪል የሚቀርቡ ቀጥተኛ ዝርዝሮች።",
      om: "Guryaha, dabaqyada fi iddoowwan daldalaa Teemer Properties Finfinnee keessatti mirkanaa'an ilaala. Tarree kallattii gurgurtaa.",
      ti: "ኣብ ኣዲስ ኣበባ ዝተረጋገጹ ናይ ቴምር ፕሮፐርቲስ ኣፓርትመንትታት፣ ዘመናዊ ኣባይትን ቦታታትን ርኣዩ። ቀጥታዊ መሸጣ።",
      so: "Eeg dabaqyada iyo guryaha la xaqiijiyay ee Temer Properties ka bixiso Addis Ababa. Liisaska wakiilka rasmiga ah.",
    };

    const ogTitle = titles[activeLang];
    const ogDesc = descriptions[activeLang];

    return {
      meta: [
        { title: ogTitle },
        { name: "description", content: ogDesc },
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: ogDesc },
        { property: "og:url", content: `${SITE_URL}/properties` },
        { property: "og:image", content: `${SITE_URL}/logo.png` },
        { name: "twitter:image", content: `${SITE_URL}/logo.png` },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/properties` },
        { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/properties?lang=en` },
        { rel: "alternate", hrefLang: "am", href: `${SITE_URL}/properties?lang=am` },
        { rel: "alternate", hrefLang: "om", href: `${SITE_URL}/properties?lang=om` },
        { rel: "alternate", hrefLang: "ti", href: `${SITE_URL}/properties?lang=ti` },
        { rel: "alternate", hrefLang: "so", href: `${SITE_URL}/properties?lang=so` },
        { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/properties` },
      ],
    };
  },
  component: PropertiesIndex,
});

const ANY = "any";

function PropertiesIndex() {
  const { properties } = Route.useLoaderData();
  const searchParams = Route.useSearch();

  const [q, setQ] = useState(searchParams.q || "");
  const [location, setLocation] = useState<string>(searchParams.location || ANY);
  const [type, setType] = useState<string>(searchParams.type || ANY);
  const [beds, setBeds] = useState<string>(searchParams.beds || ANY);
  const [baths, setBaths] = useState<string>(ANY);
  const [status, setStatus] = useState<string>(ANY);
  const [developer, setDeveloper] = useState<string>(ANY);
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (searchParams.location) setLocation(searchParams.location);
    if (searchParams.type) setType(searchParams.type);
    if (searchParams.beds) setBeds(searchParams.beds);
    if (searchParams.q) setQ(searchParams.q);
  }, [searchParams]);

  const developers = useMemo(
    () => Array.from(new Set(properties.map((p) => p.developer).filter(Boolean))),
    [properties],
  );

  // FIX: Extract neighborhood name (index 0) rather than generic city (index 1)
  const LOCATIONS = useMemo(
    () =>
      Array.from(
        new Set(
          properties.map((p) => p.location.split(",")[0]?.trim() || p.location).filter(Boolean),
        ),
      ),
    [properties],
  );

  const PROPERTY_TYPES = useMemo(
    () => Array.from(new Set(properties.map((p) => p.property_type))),
    [properties],
  );

  const STATUSES = useMemo(
    () => Array.from(new Set(properties.map((p) => p.status))),
    [properties],
  );

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (q && !`${p.title} ${p.location}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (location !== ANY && !p.location.toLowerCase().includes(location.toLowerCase()))
        return false;
      if (type !== ANY && p.property_type !== type) return false;
      if (beds !== ANY && (p.bedrooms ?? 0) < Number(beds)) return false;
      if (baths !== ANY && (p.bathrooms ?? 0) < Number(baths)) return false;
      if (status !== ANY && p.status !== status) return false;
      if (developer !== ANY && p.developer !== developer) return false;
      return true;
    });
  }, [properties, q, location, type, beds, baths, status, developer]);

  const activeFiltersCount = [
    location !== ANY,
    type !== ANY,
    beds !== ANY,
    baths !== ANY,
    status !== ANY,
    developer !== ANY,
    q.trim() !== "",
  ].filter(Boolean).length;

  const reset = () => {
    setQ("");
    setLocation(ANY);
    setType(ANY);
    setBeds(ANY);
    setBaths(ANY);
    setStatus(ANY);
    setDeveloper(ANY);
  };

  const FilterPanel = (
    <div className="space-y-5">
      <Select label="Neighborhood" value={location} onChange={setLocation} options={LOCATIONS} />
      <Select label="Property Type" value={type} onChange={setType} options={[...PROPERTY_TYPES]} />
      <Select
        label="Bedrooms (min)"
        value={beds}
        onChange={setBeds}
        options={["1", "2", "3", "4", "5"]}
      />
      <Select
        label="Bathrooms (min)"
        value={baths}
        onChange={setBaths}
        options={["1", "2", "3", "4"]}
      />
      <Select label="Status" value={status} onChange={setStatus} options={[...STATUSES]} />
      <Select label="Developer" value={developer} onChange={setDeveloper} options={developers} />

      {activeFiltersCount > 0 && (
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-2 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset all filters
        </button>
      )}
    </div>
  );

  return (
    <section className="container-x py-14">
      {/* Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            <Sparkles className="h-3 w-3" />
            <span>Verified Listings</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight">
            Available Residences
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Displaying <span className="font-bold text-foreground">{filtered.length}</span> of{" "}
            {properties.length} verified developments in Addis Ababa
          </p>
        </div>

        {/* Search Bar & View Mode Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by neighborhood, project..."
              className="h-11 w-full rounded-full border border-input bg-card pl-10 pr-4 text-xs font-medium outline-none shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center rounded-full border border-border/70 bg-muted/40 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-full p-2 text-xs transition cursor-pointer ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("compact")}
              className={`rounded-full p-2 text-xs transition cursor-pointer ${
                viewMode === "compact"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Compact list view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden btn-outline py-2.5 px-4 text-xs font-semibold flex items-center gap-2"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
        </div>
      </div>

      {/* Quick Neighborhood Filter Chips */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setLocation(ANY)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            location === ANY
              ? "bg-primary text-primary-foreground shadow-xs"
              : "border border-border/70 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"
          }`}
        >
          All Locations
        </button>
        {LOCATIONS.map((loc) => (
          <button
            key={loc}
            onClick={() => setLocation(loc)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              location === loc
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-border/80 bg-card p-6 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <h3 className="font-display text-base font-bold text-foreground">
                Filter Residences
              </h3>
              {activeFiltersCount > 0 && (
                <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-bold">
                  {activeFiltersCount} active
                </span>
              )}
            </div>
            <div className="mt-5">{FilterPanel}</div>
          </div>
        </aside>

        {/* Results Area */}
        <div>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-dashed border-border/80 bg-card p-16 text-center shadow-card"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                No matching residences found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                No properties match your current search filters. Try clearing specific criteria or
                resetting all filters.
              </p>
              <button onClick={reset} className="btn-primary mt-6 text-xs px-6 py-2.5">
                <RotateCcw className="h-3.5 w-3.5" /> Reset all filters
              </button>
            </motion.div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-2">
              {filtered.map((p) => (
                <PropertyCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((p) => (
                <CompactPropertyCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter Dialog */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-background p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <h3 className="font-display text-lg font-bold text-foreground">
                  Filter Residences
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="rounded-full p-2 hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-5">{FilterPanel}</div>
              <button
                onClick={() => setShowFilters(false)}
                className="btn-primary mt-6 w-full text-sm font-bold"
              >
                Show {filtered.length} Residences
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CompactPropertyCard({ p }: { p: Property }) {
  return (
    <article className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-hover">
      <Link
        to="/properties/$slug"
        params={{ slug: p.slug }}
        className="relative aspect-[16/10] sm:aspect-square w-full sm:w-44 shrink-0 overflow-hidden rounded-xl bg-muted"
      >
        {p.cover_image ? (
          <img
            src={p.cover_image}
            alt={p.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <span className="absolute left-2.5 top-2.5 badge-status text-[10px] px-2.5 py-0.5">
          {p.status}
        </span>
      </Link>

      <div className="flex flex-1 flex-col justify-between pt-4 sm:pt-0 sm:pl-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
              {p.property_type}
            </span>
            {p.developer && (
              <span className="text-[11px] text-muted-foreground font-medium">{p.developer}</span>
            )}
          </div>
          <Link to="/properties/$slug" params={{ slug: p.slug }}>
            <h3 className="font-display text-lg font-bold text-foreground transition group-hover:text-primary mt-1">
              {p.title}
            </h3>
          </Link>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" /> {p.location}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {p.bedrooms != null && (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                <Bed className="h-3.5 w-3.5 text-primary" /> {p.bedrooms} Beds
              </span>
            )}
            {p.bathrooms != null && (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                <Bath className="h-3.5 w-3.5 text-primary" /> {p.bathrooms} Baths
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
              <Maximize className="h-3.5 w-3.5 text-primary" /> {p.area}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 pt-3 border-t border-border/60">
          <Link
            to="/properties/$slug"
            params={{ slug: p.slug }}
            className="btn-primary py-2 px-4 text-xs font-semibold"
          >
            View Details <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href={waLink(`Hi, I'm interested in ${p.title}. Could you share more details?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp py-2 px-4 text-xs font-semibold"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 w-full rounded-2xl border border-input bg-card px-3 text-xs font-semibold text-foreground outline-none shadow-xs transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
      >
        <option value="any">Any {label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
