import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LogOut,
  Home,
  Inbox,
  Eye,
  Building2,
  TrendingUp,
  Sparkles,
  Layers,
  Share2,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AdminSkeleton, StatCard, TabBtn } from "@/components/admin/AdminShared";
import { PropertiesTab } from "@/components/admin/PropertiesTab";
import { ProjectsTab } from "@/components/admin/ProjectsTab";
import { LeadsTab } from "@/components/admin/LeadsTab";
import { SocialLinksTab } from "@/components/admin/SocialLinksTab";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Temer Sales Agent" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<"properties" | "projects" | "leads" | "social">("properties");
  const [stats, setStats] = useState({ total: 0, published: 0, featured: 0, newLeads: 0 });

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Admin access required");
    }
  }, [loading, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [props, leads] = await Promise.all([
        supabase.from("properties").select("published,featured"),
        supabase.from("leads").select("status").eq("status", "new"),
      ]);
      const p = (props.data || []) as { published: boolean; featured: boolean }[];
      setStats({
        total: p.length,
        published: p.filter((x) => x.published).length,
        featured: p.filter((x) => x.featured).length,
        newLeads: (leads.data || []).length,
      });
    })();
  }, [isAdmin, tab]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (loading) {
    return <AdminSkeleton />;
  }

  if (!isAdmin) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Not authorized</h1>
        <p className="mt-2 text-muted-foreground">Your account ({user?.email}) is not an admin.</p>
        <button onClick={signOut} className="btn-outline mt-6">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <section className="container-x py-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-soft">Admin</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user?.email}</span>
          </p>
        </div>
        <button onClick={signOut} className="btn-outline">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Properties" value={stats.total} icon={Building2} accent="primary" />
        <StatCard label="Published" value={stats.published} icon={Eye} accent="emerald" />
        <StatCard label="Featured" value={stats.featured} icon={Sparkles} accent="amber" />
        <StatCard
          label="New Leads"
          value={stats.newLeads}
          icon={TrendingUp}
          accent="primary"
          pulse={stats.newLeads > 0}
        />
      </div>

      {/* Pill tabs */}
      <div className="mt-8 inline-flex rounded-full border border-border bg-muted/40 p-1">
        <TabBtn active={tab === "properties"} onClick={() => setTab("properties")} icon={Home}>
          Properties
        </TabBtn>
        <TabBtn active={tab === "projects"} onClick={() => setTab("projects")} icon={Layers}>
          Projects
        </TabBtn>
        <TabBtn active={tab === "leads"} onClick={() => setTab("leads")} icon={Inbox}>
          Leads{" "}
          {stats.newLeads > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
              {stats.newLeads}
            </span>
          )}
        </TabBtn>
        <TabBtn active={tab === "social"} onClick={() => setTab("social")} icon={Share2}>
          Social
        </TabBtn>
      </div>

      <div className="mt-6">
        {tab === "properties" ? (
          <PropertiesTab />
        ) : tab === "projects" ? (
          <ProjectsTab />
        ) : tab === "social" ? (
          <SocialLinksTab />
        ) : (
          <LeadsTab />
        )}
      </div>
    </section>
  );
}
