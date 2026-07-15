import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Handshake,
  Zap,
  Building2,
  Quote,
  Phone,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-building.jpg";
import { CONSULTANT, waLink, type Property } from "@/data/properties";
import { PropertyCard } from "@/components/site/PropertyCard";
import { ProjectsSection } from "@/components/site/ProjectsSection";
import { useT, useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
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
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(6);
    return { featured: (data || []) as Property[], search: deps };
  },
  head: ({ loaderData }) => {
    const activeLang = ((loaderData as any)?.search?.lang as Lang) || "en";

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
        { property: "og:url", content: "https://addispropertymarket.com" },
        { property: "og:image", content: "https://addispropertymarket.com/logo.png" },
        { name: "twitter:image", content: "https://addispropertymarket.com/logo.png" },
      ],
      links: [
        { rel: "canonical", href: "https://addispropertymarket.com" },
        { rel: "alternate", hrefLang: "en", href: "https://addispropertymarket.com?lang=en" },
        { rel: "alternate", hrefLang: "am", href: "https://addispropertymarket.com?lang=am" },
        { rel: "alternate", hrefLang: "om", href: "https://addispropertymarket.com?lang=om" },
        { rel: "alternate", hrefLang: "ti", href: "https://addispropertymarket.com?lang=ti" },
        { rel: "alternate", hrefLang: "so", href: "https://addispropertymarket.com?lang=so" },
        { rel: "alternate", hrefLang: "x-default", href: "https://addispropertymarket.com" },
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const;

function Home() {
  const { featured } = Route.useLoaderData();
  const t = useT();
  const { lang } = useLanguage();

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden -mt-14">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.img
            src={heroImg}
            alt="Modern luxury apartment building in Addis Ababa"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
        </div>
        <div className="container-x relative pb-24 pt-32 sm:pt-40 lg:pt-52 grid gap-12 lg:grid-cols-2 lg:items-start">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col justify-center">
            <motion.div variants={fadeUp}>
              <span className="badge-soft border border-white/20 bg-white/10 text-white backdrop-blur-md shadow-lg">
                {t("hero.badge")}
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl"
            >
              {t("hero.title1")} <br className="hidden sm:block" />
              <span className="inline-block whitespace-nowrap">
                {t("hero.title2")} <span className="text-primary">{t("hero.city")}</span>
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl text-base text-white/85 sm:text-lg"
            >
              {t("hero.subtitle")}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Link to="/properties" className="btn-primary">
                {t("hero.browse")} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={waLink("Hi, I'd like to schedule a property consultation.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" /> {t("hero.contact")}
              </a>
            </motion.div>
            <motion.dl
              variants={fadeUp}
              className="mt-14 grid max-w-2xl grid-cols-3 gap-6 text-white"
            >
              {[
                { k: "150+", v: t("hero.stat.units") },
                { k: "12+", v: t("hero.stat.projects") },
                { k: "100%", v: t("hero.stat.verified") },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-3xl font-bold">{s.k}</dt>
                  <dd className="text-sm text-white/70">{s.v}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* RIGHT COLUMN (LOGO) - Hidden on mobile/tablet to maintain clean vertical alignment, shown only on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center lg:pt-12 lg:-translate-x-8"
          >
            <div className="relative group max-w-[320px] lg:max-w-[360px] w-full">
              {/* Pulsing ambient glowing background */}
              <div className="absolute -inset-1 rounded-3xl bg-primary/20 blur-xl opacity-75 transition duration-1000 group-hover:duration-200 group-hover:opacity-100 animate-pulse" />
              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-2xl transition duration-500 group-hover:scale-[1.02] flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Temer Properties Logo"
                  className="w-full h-auto object-contain max-h-[300px]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="container-x py-20"
      >
        <motion.div variants={fadeUp} className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {t("featured.kicker")}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              {t("featured.title")}
            </h2>
          </div>
          <Link
            to="/properties"
            className="hidden items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark sm:inline-flex"
          >
            {t("featured.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <motion.div key={p.id} variants={fadeUp}>
              <PropertyCard p={p} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* OUR PROJECTS */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <ProjectsSection />
      </motion.div>

      {/* WHY ME */}
      <section className="bg-surface py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="container-x"
        >
          <motion.div variants={fadeUp} className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {t("why.kicker")}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{t("why.title")}</h2>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: t("why.verified.t"), body: t("why.verified.b") },
              { icon: Building2, title: t("why.direct.t"), body: t("why.direct.b") },
              { icon: Handshake, title: t("why.guidance.t"), body: t("why.guidance.b") },
              { icon: Zap, title: t("why.fast.t"), body: t("why.fast.b") },
            ].map((b) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-hover"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary-dark transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <b.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* TESTIMONIALS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="container-x py-20 overflow-hidden"
      >
        <motion.div variants={fadeUp} className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t("test.kicker")}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{t("test.title")}</h2>
        </motion.div>

        {/* Simple Auto-Scrolling Marquee Wrapper */}
        <motion.div variants={fadeUp} className="mt-10 relative flex w-full">
          {/* We duplicate the content to create a seamless infinite loop */}
          <motion.div
            className="flex gap-6 pr-6 whitespace-nowrap min-w-max"
            animate={{ x: [0, "-50%"] }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6">
                {[
                  {
                    q: "Patient, knowledgeable and incredibly responsive. He found us our family home in three weeks.",
                    n: "Hanna G.",
                    r: "Bole Property Owner",
                  },
                  {
                    q: "I bought two commercial units sight-unseen from abroad. Every step was documented and on time.",
                    n: "Robel A.",
                    r: "Diaspora Investor",
                  },
                  {
                    q: "Professional from start to finish. The payment plan he negotiated made all the difference.",
                    n: "Mahlet T.",
                    r: "First-time Buyer",
                  },
                  {
                    q: "His access to exclusive off-market listings gave us the exact premium property we were looking for.",
                    n: "Elias K.",
                    r: "Tech Entrepreneur",
                  },
                ].map((tt) => (
                  <figure
                    key={tt.n + i}
                    className="w-[350px] shrink-0 whitespace-normal rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-hover"
                  >
                    <Quote className="h-6 w-6 text-primary/40" />
                    <blockquote className="mt-3 text-base leading-relaxed">{tt.q}</blockquote>
                    <figcaption className="mt-5 text-sm">
                      <div className="font-semibold">{tt.n}</div>
                      <div className="text-muted-foreground">{tt.r}</div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </motion.div>
          {/* Gradient fade on the edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </motion.div>
      </motion.section>

      {/* FAQ SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="container-x py-20 bg-surface/50 border-t border-b border-border/30"
      >
        <div className="grid gap-10 lg:grid-cols-[350px_1fr]">
          <motion.div variants={fadeUp}>
            <span className="badge-soft">{t("faq.kicker")}</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl leading-tight">
              {t("faq.title")}
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {lang === "am"
                ? "ስለ አዲስ አበባ የሪል ስቴት ገበያ፣ የሊዝ መብቶች እና የግዢ ሂደት ማወቅ የሚገባዎትን ዝርዝር መረጃዎች እዚህ ያገኛሉ።"
                : "Find detailed answers regarding the Addis Ababa property market, land lease rights, payment milestones, and remote purchase options."}
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="w-full">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border border-border/60 bg-card rounded-2xl px-6 py-1 shadow-soft transition-all duration-300 hover:shadow-hover data-[state=open]:border-primary/50 animate-fade-in"
                >
                  <AccordionTrigger className="font-display text-base font-semibold hover:no-underline text-foreground py-4">
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

      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="container-x pb-20"
      >
        <div className="relative overflow-hidden rounded-3xl bg-primary-dark p-10 text-primary-foreground shadow-2xl sm:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("cta.title")}</h2>
              <p className="mt-3 max-w-md text-white/85">{t("cta.body")}</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <a
                href={`tel:${CONSULTANT.phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-dark shadow-lg transition-transform hover:scale-105 hover:bg-white/95"
              >
                <Phone className="h-4 w-4" /> {CONSULTANT.phoneDisplay}
              </a>
              <a
                href={waLink("Hi, I'd like to book a consultation.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp shadow-lg hover:scale-105"
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
