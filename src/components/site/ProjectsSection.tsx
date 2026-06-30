import { useEffect, useState } from "react";
import { MapPin, Building2, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/i18n/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

type Project = {
  id: string;
  title: string;
  location: string;
  year: string | null;
  status: string;
  description: string;
  cover_image: string | null;
  units: string | null;
};

export function ProjectsSection() {
  const t = useT();
  const [items, setItems] = useState<Project[] | null>(null);

  useEffect(() => {
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
  }, []);

  // Hide entire section when there's nothing published
  if (items !== null && items.length === 0) return null;

  const statusMeta = (s: string) => {
    const v = s.toLowerCase();
    if (v === "ongoing" || v === "in-progress")
      return {
        label: t("projects.ongoing"),
        Icon: Clock,
        cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
      };
    if (v === "upcoming")
      return { label: t("projects.upcoming"), Icon: Building2, cls: "bg-primary/10 text-primary" };
    return {
      label: t("projects.completed"),
      Icon: CheckCircle2,
      cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    };
  };

  return (
    <section className="bg-surface py-20">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t("projects.kicker")}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            {t("projects.title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("projects.subtitle")}</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items === null
            ? Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)
            : items.map((p) => {
                const meta = statusMeta(p.status);
                return (
                  <article
                    key={p.id}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-hover"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {p.cover_image ? (
                        <img
                          src={p.cover_image}
                          alt={p.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center">
                          <Building2 className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute left-3 top-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur ${meta.cls}`}
                        >
                          <meta.Icon className="h-3 w-3" />
                          {meta.label}
                        </span>
                      </div>
                      {p.year && (
                        <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                          {p.year}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold leading-snug">{p.title}</h3>
                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {p.location}
                      </p>
                      {p.units && <p className="mt-2 text-sm text-foreground/80">{p.units}</p>}
                      {p.description && (
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                          {p.description}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
        </div>
      </div>
    </section>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
        <Skeleton className="mt-3 h-3 w-full" />
        <Skeleton className="mt-1.5 h-3 w-5/6" />
      </div>
    </div>
  );
}
