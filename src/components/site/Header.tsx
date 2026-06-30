import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, LayoutDashboard, Languages } from "lucide-react";
import { CONSULTANT } from "@/data/properties";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const NAV: { to: string; key: TranslationKey }[] = [
  { to: "/", key: "nav.home" },
  { to: "/properties", key: "nav.properties" },
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
];

function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "am" : "en")}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition ${className}`}
      aria-label="Toggle language"
      title={lang === "en" ? "Switch to Amharic" : "Switch to English"}
    >
      <Languages className="h-4 w-4 text-primary" />
      <span className="font-semibold">{lang === "en" ? "አማ" : "EN"}</span>
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  return (
    <header className="sticky top-3 z-40 w-full">
      <div className="container-x">
        <div className="flex h-14 items-center justify-between rounded-full border border-border/60 bg-background/80 px-2 py-2 shadow-nav backdrop-blur-xl ring-1 ring-foreground/5 transition-all">
          <Link to="/" className="flex items-center gap-2 pl-3">
            <img
              src="/logo.png"
              alt="Temer Properties"
              className="h-8 w-8 object-contain rounded-lg"
            />
            <span className="font-display text-base font-semibold tracking-tight">
              Temer<span className="text-primary"> · </span>Properties
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-primary bg-accent" }}
              >
                {t(n.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-1 md:flex pr-1">
            <LangToggle />
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-primary hover:bg-accent transition"
              >
                <LayoutDashboard className="h-4 w-4" /> {t("nav.admin")}
              </Link>
            )}
            <a
              href={`tel:${CONSULTANT.phone}`}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition"
            >
              <Phone className="h-4 w-4 text-primary" />{" "}
              <span className="hidden lg:inline">{CONSULTANT.phoneDisplay}</span>
            </a>
            <Link to="/contact" className="btn-primary px-4 py-2 text-sm">
              {t("nav.bookVisit")}
            </Link>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <LangToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-full p-2.5 text-foreground hover:bg-accent transition"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="container-x mt-2 md:hidden">
          <div className="rounded-2xl border border-border/60 bg-background/95 p-3 shadow-card backdrop-blur-xl">
            <div className="flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-accent transition"
                >
                  {t(n.key)}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="btn-primary justify-center mt-2"
              >
                {t("nav.bookVisit")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
