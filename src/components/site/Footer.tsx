import { Link } from "@tanstack/react-router";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { CONSULTANT, waLink } from "@/data/properties";
import { useT, useLanguage } from "@/i18n/LanguageContext";
import { SocialLinks } from "@/components/site/SocialLinks";

export function Footer() {
  const t = useT();
  const { lang } = useLanguage();

  return (
    <footer className="relative mt-24 border-t border-border/80 bg-surface/80 overflow-hidden">
      {/* Top ambient glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="container-x py-16 grid gap-12 md:grid-cols-4 relative">
        {/* Brand & Mission Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Temer Properties"
              className="h-10 w-10 object-contain rounded-xl shadow-xs"
            />
            <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
              Temer<span className="text-primary font-bold"> · </span>Properties
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Authorized Developer Sales Representative</span>
          </div>

          <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
            {t("footer.tagline")} Delivering luxury apartments, modern family homes, and prime
            commercial developments across Addis Ababa since 2010 EC.
          </p>

          <div className="pt-2">
            <SocialLinks className="mt-2" />
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="font-display text-base font-bold text-foreground">
            {t("footer.explore")}
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li>
              <Link
                to="/properties"
                className="hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <span>{t("nav.properties")}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <span>{t("nav.about")}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <span>{t("nav.contact")}</span>
              </Link>
            </li>
            <li className="pt-2">
              <Link
                to="/auth"
                rel="nofollow"
                className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <span>Agent Portal Login</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Direct Contact Column */}
        <div>
          <h4 className="font-display text-base font-bold text-foreground">
            {t("footer.contact")}
          </h4>
          <ul className="mt-5 space-y-3.5 text-sm text-muted-foreground">
            <li>
              <a
                href={`tel:${CONSULTANT.phone}`}
                className="flex items-center gap-2.5 hover:text-foreground transition-colors group"
              >
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <span>{CONSULTANT.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href={waLink("Hi Yonas, I'd like to consult on properties.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-foreground transition-colors group"
              >
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <MessageCircle className="h-3.5 w-3.5" />
                </div>
                <span>WhatsApp Consultation</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONSULTANT.email}`}
                className="flex items-center gap-2.5 hover:text-foreground transition-colors group"
              >
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <span className="truncate">{CONSULTANT.email}</span>
              </a>
            </li>
            <li className="flex items-start gap-2.5 pt-1">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs leading-relaxed">{CONSULTANT.office}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Credit Strip */}
      <div className="border-t border-border/70 bg-background/50">
        <div className="container-x py-6 text-xs text-muted-foreground flex flex-wrap justify-between items-center gap-3">
          <span>
            © {new Date().getFullYear()} {CONSULTANT.name}. {t("footer.rights")}
          </span>
          <span>
            {lang === "am" ? (
              <>
                የጣቢያ አልሚ፦{" "}
                <a
                  href="https://yonatan-mikiyas-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-foreground transition-colors font-semibold"
                >
                  ዮናታን ሚኪያስ
                </a>{" "}
                (ስልክ፦{" "}
                <a
                  href="tel:+251945287324"
                  className="hover:underline hover:text-foreground transition-colors"
                >
                  +251 945 287 324
                </a>
                )
              </>
            ) : (
              <>
                Designed & Built by{" "}
                <a
                  href="https://yonatan-mikiyas-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-foreground transition-colors font-semibold"
                >
                  Yonatan Mikiyas
                </a>{" "}
                (Tel:{" "}
                <a
                  href="tel:+251945287324"
                  className="hover:underline hover:text-foreground transition-colors"
                >
                  +251 945 287 324
                </a>
                )
              </>
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
