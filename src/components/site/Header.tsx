import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, LayoutDashboard, Languages, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
          className={`inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/50 px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent/60 transition-all duration-200 cursor-pointer shadow-xs ${className}`}
          aria-label="Select language"
        >
          <Languages className="h-3.5 w-3.5 text-primary" />
          <span>{langLabels[lang]}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[190px] bg-background/95 border border-border/70 p-1.5 shadow-2xl backdrop-blur-2xl rounded-2xl z-50"
      >
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`flex flex-col items-start gap-0.5 px-3 py-2 rounded-xl text-sm transition cursor-pointer ${
              lang === l.code
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <span>{l.label}</span>
            <span
              className={`text-[10px] uppercase tracking-wider ${lang === l.code ? "text-primary-foreground/75" : "text-muted-foreground"}`}
            >
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
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-3 z-40 w-full transition-all duration-300">
      <div className="container-x">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-14 items-center justify-between rounded-full border border-border/70 bg-background/85 px-2.5 py-1.5 shadow-nav backdrop-blur-2xl ring-1 ring-foreground/5 transition-all"
        >
          <Link to="/" className="group flex items-center gap-2.5 pl-3">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Temer Properties"
                className="h-8 w-8 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </div>
            <span className="font-display text-base font-bold tracking-tight">
              Temer<span className="text-primary font-bold"> · </span>Properties
            </span>
          </Link>

          {/* Desktop Navigation with Morphing Indicator */}
          <nav
            className="hidden items-center gap-1 md:flex relative p-1"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {NAV.map((n) => {
              const isActive = n.to === "/" ? currentPath === "/" : currentPath.startsWith(n.to);
              const isHovered = hoveredNav === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onMouseEnter={() => setHoveredNav(n.to)}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {(isHovered || (isActive && !hoveredNav)) && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 rounded-full bg-accent/80 border border-primary/20 -z-10 shadow-xs"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {t(n.key)}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden items-center gap-2 md:flex pr-1">
            <LangToggle />
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent transition-all duration-200 border border-primary/20"
              >
                <LayoutDashboard className="h-3.5 w-3.5" /> {t("nav.admin")}
              </Link>
            )}
            <a
              href={`tel:${CONSULTANT.phone}`}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-all duration-200"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />{" "}
              <span className="hidden lg:inline">{CONSULTANT.phoneDisplay}</span>
            </a>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact" className="btn-primary px-4 py-2 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                {t("nav.bookVisit")}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-1.5 md:hidden">
            <LangToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-full p-2 text-foreground hover:bg-accent transition"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Animated Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="container-x mt-2 md:hidden"
          >
            <div className="rounded-2xl border border-border/80 bg-background/95 p-3.5 shadow-2xl backdrop-blur-2xl">
              <div className="flex flex-col gap-1">
                {NAV.map((n) => {
                  const isActive =
                    n.to === "/" ? currentPath === "/" : currentPath.startsWith(n.to);
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <span>{t(n.key)}</span>
                      {isActive && <span className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                    </Link>
                  );
                })}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-primary hover:bg-accent transition border border-primary/20 mt-1"
                  >
                    <LayoutDashboard className="h-4 w-4" /> {t("nav.admin")}
                  </Link>
                )}

                <div className="my-2 border-t border-border/60" />

                <div className="flex items-center justify-between px-2 py-1 text-sm text-muted-foreground">
                  <a
                    href={`tel:${CONSULTANT.phone}`}
                    className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition"
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    {CONSULTANT.phoneDisplay}
                  </a>
                </div>

                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="btn-primary justify-center mt-2 w-full text-sm font-semibold"
                >
                  <Sparkles className="h-4 w-4" />
                  {t("nav.bookVisit")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
