/**
 * SocialLinks component
 *
 * Fetches active social links from Supabase and renders branded icon buttons.
 * Renders nothing if no links are active — no empty space left behind.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SOCIAL_PLATFORMS } from "@/data/socialPlatforms";

type SocialLink = {
  platform_key: string;
  url: string;
};

type Props = {
  /** "row" = horizontal icon strip (footer/hero), "grid" = wrapped grid */
  layout?: "row" | "grid";
  /** Icon size in px */
  size?: number;
  /** Extra class names on the wrapper */
  className?: string;
};

export function SocialLinks({ layout = "row", size = 20, className = "" }: Props) {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    supabase
      .from("social_links")
      .select("platform_key, url")
      .eq("active", true)
      .then(({ data }) => {
        if (data) setLinks(data as SocialLink[]);
      });
  }, []);

  // Map DB rows → platform registry entries (preserves registry order)
  const active = SOCIAL_PLATFORMS.filter((p) => links.some((l) => l.platform_key === p.key)).map(
    (p) => ({ ...p, url: links.find((l) => l.platform_key === p.key)!.url }),
  );

  if (active.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap gap-2 ${layout === "grid" ? "justify-start" : "items-center"} ${className}`}
    >
      {active.map(({ key, label, icon: Icon, color, url }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="group relative grid h-9 w-9 place-items-center rounded-full border border-border bg-card shadow-soft transition-all duration-200 hover:scale-110 hover:shadow-hover"
          style={
            {
              "--brand": color,
            } as React.CSSProperties
          }
        >
          <Icon
            size={size}
            className="text-muted-foreground transition-colors duration-200 group-hover:text-[--brand]"
          />
        </a>
      ))}
    </div>
  );
}
