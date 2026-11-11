import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Quote,
  Phone,
  MessageCircle,
  Search,
  Sparkles,
  MapPin,
  ArrowUpRight,
  FileCheck2,
  Zap,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-building.jpg";
import { CONSULTANT, SITE_URL, waLink, type Property } from "@/data/properties";
import { PropertyCard } from "@/components/site/PropertyCard";
import {
  BuildingCutawayModal,
  HeroInteractiveTower,
} from "@/components/site/BuildingCutawayExplorer";
import { ProjectsSection, type Project } from "@/components/site/ProjectsSection";
import { useT, useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { SocialLinks } from "@/components/site/SocialLinks";
import type { TranslationKey, Lang } from "@/i18n/translations";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { lang?: Lang } => {
    return {
      lang: (search.lang as Lang) || undefined,
    };
  },
  loaderDeps: ({ search }) => ({
    lang: search.lang,
  }),
  loader: async ({ deps }) => {
    const [propsRes, projectsRes] = await Promise.all([
      supabase
        .from("properties")
        .select("*")
        .eq("published", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("projects")
        .select("id,title,location,year,status,description,cover_image,units")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    return {
      featured: (propsRes.data || []) as Property[],
      projects: (projectsRes.data || []) as Project[],
      search: deps,
    };
  },
  head: ({ loaderData }) => {
    const activeLang: Lang = loaderData?.search?.lang || "en";

    const titles: Record<Lang, string> = {
      en: "Temer Properties & Homes — Addis Property Market",
      am: "ቴምር ፕሮፐርቲስ እና ቤቶች — አዲስ ፕሮፐርቲ ማርኬት",
      om: "Qabeenya Teemer Properties — Addis Property Market",
      ti: "ቴምር ፕሮፐርቲስን ገዛውትን — ኣዲስ ፕሮፐርቲ ማርኬት",
      so: "Guryaha Temer Properties — Addis Property Market",
    };

    const descriptions: Record<Lang, string> = {
      en: "Find verified Temer Properties apartments, modern homes, and commercial spaces in Addis Ababa. Access direct sales agent pricing and fixed payment plans.",
      am: "በአዲስ አበባ የተረጋገጡ የቴምር ፕሮፐርቲስ አፓርትመንቶች፣ ዘመናዊ ቤቶች እና የንግድ ቦታዎችን ያግኙ። ቀጥተኛ የሽያጭ ወኪል ዋጋዎች እና ቋሚ የክፍያ እቅዶች።",
      om: "Finfinnee keessatti apaartamaa fi manneen Teemer Properties mirkanaa'an argadhaa. Kallattiin gatii gurgurtaa fi kaffaltii dhaabbataa argadhaa.",
      ti: "ኣብ ኣዲስ ኣበባ ዝተረጋገጹ ናይ ቴምር ፕሮፐርቲስ ኣፓርትመንትታት፣ ዘመናዊ ኣባይትን ቦታታትን ያግኙ። ቀጥታዊ ዋጋታት መሸጣን ቀዋሚ ክፍሊትን።",
      so: "Ka hel guryo iyo dabaqyo la xaqiijiyay oo ay leedahay Temer Properties magaalada Addis Ababa. Toos ula xiriir wakiilka rasmiga ah.",
    };

    const ogDescriptions: Record<Lang, string> = {
      en: "Authorized Temer Properties sales agent. Verified apartments & homes in Ayat, Lebu, Lafto, Sarbet, and Piassa. No price hike guarantee.",
      am: "የቴምር ፕሮፐርቲስ የተፈቀደ የሽያጭ ወኪል፡ በአያት፣ ሌቡ፣ ላፍቶ፣ ሳርቤት እና ፒያሳ የተረጋገጡ አፓርትመንቶች እና ቤቶች። ያለ ዋጋ ጭማሪ ዋስትና።",
      om: "Gurgurtaa Qabeenya Teemer Properties. Apaartamaa fi manneen Ayat, Lebu, Lafto, Sarbet, fi Piassa keessatti mirkanaa'an.",
      ti: "ፍቑድ ናይ ቴምር ፕሮፐርቲስ መሸጣ ተወካሊ። ኣብ አያት፣ ሌቡ፣ ላፍቶ፣ ሳርቤትን ፒያሳን ዝተረጋገጹ ኣፓርትመንትታትን ኣባይትን።",
      so: "Wakiilka rasmiga ah ee Temer Properties. Guryo iyo dabaqyo la xaqiijiyay oo ku yaal Ayat, Lebu, Lafto, Sarbet iyo Piassa.",
    };

    const title = titles[activeLang];
    const desc = descriptions[activeLang];
    const ogDesc = ogDescriptions[activeLang];

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: ogDesc },
        { property: "og:url", content: SITE_URL },
        { property: "og:image", content: `${SITE_URL}/logo.png` },
        { name: "twitter:image", content: `${SITE_URL}/logo.png` },
      ],
      links: [
        { rel: "canonical", href: SITE_URL },
        { rel: "alternate", hrefLang: "en", href: `${SITE_URL}?lang=en` },
        { rel: "alternate", hrefLang: "am", href: `${SITE_URL}?lang=am` },
        { rel: "alternate", hrefLang: "om", href: `${SITE_URL}?lang=om` },
        { rel: "alternate", hrefLang: "ti", href: `${SITE_URL}?lang=ti` },
        { rel: "alternate", hrefLang: "so", href: `${SITE_URL}?lang=so` },
        { rel: "alternate", hrefLang: "x-default", href: SITE_URL },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Which neighborhoods in Addis Ababa are best for investment?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Bole is highly sought-after for diaspora rentals and high yields. Sarbet is popular for families and embassies, Piassa is prime for commercial activity, and Ayat offers quieter, spacious residential apartments at more affordable prices.",
                },
              },
              {
                "@type": "Question",
                name: "How does the land leasehold system work in Addis Ababa?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "In Ethiopia, land is state-owned, so buyers purchase the building structures and long-term lease rights to the associated land (typically 50 to 99 years for residential developments in areas like Bole and Piassa). These leases are standard and renewable.",
                },
              },
              {
                "@type": "Question",
                name: "Can I purchase real estate remotely from abroad?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, you do not need to be physically present. You can execute the entire purchase remotely by appointing a trusted representative via a Power of Attorney (POA). The POA must be legalized at your nearest Ethiopian Embassy or Consulate and registered in Addis Ababa.",
                },
              },
              {
                "@type": "Question",
                name: "What are the typical payment plans for off-plan apartments?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Off-plan developments typically offer milestone-based payment plans. You start with a 10% to 30% down payment to secure the property. The remaining balance is split into installments tied to key construction phases (foundation, structural framing, finishing) over 1 to 3 years.",
                },
              },
              {
                "@type": "Question",
                name: "How do developers handle utility and water reliability in new builds?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "To ensure reliable utilities, premium apartments (especially in Bole, Sarbet, and central districts) are built with dedicated backup water reservoirs, standby electrical generators, and centralized waste systems. Always look for projects with these features standard.",
                },
              },
              {
                "@type": "Question",
                name: "What projects are currently offered by Temer Properties in Addis Ababa?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Temer Properties has delivered over 10 major residential and commercial projects in prime areas of Addis Ababa, including Ayat, Lebu, Lafto, Sarbet, and Piassa. We offer luxury apartments and modern family homes in these key neighborhoods.",
                },
              },
              {
                "@type": "Question",
                name: "Why is Temer Properties known for a 'no price hike' policy?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Unlike many developers in Ethiopia, Temer Properties commits to a fixed price guarantee in their sales contracts. Once you sign and make your initial down payment, your purchase price is locked, protecting you from construction inflation or sudden market hikes.",
                },
              },
            ],
          }),
        },
      ],
    };
  },
  component: Home,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
} as const;

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const;

function Home() {
  const { featured, projects } = Route.useLoaderData() as {
    featured: Property[];
    projects: Project[];
  };
  const t = useT();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  // Quick Command Dock Filter States
  const [quickLocation, setQuickLocation] = useState("any");
  const [quickType, setQuickType] = useState("any");
  const [categoryFilter, setCategoryFilter] = useState<"All" | "Residential" | "Commercial">("All");
  const [cutawayOpen, setCutawayOpen] = useState(false);
  const [selectedFloorUnit, setSelectedFloorUnit] = useState(1);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/properties",
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        location: quickLocation !== "any" ? quickLocation : undefined,
        type: quickType !== "any" ? quickType : undefined,
      }),
    });
  };

  const filteredFeatured = useMemo(() => {
    if (categoryFilter === "All") return featured;
    return featured.filter((p) => p.property_type === categoryFilter);
  }, [featured, categoryFilter]);

  return (
    <>
      {/* 1. CINEMATIC HERO 2.0 */}
      <section className="relative isolate overflow-hidden -mt-14 pb-20 pt-32 sm:pt-40 lg:pt-48">
        {/* Visual Canvas with Ambient Gradient Overlay */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.img
            src={heroImg}
            alt="Temer Properties Luxury Developments in Addis Ababa"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
        </div>

        <div className="container-x relative">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            {/* Left Content Column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="flex flex-col"
            >
              {/* Live Status Pill */}
              <motion.div variants={fadeUp} className="inline-flex items-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-xl shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span>{t("hero.badge")}</span>
                </span>
              </motion.div>

              {/* Kinetic Headline */}
              <motion.h1
                variants={fadeUp}
                className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                {t("hero.title1")}{" "}
                <span className="block mt-1">
                  {t("hero.title2")}{" "}
                  <span className="text-primary underline decoration-primary/40 decoration-wavy underline-offset-8">
                    {t("hero.city")}
                  </span>
                </span>
              </motion.h1>

              {/* Editorial Subtitle */}
              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-xl text-base text-white/85 sm:text-lg leading-relaxed font-normal"
              >
                {t("hero.subtitle")}
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link to="/properties" className="btn-primary text-sm px-7 py-3.5">
                  <span>{t("hero.browse")}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={waLink("Hi, I'd like to schedule an exclusive property consultation.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-sm px-6 py-3.5 shadow-lg"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{t("hero.contact")}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setCutawayOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-xl shadow-lg transition hover:bg-white/20 hover:border-primary/60 cursor-pointer"
                >
                  <Layers className="h-4 w-4 text-primary" />
                  <span>3D Blowout & Floor Plans</span>
                </button>
              </motion.div>

              {/* Live Social Proof Strip */}
              <motion.div variants={fadeUp} className="mt-8 flex items-center gap-4">
                <SocialLinks layout="row" />
              </motion.div>

              {/* Dynamic Stats Ticker */}
              <motion.dl
                variants={fadeUp}
                className="mt-12 grid max-w-xl grid-cols-3 gap-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md text-white"
              >
                {[
                  { k: "150+", v: t("hero.stat.units"), desc: "Delivered Residences" },
                  { k: "12+", v: t("hero.stat.projects"), desc: "Master Developments" },
                  { k: "100%", v: t("hero.stat.verified"), desc: "Fixed Price Guarantee" },
                ].map((s) => (
                  <div key={s.v} className="flex flex-col">
                    <dt className="font-display text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                      {s.k}
                    </dt>
                    <dd className="mt-0.5 text-xs font-semibold text-white/90">{s.v}</dd>
                  </div>
                ))}
              </motion.dl>
            </motion.div>

            {/* Right Interactive Floor-Level Hover Tower */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center justify-center"
            >
              <HeroInteractiveTower
                onSelectFloorUnit={(unitIdx) => {
                  setSelectedFloorUnit(unitIdx);
                  setCutawayOpen(true);
                }}
              />
            </motion.div>
          </div>

          {/* DOCKED QUICK COMMAND SEARCH DOCK */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-14"
          >
            <form
              onSubmit={handleQuickSearch}
              className="rounded-3xl border border-white/20 bg-background/95 p-3.5 sm:p-4 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5"
            >
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-[1.5fr_1.5fr_auto]">
                {/* Neighborhood Dropdown */}
                <div className="flex flex-col justify-center rounded-2xl border border-border/70 bg-muted/40 px-4 py-2.5 transition hover:border-primary/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Neighborhood
                  </span>
                  <select
                    value={quickLocation}
                    onChange={(e) => setQuickLocation(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-foreground outline-none cursor-pointer"
                  >
                    <option value="any">All Addis Ababa Locations</option>
                    <option value="Bole">Bole</option>
                    <option value="Ayat">Ayat</option>
                    <option value="Sarbet">Sarbet</option>
                    <option value="Lebu">Lebu</option>
                    <option value="Piassa">Piassa</option>
                    <option value="Adwa">Adwa 001</option>
                  </select>
                </div>

                {/* Property Type Dropdown */}
                <div className="flex flex-col justify-center rounded-2xl border border-border/70 bg-muted/40 px-4 py-2.5 transition hover:border-primary/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Property Type
                  </span>
                  <select
                    value={quickType}
                    onChange={(e) => setQuickType(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-foreground outline-none cursor-pointer"
                  >
                    <option value="any">All Property Types</option>
                    <option value="Residential">Residential Apartments</option>
                    <option value="Commercial">Commercial Spaces & Shops</option>
                  </select>
                </div>

                {/* Search Trigger */}
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto px-8 py-3.5 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Find Residences</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* 3D Architectural Cutaway Modal */}
        <BuildingCutawayModal
          open={cutawayOpen}
          onOpenChange={setCutawayOpen}
          initialUnitIndex={selectedFloorUnit}
        />
      </section>

      {/* 2. FEATURED RESIDENCES SHOWCASE */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="container-x py-24"
      >
        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" />
              <span>{t("featured.kicker")}</span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight">
              {t("featured.title")}
            </h2>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/50 p-1 self-start md:self-auto">
            {(["All", "Residential", "Commercial"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "All" ? "All Units" : cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Property Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFeatured.map((p) => (
            <motion.div key={p.id} variants={fadeUp}>
              <PropertyCard p={p} />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/properties"
            className="btn-outline inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold"
          >
            <span>Explore All Addis Ababa Residences</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.section>

      {/* 3. MASTER PROJECTS SECTION (SSR HYDRATED) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <ProjectsSection initialProjects={projects} />
      </motion.div>

      {/* 4. WHY TEMER — INTERACTIVE BENTO GRID */}
      <section className="bg-surface/50 py-24 border-b border-border/40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="container-x"
        >
          <motion.div variants={fadeUp} className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3 w-3" />
              <span>{t("why.kicker")}</span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight">
              {t("why.title")}
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {/* Bento Card 1: Fixed Price Guarantee (Spans 2 cols) */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 sm:p-10 shadow-card transition-all duration-300 hover:border-primary/50 hover:shadow-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-6 transition-transform duration-300 group-hover:scale-110">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
                100% Fixed Price Contract Guarantee
              </h3>
              <p className="mt-3 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Unlike common market practices in Ethiopia where buyers face mid-construction
                inflation escalations, Temer Properties locks your purchase price upon initial
                deposit. No price revisions. No surprises.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-border/60 bg-muted px-3 py-1 text-xs font-medium text-foreground">
                  Legally Binding Contracts
                </span>
                <span className="rounded-full border border-border/60 bg-muted px-3 py-1 text-xs font-medium text-foreground">
                  Milestone-Based Installments
                </span>
                <span className="rounded-full border border-border/60 bg-muted px-3 py-1 text-xs font-medium text-foreground">
                  Title Transfer Assurance
                </span>
              </div>
            </motion.div>

            {/* Bento Card 2: Prime Strategic Locations */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-card transition-all duration-300 hover:border-primary/50 hover:shadow-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary-dark mb-6 transition-transform duration-300 group-hover:scale-110">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                Strategic Prime Hubs
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Projects positioned in high-demand zones: Bole, Ayat, Sarbet, Lebu, and Piassa, with
                immediate access to transport, schools, and commerce.
              </p>
            </motion.div>

            {/* Bento Card 3: Diaspora Concierge */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-card transition-all duration-300 hover:border-primary/50 hover:shadow-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary-dark mb-6 transition-transform duration-300 group-hover:scale-110">
                <FileCheck2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                Diaspora Remote Purchasing
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Purchase your dream residence from anywhere in the world. Full assistance with
                embassy Power of Attorney (POA) legalization and milestone tracking.
              </p>
            </motion.div>

            {/* Bento Card 4: Utility Autonomy (Spans 2 cols) */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 sm:p-10 shadow-card transition-all duration-300 hover:border-primary/50 hover:shadow-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-6 transition-transform duration-300 group-hover:scale-110">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Independent Backup Utilities
              </h3>
              <p className="mt-3 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Every Temer residential complex is engineered with high-capacity underground water
                storage reservoirs and automated standby electrical generators to ensure
                uninterrupted luxury living.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 5. TESTIMONIALS (INFINITE DUAL-SPEED MARQUEE) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="container-x py-24 overflow-hidden"
      >
        <motion.div variants={fadeUp} className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Quote className="h-3 w-3" />
            <span>{t("test.kicker")}</span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight">
            {t("test.title")}
          </h2>
        </motion.div>

        {/* Infinite Scrolling Marquee */}
        <motion.div variants={fadeUp} className="mt-14 relative flex w-full">
          <motion.div
            className="flex gap-6 pr-6 whitespace-nowrap min-w-max"
            animate={{ x: [0, "-50%"] }}
            transition={{ duration: 45, ease: "linear", repeat: Infinity }}
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6">
                {[
                  {
                    q: "Patient, knowledgeable and incredibly responsive. He found us our luxury family home in Ayat within three weeks.",
                    n: "Hanna G.",
                    r: "Bole Resident & Homeowner",
                  },
                  {
                    q: "I purchased two units sight-unseen from Dallas via Power of Attorney. Every milestone was documented with video walkthroughs.",
                    n: "Robel A.",
                    r: "Diaspora Real Estate Investor",
                  },
                  {
                    q: "The fixed-price contract gave us peace of mind. Zero hidden costs or price spikes from deposit to handover.",
                    n: "Mahlet T.",
                    r: "First-Time Apartment Buyer",
                  },
                  {
                    q: "Direct sales agent access gave us first pick of high-yield commercial shops in Piassa before public launch.",
                    n: "Elias K.",
                    r: "Business Owner & Entrepreneur",
                  },
                ].map((tt) => (
                  <figure
                    key={tt.n + i}
                    className="w-[380px] shrink-0 whitespace-normal rounded-3xl border border-border/80 bg-card p-7 shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-hover"
                  >
                    <Quote className="h-6 w-6 text-primary" />
                    <blockquote className="mt-4 text-sm leading-relaxed text-foreground font-medium">
                      "{tt.q}"
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 pt-4 border-t border-border/60">
                      <div className="h-9 w-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                        {tt.n.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground">{tt.n}</div>
                        <div className="text-xs text-muted-foreground">{tt.r}</div>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </motion.div>

          {/* Fade gradients on edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </motion.div>
      </motion.section>

      {/* 6. BUYER FAQ SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="container-x py-24 bg-surface/40 border-t border-b border-border/40"
      >
        <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
          <motion.div variants={fadeUp}>
            <span className="badge-soft">{t("faq.kicker")}</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl leading-tight">
              {t("faq.title")}
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {lang === "am"
                ? "ስለ አዲስ አበባ የሪል ስቴት ገበያ፣ የሊዝ መብቶች እና የግዢ ሂደት ማወቅ የሚገባዎትን ዝርዝር መረጃዎች እዚህ ያገኛሉ።"
                : "Answers to essential questions regarding the Addis Ababa real estate market, lease rights, installment structures, and diaspora purchase protocols."}
            </p>
            <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/10 p-5">
              <span className="text-xs font-bold text-primary block">Have specific inquiries?</span>
              <p className="text-xs text-muted-foreground mt-1">
                Our sales team provides 1-on-1 private consultations.
              </p>
              <a
                href={waLink("Hi, I have a specific question about real estate in Addis Ababa.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                Chat on WhatsApp <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="w-full">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border border-border/80 bg-card rounded-2xl px-6 py-1 shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-hover data-[state=open]:border-primary/50"
                >
                  <AccordionTrigger className="font-display text-base font-semibold hover:no-underline text-foreground py-4 text-left">
                    {t(`faq.q${i}` as TranslationKey)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5 pt-1">
                    {t(`faq.a${i}` as TranslationKey)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </motion.section>

      {/* 7. VIP CONSULTATION CTA BANNER */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="container-x py-24"
      >
        <div className="relative overflow-hidden rounded-3xl bg-primary-dark p-10 text-primary-foreground shadow-2xl sm:p-16">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary/30 blur-3xl pointer-events-none" />

          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md mb-4">
                <Sparkles className="h-3 w-3" />
                <span>Private Sales Consultation</span>
              </div>
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                {t("cta.title")}
              </h2>
              <p className="mt-4 max-w-lg text-base text-white/90 leading-relaxed">
                {t("cta.body")}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 md:justify-end">
              <a
                href={`tel:${CONSULTANT.phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary-dark shadow-xl transition-transform hover:scale-105 hover:bg-white/95"
              >
                <Phone className="h-4 w-4" /> {CONSULTANT.phoneDisplay}
              </a>
              <a
                href={waLink(
                  "Hi, I'd like to book an exclusive consultation for Temer Properties.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp px-7 py-3.5 text-sm font-bold shadow-xl hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" /> {t("cta.whatsapp")}
              </a>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
