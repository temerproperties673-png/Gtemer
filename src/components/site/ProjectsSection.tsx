import { useEffect, useState } from "react";
import { MapPin, Building2, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/i18n/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

export type Project = {
  id: string;
  title: string;
  location: string;
  year: string | null;
  status: string;
  description: string;
  cover_image: string | null;
  units: string | null;
};

interface ProjectsSectionProps {
  initialProjects?: Project[];
}

export function ProjectsSection({ initialProjects }: ProjectsSectionProps) {
  const t = useT();
  const [items, setItems] = useState<Project[] | null>(initialProjects || null);

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) return;
    (async () => {
      const { data } = await supabase
        .from("projects")
        .select("id,title,location,year,status,description,cover_image,units")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(6);
      setItems((data || []) as Project[]);
    })();
  }, [initialProjects]);

  // Hide entire section when there's nothing published
  if (items !== null && items.length === 0) return null;

  const statusMeta = (s: string) => {
    const v = s.toLowerCase();
    if (v === "ongoing" || v === "in-progress")
      return {
        label: t("projects.ongoing"),
        Icon: Clock,
        badgeCls: "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400",
        progress: 75,
        progressLabel: "Structural Framing & Finishing",
      };
    if (v === "upcoming")
      return {
        label: t("projects.upcoming"),
        Icon: Building2,
        badgeCls: "border-primary/30 bg-primary/15 text-primary",
        progress: 25,
        progressLabel: "Site Preparation & Foundation",
      };
    return {
      label: t("projects.completed"),
      Icon: CheckCircle2,
      badgeCls: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
      progress: 100,
      progressLabel: "Delivered & Handed Over",
    };
  };

  return (
    <section className="relative overflow-hidden bg-surface/60 py-24 border-y border-border/50">
      {/* Subtle ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-96 w-[800px] bg-primary/5 blur-3xl rounded-full" />

      <div className="container-x relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" />
              <span>{t("projects.kicker")}</span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("projects.title")}
            </h2>
            <p className="mt-3 text-base text-muted-foreground">{t("projects.subtitle")}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items === null
            ? Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)
            : items.map((p) => {
                const meta = statusMeta(p.status);
                return (
                  <motion.article
                    key={p.id}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-hover"
                  >
                    {/* Visual Media */}
                    <div className="relative aspect-[16/11] overflow-hidden bg-muted">
                      {p.cover_image ? (
                        <img
                          src={p.cover_image}
                          alt={p.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-108"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-muted">
                          <Building2 className="h-10 w-10 text-muted-foreground/60" />
                        </div>
                      )}

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-75" />

                      {/* Floating Status Tag */}
                      <div className="absolute left-3.5 top-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md shadow-md ${meta.badgeCls}`}
                        >
                          <meta.Icon className="h-3.5 w-3.5" />
                          {meta.label}
                        </span>
                      </div>

                      {p.year && (
                        <div className="absolute right-3.5 top-3.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-md">
                          {p.year}
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {p.title}
                      </h3>

                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{p.location}</span>
                      </p>

                      {p.units && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border/60 bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground/80 w-fit">
                          <Building2 className="h-3.5 w-3.5 text-primary" />
                          <span>{p.units}</span>
                        </div>
                      )}

                      {p.description && (
                        <p className="mt-3.5 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                          {p.description}
                        </p>
                      )}

                      {/* Construction Progress Bar */}
                      <div className="mt-auto pt-5 border-t border-border/60">
                        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground mb-1.5">
                          <span>{meta.progressLabel}</span>
                          <span className="font-semibold text-foreground">{meta.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${meta.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
        </div>
      </div>
    </section>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <Skeleton className="aspect-[16/11] w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}
