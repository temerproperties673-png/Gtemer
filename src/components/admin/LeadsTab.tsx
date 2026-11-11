import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LeadCardSkeleton } from "./AdminShared";
import { type AdminLead } from "./adminUtils";

export function LeadsTab() {
  const [items, setItems] = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data || []) as AdminLead[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("leads-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, (payload) => {
        if (payload.eventType === "INSERT") {
          toast.success(`New lead from ${(payload.new as AdminLead).name}`);
        }
        load();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Lead deleted");
  };

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((l) => l.status === filter)),
    [items, filter],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filtered.length} of {items.length} leads
          </span>
          <span
            className="inline-flex h-2 w-2 animate-pulse rounded-full bg-primary"
            title="Live updates active"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <LeadCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            No leads yet.
          </p>
        ) : (
          filtered.map((l) => (
            <div key={l.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold">{l.name}</h3>
                    {l.status === "new" && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <a href={`tel:${l.phone}`} className="hover:text-primary">
                      {l.phone}
                    </a>
                    {l.email && (
                      <>
                        {" "}
                        ·{" "}
                        <a href={`mailto:${l.email}`} className="hover:text-primary">
                          {l.email}
                        </a>
                      </>
                    )}
                  </p>
                  {l.property_title && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Interested in: <strong>{l.property_title}</strong>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    defaultValue={l.status}
                    onChange={(e) => updateStatus(l.id, e.target.value)}
                    className="h-9 rounded-xl border border-input bg-background px-2 text-xs"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button
                    onClick={() => deleteLead(l.id)}
                    className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {l.message && (
                <p className="mt-3 whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-sm">
                  {l.message}
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(l.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
