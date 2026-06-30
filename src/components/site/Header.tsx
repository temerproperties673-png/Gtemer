import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, LayoutDashboard, Languages, ChevronDown } from "lucide-react";
import { CONSULTANT } from "@/data/properties";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey, Lang } from "@/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const NAV: { to: string; key: TranslationKey }[] = [
  { to: "/", key: "nav.home" },
  { to: "/properties", key: "nav.properties" },
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
];

const langLabels: Record<Lang, string> = {
  en: "EN",
  am: "አማ",
  om: "OR",
  ti: "ትግ",
  so: "SO",
};

const languages: { code: Lang; label: string; subLabel: string }[] = [
  { code: "en", label: "English", subLabel: "English" },
  { code: "am", label: "አማርኛ", subLabel: "Amharic" },
  { code: "om", label: "Afaan Oromoo", subLabel: "Oromo" },
  { code: "ti", label: "ትግርኛ", subLabel: "Tigrinya" },
  { code: "so", label: "Soomaali", subLabel: "Somali" },
];

function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-accent/15 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent/40 transition duration-200 cursor-pointer ${className}`}
          aria-label="Select language"
        >
          <Languages className="h-3.5 w-3.5 text-primary" />
          <span>{langLabels[lang]}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] bg-background/95 border border-border/60 p-1.5 shadow-xl backdrop-blur-xl rounded-2xl z-50">
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`flex flex-col items-start gap-0.5 px-3 py-2 rounded-xl text-sm transition cursor-pointer ${
              lang === l.code
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <span>{l.label}</span>
            <span className={`text-[10px] uppercase tracking-wider ${lang === l.code ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
              {l.subLabel}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
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
