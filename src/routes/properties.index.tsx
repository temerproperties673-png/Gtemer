import { createFileRoute } from "@tanstack/react-router";
import type { Lang } from "@/i18n/translations";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PropertyCard } from "@/components/site/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import type { Property } from "@/data/properties";

export const Route = createFileRoute("/properties/")({
  validateSearch: (search: Record<string, unknown>): { lang?: Lang } => {
    return {
      lang: (search.lang as Lang) || undefined,
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
    const activeLang = ((loaderData as any)?.search?.lang as Lang) || "en";

    const titles: Record<Lang, string> = {
      en: "Verified Properties for Sale in Addis Ababa — Addis Property Market",
      am: "የተረጋገጡ የሽያጭ ንብረቶች በአዲስ አበባ — አዲስ ፕሮፐርቲ ማርኬት",
      om: "Qabeenyota Mirkanaajee Finfinnee keessatti — Addis Property Market",
      ti: "ዝተረጋገጹ ናይ መሸጣ ንብረታት ኣብ ኣዲስ ኣበባ — ኣዲስ ፕሮፐርቲ ማርኬት",
      so: "Guryaha la Xaqiijiyay ee Addis Ababa — Addis Property Market",
    };

    const descriptions: Record<Lang, string> = {
      en: "Browse all available apartments, villas and commercial spaces represented by your Temer Properties consultant.",
      am: "በቴምር ፕሮፐርቲስ የሽያጭ አማካሪ የሚወከሉትን ሁሉንም አፓርትመንቶች፣ ቪላዎች እና የንግድ ቦታዎች ያስሱ።",
      om: "Qabeenyota daldalaa, apaartamaa fi viilaa Teemer properties consultant bakka bu'een jiran hunda ilaali.",
      ti: "ብቴምር ፕሮፐርቲስ ኣማኻሪ ዝቐርቡ ኩሎም ኣፓርትመንትታት፣ ቪላታትን ናይ ንግዲ ቦታታትን ርኣዩ።",
      so: "Eeg dhamaan dabaqyada, viilooyinka iyo goobaha ganacsiga ee uu ku dhawaaqay wakiilkaaga Temer Properties.",
    };

    const ogTitle = titles[activeLang];
    const ogDesc = descriptions[activeLang];

    return {
      meta: [
        { title: ogTitle },
        { name: "description", content: ogDesc },
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: ogDesc },
        { property: "og:url", content: "https://addispropertymarket.com/properties" },
        { property: "og:image", content: "https://addispropertymarket.com/logo.png" },
        { name: "twitter:image", content: "https://addispropertymarket.com/logo.png" },
      ],
      links: [
        { rel: "canonical", href: "https://addispropertymarket.com/properties" },
        { rel: "alternate", hreflang: "en", href: "https://addispropertymarket.com/properties?lang=en" },
        { rel: "alternate", hreflang: "am", href: "https://addispropertymarket.com/properties?lang=am" },
        { rel: "alternate", hreflang: "om", href: "https://addispropertymarket.com/properties?lang=om" },
        { rel: "alternate", hreflang: "ti", href: "https://addispropertymarket.com/properties?lang=ti" },
        { rel: "alternate", hreflang: "so", href: "https://addispropertymarket.com/properties?lang=so" },
        { rel: "alternate", hreflang: "x-default", href: "https://addispropertymarket.com/properties" },
      ],
    };
  },
  component: PropertiesIndex,
});

const ANY = "any";

function PropertiesIndex() {
  const { properties } = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState<string>(ANY);
  const [type, setType] = useState<string>(ANY);
  const [beds, setBeds] = useState<string>(ANY);
  const [baths, setBaths] = useState<string>(ANY);
  const [status, setStatus] = useState<string>(ANY);
  const [developer, setDeveloper] = useState<string>(ANY);
  const [showFilters, setShowFilters] = useState(false);

  const developers = useMemo(
    () => Array.from(new Set(properties.map((p) => p.developer).filter(Boolean))),
    [properties],
  );
  const LOCATIONS = useMemo(
    () =>
      Array.from(new Set(properties.map((p) => p.location.split(",")[1]?.trim() || p.location))),
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
      if (location !== ANY && !p.location.includes(location)) return false;
      if (type !== ANY && p.property_type !== type) return false;
      if (beds !== ANY && (p.bedrooms ?? 0) < Number(beds)) return false;
      if (baths !== ANY && (p.bathrooms ?? 0) < Number(baths)) return false;
      if (status !== ANY && p.status !== status) return false;
      if (developer !== ANY && p.developer !== developer) return false;
      return true;
    });
  }, [properties, q, location, type, beds, baths, status, developer]);

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
      <Select label="Location" value={location} onChange={setLocation} options={LOCATIONS} />
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
      <button onClick={reset} className="text-sm font-medium text-primary hover:underline">
        Reset filters
      </button>
    </div>
  );

  return (
    <section className="container-x py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Available Properties</h1>
          <p className="mt-2 text-muted-foreground">
            {filtered.length} of {properties.length} listings
          </p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or area..."
              className="h-11 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden btn-outline py-2.5 px-4 text-sm"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Filters</h3>
            <div className="mt-4">{FilterPanel}</div>
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <p className="font-display text-lg">No matching properties.</p>
              <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {filtered.map((p) => (
                <PropertyCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="rounded-full p-2 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4">{FilterPanel}</div>
            <button onClick={() => setShowFilters(false)} className="btn-primary mt-6 w-full">
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </section>
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
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <option value="any">Any</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
