import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";
import { CONSULTANT } from "@/data/properties";
import { useT, useLanguage } from "@/i18n/LanguageContext";

export function Footer() {
  const t = useT();
  const { lang } = useLanguage();
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Temer Properties"
              className="h-9 w-9 object-contain rounded-lg"
            />
            <span className="font-display text-lg font-semibold">
              Temer<span className="text-primary"> · </span>Properties
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold">{t("footer.explore")}</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/properties" className="hover:text-foreground">
                {t("nav.properties")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-foreground">
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                {t("nav.contact")}
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-primary font-semibold transition-colors">
                Admin Panel Login
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold">{t("footer.contact")}</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />{" "}
              <a href={`tel:${CONSULTANT.phone}`}>{CONSULTANT.phoneDisplay}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />{" "}
              <a href={`mailto:${CONSULTANT.email}`}>{CONSULTANT.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> {CONSULTANT.office}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x py-5 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
          <span>
            © {new Date().getFullYear()} {CONSULTANT.name}. {t("footer.rights")}
          </span>
          <span>
            {lang === "am" ? (
              <>
                አልሚ፦{" "}
                <a
                  href="https://yonatan-mikiyas-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-foreground transition-colors font-medium"
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
                Developer:{" "}
                <a
                  href="https://yonatan-mikiyas-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-foreground transition-colors font-medium"
                >
                  Yonatan Mikiyas
                </a>{" "}
                (Phone:{" "}
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
