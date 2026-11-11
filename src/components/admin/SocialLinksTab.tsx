import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SOCIAL_PLATFORMS } from "@/data/socialPlatforms";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export function SocialLinksTab() {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("social_links").select("platform_key, url");
      const map: Record<string, string> = {};
      (data || []).forEach((row: { platform_key: string; url: string }) => {
        map[row.platform_key] = row.url;
      });
      setUrls(map);
      setSaved(map);
      setLoading(false);
    })();
  }, []);

  const handleSave = async (key: string) => {
    const url = urls[key]?.trim();
    setSaving((s) => ({ ...s, [key]: true }));
    try {
      if (!url) {
        const { error } = await supabase.from("social_links").delete().eq("platform_key", key);
        if (error) throw error;
        setSaved((s) => {
          const next = { ...s };
          delete next[key];
          return next;
        });
        setUrls((u) => {
          const next = { ...u };
          delete next[key];
          return next;
        });
        toast.success("Link removed");
      } else {
        const { error } = await supabase
          .from("social_links")
          .upsert({ platform_key: key, url, active: true }, { onConflict: "platform_key" });
        if (error) throw error;
        setSaved((s) => ({ ...s, [key]: url }));
        toast.success("Link saved");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving((s) => ({ ...s, [key]: false }));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-lg font-semibold">Social Media Links</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste a URL to activate a button on the website. Clear the field and save to remove it.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {SOCIAL_PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const currentUrl = urls[platform.key] ?? "";
            const savedUrl = saved[platform.key] ?? "";
            const isDirty = currentUrl !== savedUrl;
            const isSaving = saving[platform.key] ?? false;
            const isActive = !!savedUrl;

            return (
              <div
                key={platform.key}
                className="group rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:shadow-hover"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full"
                      style={{ backgroundColor: platform.color + "18" }}
                    >
                      <Icon size={18} style={{ color: platform.color }} />
                    </span>
                    <span className="text-sm font-semibold">{platform.label}</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isActive ? "Live" : "Off"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={currentUrl}
                    onChange={(e) => setUrls((u) => ({ ...u, [platform.key]: e.target.value }))}
                    placeholder={platform.placeholder}
                    className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 min-w-0"
                  />
                  <button
                    onClick={() => handleSave(platform.key)}
                    disabled={!isDirty || isSaving}
                    className="btn-primary shrink-0 disabled:opacity-40"
                  >
                    {isSaving ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
