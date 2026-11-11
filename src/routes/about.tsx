import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Award,
  Building2,
  Users,
  Star,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { CONSULTANT, SITE_URL, waLink } from "@/data/properties";
import { useLanguage } from "@/i18n/LanguageContext";

import type { Lang } from "@/i18n/translations";

export const Route = createFileRoute("/about")({
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
      en: "About Temer Properties | Addis Property Market",
      am: "ስለ ቴምር ፕሮፐርቲስ | አዲስ ፕሮፐርቲ ማርኬት",
      om: "Waa'ee Temer Properties | Addis Property Market",
      ti: "ብዛዕባ ቴምር ፕሮፐርቲስ | ኣዲስ ፕሮፐርቲ ማርኬት",
      so: "Ku Saabsan Temer Properties | Addis Property Market",
    };

    const descriptions: Record<Lang, string> = {
      en: "Temer Properties has been transforming the real estate landscape in Ethiopia since 2010 EC. Discover our completed and ongoing residential and commercial developments.",
      am: "ቴምር ፕሮፐርቲስ ከ2010 ዓ.ም ጀምሮ በኢትዮጵያ የሪል ስቴት ዘርፍን እየቀየርን እንገኛለን። የመኖሪያ አፓርትመንቶች እና የንግድ ቦታዎችን ይመልከቱ።",
      om: "Teemer Properties bara 2010 EC irraa jalqabee Itoophiyaa keessatti qabeenya lafaa jijjiiraa jira. Apaartamaa fi daldala keenya ilaalii.",
      ti: "ቴምር ፕሮፐርቲስ ካብ 2010 ዓ.ም ጀሚርና ኣብ ኢትዮጵያ ናይ ሪል ስቴት ጽላት ንቕይር ኣለና። መኖሪያታትን ናይ ንግዲ ቦታታትናን ርኣዩ።",
      so: "Temer Properties waxay wax ka beddeleysaa qeybta guryaha ee Itoobiya tan iyo 2010 EC. Eeg dabaqyada iyo dukaamada ganacsi ee aan dhisnay.",
    };

    const ogTitle = titles[activeLang];
    const ogDesc = descriptions[activeLang];

    return {
      meta: [
        { title: ogTitle },
        { name: "description", content: ogDesc },
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: ogDesc },
        { property: "og:image", content: `${SITE_URL}/logo.png` },
        { name: "twitter:image", content: `${SITE_URL}/logo.png` },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/about` },
        { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/about?lang=en` },
        { rel: "alternate", hrefLang: "am", href: `${SITE_URL}/about?lang=am` },
        { rel: "alternate", hrefLang: "om", href: `${SITE_URL}/about?lang=om` },
        { rel: "alternate", hrefLang: "ti", href: `${SITE_URL}/about?lang=ti` },
        { rel: "alternate", hrefLang: "so", href: `${SITE_URL}/about?lang=so` },
        { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/about` },
      ].filter(
        (val, id, self) =>
          self.findIndex((t) => t.hrefLang === val.hrefLang && t.href === val.href) === id,
      ), // filter out duplicates just in case
    };
  },
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
      "Modern Family Homes",
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
      "ዘመናዊ መኖሪያ ቤቶች",
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
  om: {
    kicker: "Waa'ee Keenya",
    title: "Bara 2010 EC irraa jalqabee Itoophiyaa keessatti qabeenya lafaa jijjiiraa jirra",
    sectionTitle: "Waa'ee Qabeenya Teemer",
    sectionSubtitle: "Ijaarsa Qabeenya Teemer",
    paragraphs: [
      "Qabeenyi Teemer (Teemer Real Estate jedhamuunis kan beekamu) bara 2010 EC keessa namoota abjuu qaban lamaan Itoophiyaa keessatti qabeenya lafaa jijjiiruuf kaayyoofi ergama qabaniin hundeeffame. Itoophiyaa keessatti, keessattuu Finfinneetti, ijaarsa manneen jireenyaa fi daldalaa qulqullina qaban dhiyeessuu irratti xiyyeeffachuun, pirojektoota gurguddoo 10 ol milkiidhaan xumurreerra. Kanaanis apaartamoota qulqullina qaban 350 ol fi manneen jireenyaa ammayyaa mamiloota keenyaaf dhiyeessineerra.",
      "Amma ijaarsa apaartamoota haaraa fi iddoowwan daldalaa hojjechaa jirra. Kanaanis mamiloota keenyaaf manneen jireenyaa gatii madaalamaan daldalaaf bakka gaarii dhiyeessina. Qabeenyotni keenya sanyii adda addaa keessatti argamu, kanneen akka Piyaasaa, Adwaa 001, Sumaaleee Teeraa, Saarbeet, Ayaat, Gaarmanti fi Liisee—hundi isaanii akkaataa teessuma, gatii fi guddinaaf filatamaniiru.",
      "Itoophiyaa keessatti dhaabbata qabeenya lafaa beekamaa ta'uuf abjuu qabnuun, Qabeenyi Teemer kalaqaan, amanamummaafi qulqullinaani kan beekamudha. Apaartamoonni keenya Itoophiyaa keessatti sadarkaa olaanaan ijaaraman, tajaajilawwan gaariifi gatii madaalamaan. Itoophiyaa keessatti apaartamaa, maatii keessaniif mana ykn daldalaaf suuqii yoo barbaaddan, Qabeenyi Teemer abjuu keessan dhugoomsuuf michuu amansiisaadha.",
    ],
    stats: [
      { k: "10+", v: "Pirojektoota Gurguddoo" },
      { k: "350+", v: "Apaartamoota" },
      { k: "2010 EC", v: "Hundeeffame" },
    ],
    expertiseTitle: "Dandeettii Keenya",
    expertiseList: [
      "Apaartamoota Jireenyaa",
      "Manneen Ammayyaa",
      "Iddoowwan Daldalaa",
      "Qabeenya Investimentii",
      "Bakkeewwan Gaarii",
      "Ijaarsa Qulqullina Qabu",
    ],
    contactCard: {
      title: "Nu Quunnamaa",
      hours: "Wiixata – Sabataa, 3:00 am – 7:00 pm",
      buttonBook: "Gorsa Qabadhaa",
    },
  },
  ti: {
    kicker: "ብዛዕባና",
    title: "ካብ 2010 ዓ.ም ጀሚርና ኣብ ኢትዮጵያ ናይ ሪል ስቴት ጽላት ንቕይር ኣለና",
    sectionTitle: "ብዛዕባ ቴምር ፕሮፐርቲስ",
    sectionSubtitle: "ህንጻ ቴምር ፕሮፐርቲስ",
    paragraphs: [
      "ቴምር ፕሮፐርቲስ (ቴምር ሪል ስቴት ብዝብል እውን ዝፍለጥ) ኣብ 2010 ዓ.ም ብኽልተ በዓል ራእይ ውልቀሰባት ዝተመስረተ ኮይኑ፣ ዕላምኡ ድማ ኣብ ኢትዮጵያ ዘሎ ናይ ሪል ስቴት ጽላት ምቕያር እዩ። ዘመናዊን ምሹእን ዝኾነ ናይ ሪል ስቴት ህንጻታት ብፍላይ ኣብ ኣዲስ ኣበባ ከተማ ንምብጻሕ ቆራጽነት ብምግባር፣ ክሳብ ሕጂ ካብ 10 ንላዕሊ ዓበይቲ ፕሮጀክትታት ብዓወት ብምዝዛም ካብ 350 ንላዕሊ ፅሬት ዘለዎም ናይ ኣፓርትመንት ኣባይትን ዘመናዊ መኖሪያታትን ንዓማዊልና ኣቕሪብና ኣለና።",
      "ኣብዚ እዋን ኣብ ኢትዮጵያ ሓደስቲ ኣፓርትመንትታትን ናይ ንግዲ ዱካናትን ኣብ ምህናጽ ንርከብ፤ እዚ ድማ ንዓማዊልና ተመጣጣኒ መኖሪያታትን ምሹእ ናይ ንግዲ ቦታታትን ኣብ ቀንዲ ከባቢታት የቕርብ። ንብረታትና ብፍላይ ተበጻሕነቶም፣ ዋጋኦምን ናይ ዕብየት ዓቕሞምን ተጸኒዑ ኣብ ዝተመርጹ ከም ፒያሳ፣ ዓድዋ 001፣ ሱማሌ ተራ፣ ሳርቤት፣ ኣያት፣ ጋርመንትን ሊሴን ዝበሉ ከባቢታት ይርከቡ።",
      "ኣብ ኢትዮጵያ ብሉጽ ናይ ሪል ስቴት ኩባንያ ንምዃን ብዘለና ትምኒት ዝምራሕ ቴምር ፕሮፐርቲስ፣ ብምህዞ፣ ብተኣማንነትን ንጽሬት ብዘለዎ ቆራጽነትን ይፍለጥ። ኣብ ኢትዮጵያ እንሃንጾም ኣፓርትመንትታት ብሉጽ ጽሬት ዘለዎ ህንጻ፣ ማራኺ ኣገልግሎታትን ተወዳዳሪ ዋጋታትን ዘጠቓለሉ እዮም። ኣብ ኢትዮጵያ ኣፓርትመንትታት፣ ንስድራቤትኩም ዝኸውን ገዛ ወይ ንንግድኹም ዝኸውን ዱካናት ትደልዩ እንተደኣ ኴንኩም፣ ቴምር ፕሮፐርቲስ ናይ ሪል ስቴት ሕልምታትኩም እውን ንምግባር ዝተኣመነ መሻርኽትኹም እዩ።",
    ],
    stats: [
      { k: "10+", v: "ዓበይቲ ፕሮጀክትታት" },
      { k: "350+", v: "ኣፓርትመንትታት" },
      { k: "2010 ዓ.ም", v: "ዝተመስረተሉ" },
    ],
    expertiseTitle: "ቀንዲ ናይ ስራሕ ዓውድታት",
    expertiseList: [
      "መኖሪያ ኣፓርትመንትታት",
      "ዘመናዊ መኖሪያታት",
      "ናይ ንግዲ ቦታታት",
      "ናይ ኢንቨስትመንት ንብረት",
      "ስልታዊ ቦታታት",
      "ጽሬት ዘለዎ ህንጻ",
    ],
    contactCard: {
      title: "ርኸቡና",
      hours: "ሰኑይ – ቀዳም፣ 3:00 ቅ.ቀ - 7:00 ድ.ቀ",
      buttonBook: "ምኽሪ ይሓዙ",
    },
  },
  so: {
    kicker: "Nagu Saabsan",
    title: "Waxaan wax ka beddeleynaa qeybta guryaha ee Itoobiya tan iyo 2010 EC",
    sectionTitle: "Ku saabsan Temer Properties",
    sectionSubtitle: "Dhismaha Temer Properties",
    paragraphs: [
      "Temer Properties (sidoo kale loo yaqaan Temer Real Estate) waxaa la aasaasay 2010 EC laba qof oo hiigsi leh oo waday hadaf ah inay wax ka beddelaan qaabka guryaha ee Itoobiya. Anagoo diirada saareysa inaan gaarsiino guryo casri ah, gaar ahaan magaalada Addis Ababa, waxaan si guul leh u dhameystirnay in ka baxan 10 mashaariicda waaweyn, annagoo siinay in ka badan 350 guryo dabaqyo ah oo tayo leh macaamiisheena qiimaha leh.",
      "Hada, waxaan si firfircoon u dhiseynaa guryo dabaqyo cusub ah iyo dukaamo ganacsi, anagoo u fidineyna macaamiisha guryo la awoodi karo iyo goobo ganacsi oo ku yaala meelaha ugu fiican. Guryahayagu waxay ku yaalaan meelo muhiim ah sida Piassa, Adwa 001, Sumale Tera, Sarbet, Ayat, Garment, iyo Lycee—meel kasta waxaa loo doortay sahlanaanta gaaritaanka, qiimaha iyo fursada koritaanka.",
      "Anagoo ku shaqeyneyna hammiga ah inaan noqono shirkada guryaha ugu fiican Itoobiya, Temer Properties waxaa lagu yaqaanaa hal-abuurnimo, kalsooni, iyo u heellanida tayada. Dabaqyadayada Itoobiya waxaa loo dhisay heerarka ugu sarreeya, iyagoo leh dhisme tayo sare leh, adeegyo wanaagsan iyo qiimo tartan ah. Haddii aad raadineyso dabaqyo, guri qoyskaaga ah ama dukaamo ganacsi, Temer Properties waa wadaagaaga lagu kalsoon yahay si aad u xaqiijiso riyadaada guryaha.",
    ],
    stats: [
      { k: "10+", v: "Mashaariicda Waaweyn" },
      { k: "350+", v: "Dabaqyo Guryo ah" },
      { k: "2010 EC", v: "La Aasaasay" },
    ],
    expertiseTitle: "Qeybaha aan ku Fiicanahay",
    expertiseList: [
      "Dabaqyada Deegaanka",
      "Guryaha Qoyska ee Casriga ah",
      "Goobaha Ganacsiga",
      "Hantida Maalgashiga",
      "Goobaha Muhiimka ah",
      "Dhismo Tayo leh",
    ],
    contactCard: {
      title: "Nala soo xiriir",
      hours: "Isniin – Sabti, 9am – 7pm",
      buttonBook: "Ballanso Talo bixin",
    },
  },
};

function About() {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <section className="container-x py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[380px_1fr] lg:items-start">
        {/* Left Column: Brand Logo Showpiece */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          <div className="absolute -inset-2 rounded-3xl bg-primary/20 blur-2xl opacity-70 group-hover:opacity-100 transition duration-700" />
          <div className="relative flex flex-col items-center justify-center rounded-3xl border border-border/80 bg-card p-10 shadow-card backdrop-blur-xl">
            <img
              src="/logo.png"
              alt="Temer Properties Logo"
              width={300}
              height={300}
              className="h-auto w-full max-w-[260px] object-contain transition-transform duration-500 group-hover:scale-105"
            />
            <div className="mt-6 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" />
              <span>Established 2010 EC</span>
            </div>
            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {lang === "am" ? "የቴምር ምልክት" : "Temer Properties Official Seal"}
            </p>
          </div>
        </motion.div>

        {/* Right Column: Narrative & Stats Bento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3 w-3" />
            <span>{c.kicker}</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl leading-tight tracking-tight text-foreground">
            {c.title}
          </h1>

          <div className="mt-8 border-l-4 border-primary pl-5 py-1">
            <h2 className="font-display text-xl font-bold text-foreground">{c.sectionTitle}</h2>
            <p className="text-sm text-primary font-semibold mt-0.5">{c.sectionSubtitle}</p>
          </div>

          <div className="mt-6 space-y-4 text-base text-muted-foreground leading-relaxed">
            {c.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {c.stats.map((s, idx) => {
              const Icon = idx === 0 ? Building2 : idx === 1 ? Award : Users;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs transition hover:border-primary/40 hover:shadow-soft"
                >
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-display text-3xl font-extrabold tracking-tight text-foreground">
                    {s.k}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mt-1">{s.v}</div>
                </div>
              );
            })}
          </div>

          {/* Areas of Expertise */}
          <div className="mt-10">
            <h3 className="font-display text-lg font-bold text-foreground">{c.expertiseTitle}</h3>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {c.expertiseList.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/70 bg-muted/60 px-4 py-1.5 text-xs font-semibold text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Card */}
          <div className="mt-12 rounded-3xl border border-border/80 bg-card p-8 shadow-card">
            <h3 className="font-display text-xl font-bold text-foreground">
              {c.contactCard.title}
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 text-xs">
              <a
                href={`tel:${CONSULTANT.phone}`}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3.5 hover:border-primary transition"
              >
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Direct Call
                  </span>
                  <span className="font-bold text-foreground">{CONSULTANT.phoneDisplay}</span>
                </div>
              </a>

              <a
                href={`mailto:${CONSULTANT.email}`}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3.5 hover:border-primary transition"
              >
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Email Inquiries
                  </span>
                  <span className="font-bold text-foreground">{CONSULTANT.email}</span>
                </div>
              </a>

              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3.5">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Sales Office
                  </span>
                  <span className="font-bold text-foreground">{CONSULTANT.office}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3.5">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Star className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Visiting Hours
                  </span>
                  <span className="font-bold text-foreground">{c.contactCard.hours}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waLink("Hi, I'd like to chat about properties.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp py-3 px-6 text-xs font-bold"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Consultation
              </a>
              <Link to="/contact" className="btn-primary py-3 px-6 text-xs font-bold">
                {c.contactCard.buttonBook}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
