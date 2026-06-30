import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle, Award, Building2, Users, Star } from "lucide-react";
import { CONSULTANT, waLink } from "@/data/properties";
import { useLanguage } from "@/i18n/LanguageContext";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Addis Property Market" },
      {
        name: "description",
        content:
          "Temer Properties has been transforming the real estate landscape in Ethiopia since 2010 EC. Discover our completed and ongoing residential and commercial developments.",
      },
      { property: "og:title", content: "About Us — Addis Property Market" },
      {
        property: "og:description",
        content:
          "Successfully completed over 10 major projects, delivering more than 350 quality apartment units and modern homes in top locations in Addis Ababa.",
      },
      { property: "og:image", content: "https://addispropertymarket.com/logo.png" },
      { name: "twitter:image", content: "https://addispropertymarket.com/logo.png" },
    ],
    links: [{ rel: "canonical", href: "https://addispropertymarket.com/about" }],
  }),
  component: About,
});

const content = {
  en: {
    kicker: "About Us",
    title: "Transforming the real estate landscape in Ethiopia since 2010 EC",
    sectionTitle: "About Temer Properties",
    sectionSubtitle: "Temer Properties Building",
    paragraphs: [
      "Temer Properties, also known as Temer Real Estate, was founded in 2010 EC by two visionary individuals with a mission to transform the real estate landscape in Ethiopia. With a focus on delivering state-of-the-art real estate in Ethiopia, especially in Addis Ababa, we have successfully completed over 10 major projects, providing more than 350 quality apartment units and modern homes to our valued customers.",
      "Currently, we are actively developing new apartments and commercial shops in Ethiopia, offering clients access to affordable housing and prime business spaces in top locations. Our properties are strategically located in areas like Piassa, Adwa 001, Sumale Tera, Sarbet, Ayat, Garment, and Lycee—each chosen for accessibility, value, and growth potential.",
      "Driven by our ambition to be the best real estate company in Ethiopia, Temer Properties is recognized for creativity, reliability, and a commitment to quality. Our apartments in Ethiopia are built to the highest standards, featuring exceptional construction, desirable amenities, and competitive pricing. Whether you're searching for apartments in Ethiopia, a house for your family, or commercial shops for your business, Temer Properties is your trusted partner in making your real estate dreams a reality.",
    ],
    stats: [
      { k: "10+", v: "Major Projects" },
      { k: "350+", v: "Apartment Units" },
      { k: "2010 EC", v: "Established" },
    ],
    expertiseTitle: "Areas of Expertise",
    expertiseList: [
      "Residential Apartments",
      "Luxury Villas",
      "Commercial Spaces",
      "Investment Properties",
      "Strategic Locations",
      "Quality Construction",
    ],
    contactCard: {
      title: "Get in touch",
      hours: "Mon – Sat, 9am – 7pm",
      buttonBook: "Book a Consultation",
    },
  },
  am: {
    kicker: "ስለ እኛ",
    title: "ከ2010 ዓ.ም ጀምሮ በኢትዮጵያ የሪል ስቴት ዘርፍን እየቀየርን እንገኛለን",
    sectionTitle: "ስለ ቴምር ፕሮፐርቲስ",
    sectionSubtitle: "የቴምር ፕሮፐርቲስ ህንፃ",
    paragraphs: [
      "ቴምር ፕሮፐርቲስ (ቴምር ሪል ስቴት በመባልም የሚታወቀው) በ2010 ዓ.ም በሁለት ባለራዕይ ግለሰቦች የተመሰረተ ሲሆን፣ ዓላማውም በኢትዮጵያ ያለውን የሪል ስቴት ዘርፍ መለወጥ ነው። ዘመናዊና ምቹ የሆኑ የሪል ስቴት ግንባታዎችን በተለይም በአዲስ አበባ ከተማ ለማድረስ ትኩረት በማድረግ፣ እስካሁን ከ10 በላይ ታላላቅ ፕሮጀክቶችን በተሳካ ሁኔታ በማጠናቀቅ ከ350 በላይ ጥራት ያላቸውን የአፓርትመንት ቤቶች እና ዘመናዊ መኖሪያዎችን ለክቡራን ደንበኞቻችን አቅርበናል።",
      "በአሁኑ ጊዜ በኢትዮጵያ አዳዲስ አፓርትመንቶችን እና የንግድ ሱቆችን በመገንባት ላይ እንገኛለን፤ ይህም ለደንበኞቻችን ተመጣጣኝ መኖሪያ ቤቶች እና ምቹ የንግድ ቦታዎችን በዋና ዋና ስፍራዎች ያቀርባል። ንብረቶቻችን በተለይ ተደራሽነታቸው፣ እሴታቸው እና የእድገት እምቅ አቅማቸው ተጠንቶ በተመረጡ እንደ ፒያሳ፣ አድዋ 001፣ ሱማሌ ተራ፣ ሳርቤት፣ አያት፣ ጋርመንት እና ሊሴ ባሉ ስፍራዎች ላይ ስልታዊ በሆነ መንገድ ይገኛሉ።",
      "በኢትዮጵያ ውስጥ ምርጡ የሪል ስቴት ኩባንያ ለመሆን ባለን ምኞት የሚመራው ቴምር ፕሮፐርቲስ፣ በፈጠራ፣ በአስተማማኝነት እና ለጥራት ባለው ቁርጠኝነት ይታወቃል። በኢትዮጵያ የምንገነባቸው አፓርትመንቶች እጅግ ጥራት ባለው ግንባታ፣ ሳቢ የሆኑ አገልግሎቶች እና ተወዳዳሪ ዋጋዎችን በማካተት በከፍተኛ ደረጃ የተገነቡ ናቸው። በኢትዮጵያ ውስጥ አፓርትመንቶችን፣ ለቤተሰብዎ የሚሆን ቤት ወይም ለንግድዎ የሚሆኑ ሱቆችን እየፈለጉ ከሆነ፣ ቴምር ፕሮፐርቲስ የሪል ስቴት ህልሞቻችሁን እውን ለማድረግ የታመነ አጋርዎ ነው።",
    ],
    stats: [
      { k: "10+", v: "ታላላቅ ፕሮጀክቶች" },
      { k: "350+", v: "የአፓርትመንት ቤቶች" },
      { k: "2010 ዓ.ም", v: "የተመሰረተበት" },
    ],
    expertiseTitle: "ዋና ዋና የስራ ዘርፎች",
    expertiseList: [
      "የመኖሪያ አፓርትመንቶች",
      "ቅንጦት ቪላዎች",
      "የንግድ ቦታዎች",
      "የኢንቨስትመንት ንብረቶች",
      "ስልታዊ ቦታዎች",
      "ጥራት ያለው ግንባታ",
    ],
    contactCard: {
      title: "ያግኙን",
      hours: "ሰኞ – ቅዳሜ፣ ከጠዋቱ 3:00 - ከምሽቱ 1:00 ሰዓት",
      buttonBook: "ምክክር ይያዙ",
    },
  },
};

function About() {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <section className="container-x py-16">
      <div className="grid gap-12 lg:grid-cols-[380px_1fr] lg:items-start">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 shadow-card">
          <img
            src="/logo.png"
            alt="Temer Properties Logo"
            width={300}
            height={300}
            className="h-auto w-full max-w-[280px] object-contain transition-transform duration-300 hover:scale-105"
          />
          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {lang === "am" ? "የቴምር ምልክት" : "Temer Properties Logo"}
          </p>
        </div>
        <div>
          <span className="badge-soft">{c.kicker}</span>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl leading-tight">
            {c.title}
          </h1>

          <div className="mt-8 border-l-4 border-primary pl-4 py-1">
            <h2 className="font-display text-xl font-bold">{c.sectionTitle}</h2>
            <p className="text-sm text-primary font-medium">{c.sectionSubtitle}</p>
          </div>

          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            {c.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {c.stats.map((s, idx) => {
              const Icon = idx === 0 ? Building2 : idx === 1 ? Award : Users;
              return (
                <div key={idx} className="rounded-2xl border border-border bg-card p-5">
                  <Icon className="h-5 w-5 text-primary" />
                  <div className="mt-2 font-display text-2xl font-bold">{s.k}</div>
                  <div className="text-sm text-muted-foreground">{s.v}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold">{c.expertiseTitle}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.expertiseList.map((t) => (
                <span key={t} className="badge-soft">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">{c.contactCard.title}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
              <a
                href={`tel:${CONSULTANT.phone}`}
                className="inline-flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" /> {CONSULTANT.phoneDisplay}
              </a>
              <a
                href={`mailto:${CONSULTANT.email}`}
                className="inline-flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" /> {CONSULTANT.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> {CONSULTANT.office}
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" /> {c.contactCard.hours}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={waLink("Hi, I'd like to chat about properties.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <Link to="/contact" className="btn-primary">
                {c.contactCard.buttonBook}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
