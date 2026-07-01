import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Home,
  Inbox,
  Star,
  Eye,
  EyeOff,
  Search,
  Building2,
  TrendingUp,
  Sparkles,
  Layers,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { uploadPropertyImage, deletePropertyImages } from "@/lib/storage";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Temer Sales Agent" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Property = {
  id: string;
  slug: string;
  title: string;
  location: string;
  property_type: "Residential" | "Commercial";
  status: "For Sale" | "New Offer" | "Active";
  bedrooms: number | null;
  bathrooms: number | null;
  area: string;
  developer: string;
  completion_date: string | null;
  description: string;
  amenities: string[];
  cover_image: string | null;
  gallery: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  property_title: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<"properties" | "projects" | "leads">("properties");
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
      </div>

      <div className="mt-6">
        {tab === "properties" ? (
          <PropertiesTab />
        ) : tab === "projects" ? (
          <ProjectsTab />
        ) : (
          <LeadsTab />
        )}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  pulse,
}: {
  label: string;
  value: number;
  icon: typeof Home;
  accent: "primary" | "emerald" | "amber";
  pulse?: boolean;
}) {
  const accents = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  } as const;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</p>
        </div>
        <div className={`relative grid h-10 w-10 place-items-center rounded-xl ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
          {pulse && (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Home;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
        active
          ? "bg-background text-foreground shadow-card"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" /> {children}
    </button>
  );
}

// ============ PROPERTIES TAB ============
function PropertiesTab() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
    } else {
      setItems((data || []) as Property[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (p: Property) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const urlsToDelete = [p.cover_image, ...(p.gallery || [])].filter((url): url is string => !!url);
    const { error } = await supabase.from("properties").delete().eq("id", p.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Property deleted");
      load();
      if (urlsToDelete.length > 0) {
        try {
          await deletePropertyImages(urlsToDelete);
        } catch (err) {
          console.error("Failed to clean up property images from storage:", err);
          toast.error("Property deleted, but some images could not be removed from storage.");
        }
      }
    }
  };

  const togglePublish = async (p: Property) => {
    const { error } = await supabase
      .from("properties")
      .update({ published: !p.published })
      .eq("id", p.id);
    if (error) toast.error(error.message);
    else load();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search properties..."
            className="h-10 w-full rounded-full border border-input bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
            {items.length}
          </p>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" /> Add Property
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Property</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Visibility</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="mt-3 font-medium">
                    {items.length === 0 ? "No properties yet" : "No properties match your search"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {items.length === 0
                      ? 'Click "Add Property" to create your first listing.'
                      : "Try a different keyword."}
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border transition hover:bg-muted/30 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.cover_image ? (
                        <img
                          src={p.cover_image}
                          alt=""
                          className="h-11 w-16 rounded-lg object-cover ring-1 ring-border"
                        />
                      ) : (
                        <div className="grid h-11 w-16 place-items-center rounded-lg bg-muted ring-1 ring-border">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="truncate">{p.title}</span>
                          {p.featured && (
                            <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                          )}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">/{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.location}</td>
                  <td className="px-4 py-3">{p.property_type}</td>
                  <td className="px-4 py-3">
                    <span className="badge-soft">{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(p)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                        p.published
                          ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground hover:bg-muted/70"
                      }`}
                    >
                      {p.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {p.published ? "Live" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setShowForm(true);
                        }}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <PropertyForm
          initial={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={() => {
            setShowForm(false);
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

// ============ PROPERTY FORM ============
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function PropertyForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: Property | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    slug: initial?.slug || "",
    location: initial?.location || "",
    property_type: initial?.property_type || "Residential",
    status: initial?.status || "For Sale",
    bedrooms: initial?.bedrooms?.toString() || "",
    bathrooms: initial?.bathrooms?.toString() || "",
    area: initial?.area || "",
    developer: initial?.developer || "Temer Properties",
    completion_date: initial?.completion_date || "",
    description: initial?.description || "",
    amenities: initial?.amenities?.join(", ") || "",
    featured: initial?.featured || false,
    published: initial?.published ?? true,
  });
  const [coverImage, setCoverImage] = useState<string | null>(initial?.cover_image || null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [gallery, setGallery] = useState<string[]>(initial?.gallery || []);
  const [galleryNewFiles, setGalleryNewFiles] = useState<File[]>([]);
  const [uploadMsg, setUploadMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const coverPreview = useMemo(() => {
    if (coverImageFile) {
      try {
        return URL.createObjectURL(coverImageFile);
      } catch (e) {
        console.error("Preview creation failed", e);
      }
    }
    return coverImage;
  }, [coverImageFile, coverImage]);

  const galleryPreviews = useMemo(() => {
    const existing = gallery.map((url, idx) => ({
      url,
      isNew: false,
      id: `old-${idx}`,
      fileIndex: undefined as number | undefined,
    }));
    const newFiles = galleryNewFiles.map((file, idx) => {
      let url = "";
      try {
        url = URL.createObjectURL(file);
      } catch (e) {
        console.error("Preview creation failed", e);
      }
      return { url, isNew: true, id: `new-${idx}`, fileIndex: idx as number | undefined };
    });
    return [...existing, ...newFiles];
  }, [gallery, galleryNewFiles]);

  const handleRemoveCover = () => {
    setCoverImage(null);
    setCoverImageFile(null);
  };

  const handleRemoveGalleryItem = (url: string, isNew: boolean, fileIndex?: number) => {
    if (isNew && fileIndex !== undefined) {
      setGalleryNewFiles((prev) => prev.filter((_, idx) => idx !== fileIndex));
    } else {
      setGallery((prev) => prev.filter((u) => u !== url));
    }
  };

  const handleUpload = (files: FileList | null, kind: "cover" | "gallery") => {
    if (!files || files.length === 0) return;
    if (kind === "cover") {
      setCoverImageFile(files[0]);
      setCoverImage(null);
    } else {
      setGalleryNewFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.area) {
      toast.error("Title, location and area are required");
      return;
    }
    setSaving(true);

    let finalCoverImage = coverImage;
    if (coverImageFile) {
      setUploadMsg("Uploading cover image...");
      try {
        finalCoverImage = await uploadPropertyImage(coverImageFile);
      } catch (err) {
        setSaving(false);
        setUploadMsg("");
        toast.error(err instanceof Error ? `Cover image upload failed: ${err.message}` : "Cover image upload failed");
        return;
      }
    }

    const finalGallery = [...gallery];
    if (galleryNewFiles.length > 0) {
      for (let i = 0; i < galleryNewFiles.length; i++) {
        setUploadMsg(`Uploading gallery image ${i + 1} of ${galleryNewFiles.length}...`);
        try {
          const url = await uploadPropertyImage(galleryNewFiles[i]);
          finalGallery.push(url);
        } catch (err) {
          setSaving(false);
          setUploadMsg("");
          toast.error(err instanceof Error ? `Gallery image upload failed (image ${i + 1}): ${err.message}` : `Gallery image upload failed (image ${i + 1})`);
          return;
        }
      }
    }

    setUploadMsg("Saving property data...");

    const payload = {
      title: form.title.trim(),
      slug: (form.slug || slugify(form.title)).trim(),
      location: form.location.trim(),
      property_type: form.property_type,
      status: form.status,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      area: form.area.trim(),
      developer: form.developer.trim(),
      completion_date: form.completion_date.trim() || null,
      description: form.description.trim(),
      amenities: form.amenities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: form.featured,
      published: form.published,
      cover_image: finalCoverImage,
      gallery: finalGallery,
    };

    try {
      const { error } = initial
        ? await supabase.from("properties").update(payload).eq("id", initial.id)
        : await supabase.from("properties").insert(payload);

      if (error) {
        toast.error(`Database save failed: ${error.message}`);
      } else {
        toast.success(initial ? "Property updated" : "Property created");
        onSaved();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save property");
    } finally {
      setSaving(false);
      setUploadMsg("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4">
      <div className="mx-auto my-8 max-w-3xl rounded-2xl bg-background shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4 rounded-t-2xl">
          <h2 className="font-display text-xl font-semibold">
            {initial ? "Edit Property" : "New Property"}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title *">
              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                    slug: form.slug || slugify(e.target.value),
                  })
                }
                className={inputCls}
              />
            </Field>
            <Field label="Slug (URL)">
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                className={inputCls}
                placeholder="auto-generated from title"
              />
            </Field>
            <Field label="Location *">
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Area *">
              <input
                required
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className={inputCls}
                placeholder="e.g. 80 – 100 m²"
              />
            </Field>
            <Field label="Property Type">
              <select
                value={form.property_type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    property_type: e.target.value as "Residential" | "Commercial",
                  })
                }
                className={inputCls}
              >
                <option>Residential</option>
                <option>Commercial</option>
              </select>
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as "For Sale" | "New Offer" | "Active",
                  })
                }
                className={inputCls}
              >
                <option>For Sale</option>
                <option>New Offer</option>
                <option>Active</option>
              </select>
            </Field>
            <Field label="Bedrooms">
              <input
                type="number"
                min="0"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Bathrooms">
              <input
                type="number"
                min="0"
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Developer">
              <input
                value={form.developer}
                onChange={(e) => setForm({ ...form, developer: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Completion Date">
              <input
                value={form.completion_date}
                onChange={(e) => setForm({ ...form, completion_date: e.target.value })}
                className={inputCls}
                placeholder="e.g. Q4 2026"
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputCls + " min-h-[100px]"}
            />
          </Field>

          <Field label="Amenities (comma-separated)">
            <input
              value={form.amenities}
              onChange={(e) => setForm({ ...form, amenities: e.target.value })}
              className={inputCls}
              placeholder="Elevator, Generator, 24/7 Security"
            />
          </Field>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Cover Image
            </label>
            <div className="mt-2 flex items-center gap-3">
              {coverPreview && (
                <div className="relative">
                  <img src={coverPreview} alt="" className="h-20 w-28 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <label className="btn-outline cursor-pointer">
                <Upload className="h-4 w-4" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files, "cover")}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Gallery
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {galleryPreviews.map((p) => (
                <div key={p.id} className="relative">
                  <img src={p.url} alt="" className="h-20 w-28 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryItem(p.url, p.isNew, p.fileIndex)}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="btn-outline cursor-pointer">
                <Upload className="h-4 w-4" />
                Add
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files, "gallery")}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured on homepage
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Published (visible to public)
            </label>
          </div>

          {saving && uploadMsg && (
            <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-4 text-sm text-primary border border-primary/20 animate-pulse">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="font-medium">{uploadMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-60"
            >
              {saving ? "Saving..." : initial ? "Save Changes" : "Create Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

// ============ SKELETONS ============
function AdminSkeleton() {
  return (
    <section className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="mt-2 h-9 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-8 w-12" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 inline-flex rounded-full border border-border bg-muted/40 p-1">
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="ml-1 h-9 w-24 rounded-full" />
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-11 w-16 rounded-lg" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="mt-1 h-3 w-20" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-5 w-12 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TableRowSkeleton() {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-16 rounded-lg" />
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-1 h-3 w-20" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-5 w-12 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-1">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </td>
    </tr>
  );
}

function LeadCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="w-full max-w-md">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-4 w-48" />
          <Skeleton className="mt-1 h-3 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
      <Skeleton className="mt-3 h-16 w-full rounded-lg" />
      <Skeleton className="mt-2 h-3 w-32" />
    </div>
  );
}

// ============ LEADS TAB ============
function LeadsTab() {
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data || []) as Lead[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("leads-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, (payload) => {
        if (payload.eventType === "INSERT") {
          toast.success(`New lead from ${(payload.new as Lead).name}`);
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

// ============ PROJECTS TAB ============
type Project = {
  id: string;
  title: string;
  location: string;
  year: string | null;
  status: string;
  description: string;
  cover_image: string | null;
  gallery: string[];
  units: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function ProjectsTab() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data || []) as Project[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (p: Project) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const urlsToDelete = [p.cover_image, ...(p.gallery || [])].filter((url): url is string => !!url);
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Project deleted");
      load();
      if (urlsToDelete.length > 0) {
        try {
          await deletePropertyImages(urlsToDelete);
        } catch (err) {
          console.error("Failed to clean up project images from storage:", err);
          toast.error("Project deleted, but some images could not be removed from storage.");
        }
      }
    }
  };

  const togglePublish = async (p: Project) => {
    const { error } = await supabase
      .from("projects")
      .update({ published: !p.published })
      .eq("id", p.id);
    if (error) toast.error(error.message);
    else load();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (p) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="h-10 w-full rounded-full border border-input bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
            {items.length}
          </p>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" /> Add Project
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Project</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Year</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Visibility</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                {Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="mt-3 font-medium">
                    {items.length === 0 ? "No projects yet" : "No projects match your search"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {items.length === 0
                      ? 'Click "Add Project" to showcase your portfolio.'
                      : "Try a different keyword."}
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border transition hover:bg-muted/30 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.cover_image ? (
                        <img
                          src={p.cover_image}
                          alt=""
                          className="h-11 w-16 rounded-lg object-cover ring-1 ring-border"
                        />
                      ) : (
                        <div className="grid h-11 w-16 place-items-center rounded-lg bg-muted ring-1 ring-border">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="truncate">{p.title}</span>
                          {p.featured && (
                            <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                          )}
                        </div>
                        {p.units && (
                          <div className="truncate text-xs text-muted-foreground">{p.units}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.location}</td>
                  <td className="px-4 py-3">{p.year || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="badge-soft capitalize">{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(p)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                        p.published
                          ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground hover:bg-muted/70"
                      }`}
                    >
                      {p.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {p.published ? "Live" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setShowForm(true);
                        }}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProjectForm
          initial={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={() => {
            setShowForm(false);
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function ProjectForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    location: initial?.location || "",
    year: initial?.year || "",
    status: initial?.status || "completed",
    units: initial?.units || "",
    description: initial?.description || "",
    sort_order: initial?.sort_order?.toString() || "0",
    featured: initial?.featured || false,
    published: initial?.published ?? true,
  });
  const [coverImage, setCoverImage] = useState<string | null>(initial?.cover_image || null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [gallery, setGallery] = useState<string[]>(initial?.gallery || []);
  const [galleryNewFiles, setGalleryNewFiles] = useState<File[]>([]);
  const [uploadMsg, setUploadMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const coverPreview = useMemo(() => {
    if (coverImageFile) {
      try {
        return URL.createObjectURL(coverImageFile);
      } catch (e) {
        console.error("Preview creation failed", e);
      }
    }
    return coverImage;
  }, [coverImageFile, coverImage]);

  const galleryPreviews = useMemo(() => {
    const existing = gallery.map((url, idx) => ({
      url,
      isNew: false,
      id: `old-${idx}`,
      fileIndex: undefined as number | undefined,
    }));
    const newFiles = galleryNewFiles.map((file, idx) => {
      let url = "";
      try {
        url = URL.createObjectURL(file);
      } catch (e) {
        console.error("Preview creation failed", e);
      }
      return { url, isNew: true, id: `new-${idx}`, fileIndex: idx as number | undefined };
    });
    return [...existing, ...newFiles];
  }, [gallery, galleryNewFiles]);

  const handleRemoveCover = () => {
    setCoverImage(null);
    setCoverImageFile(null);
  };

  const handleRemoveGalleryItem = (url: string, isNew: boolean, fileIndex?: number) => {
    if (isNew && fileIndex !== undefined) {
      setGalleryNewFiles((prev) => prev.filter((_, idx) => idx !== fileIndex));
    } else {
      setGallery((prev) => prev.filter((u) => u !== url));
    }
  };

  const handleUpload = (files: FileList | null, kind: "cover" | "gallery") => {
    if (!files || files.length === 0) return;
    if (kind === "cover") {
      setCoverImageFile(files[0]);
      setCoverImage(null);
    } else {
      setGalleryNewFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location) {
      toast.error("Title and location are required");
      return;
    }
    setSaving(true);

    let finalCoverImage = coverImage;
    if (coverImageFile) {
      setUploadMsg("Uploading cover image...");
      try {
        finalCoverImage = await uploadPropertyImage(coverImageFile);
      } catch (err) {
        setSaving(false);
        setUploadMsg("");
        toast.error(err instanceof Error ? `Cover image upload failed: ${err.message}` : "Cover image upload failed");
        return;
      }
    }

    const finalGallery = [...gallery];
    if (galleryNewFiles.length > 0) {
      for (let i = 0; i < galleryNewFiles.length; i++) {
        setUploadMsg(`Uploading gallery image ${i + 1} of ${galleryNewFiles.length}...`);
        try {
          const url = await uploadPropertyImage(galleryNewFiles[i]);
          finalGallery.push(url);
        } catch (err) {
          setSaving(false);
          setUploadMsg("");
          toast.error(err instanceof Error ? `Gallery image upload failed (image ${i + 1}): ${err.message}` : `Gallery image upload failed (image ${i + 1})`);
          return;
        }
      }
    }

    setUploadMsg("Saving project data...");

    const payload = {
      title: form.title.trim(),
      location: form.location.trim(),
      year: form.year.trim() || null,
      status: form.status,
      units: form.units.trim() || null,
      description: form.description.trim(),
      sort_order: Number(form.sort_order) || 0,
      featured: form.featured,
      published: form.published,
      cover_image: finalCoverImage,
      gallery: finalGallery,
    };

    try {
      const { error } = initial
        ? await supabase.from("projects").update(payload).eq("id", initial.id)
        : await supabase.from("projects").insert(payload);

      if (error) {
        toast.error(`Database save failed: ${error.message}`);
      } else {
        toast.success(initial ? "Project updated" : "Project created");
        onSaved();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setSaving(false);
      setUploadMsg("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4">
      <div className="mx-auto my-8 max-w-3xl rounded-2xl bg-background shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4 rounded-t-2xl">
          <h2 className="font-display text-xl font-semibold">
            {initial ? "Edit Project" : "New Project"}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title *">
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Location *">
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputCls}
                placeholder="e.g. Bole, Addis Ababa"
              />
            </Field>
            <Field label="Year">
              <input
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className={inputCls}
                placeholder="e.g. 2023"
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputCls}
              >
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </Field>
            <Field label="Units / Size">
              <input
                value={form.units}
                onChange={(e) => setForm({ ...form, units: e.target.value })}
                className={inputCls}
                placeholder="e.g. 120 apartments"
              />
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputCls + " min-h-[100px]"}
            />
          </Field>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Cover Image
            </label>
            <div className="mt-2 flex items-center gap-3">
              {coverPreview && (
                <div className="relative">
                  <img src={coverPreview} alt="" className="h-20 w-28 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <label className="btn-outline cursor-pointer">
                <Upload className="h-4 w-4" /> Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files, "cover")}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Gallery
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {galleryPreviews.map((p) => (
                <div key={p.id} className="relative">
                  <img src={p.url} alt="" className="h-20 w-28 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryItem(p.url, p.isNew, p.fileIndex)}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="btn-outline cursor-pointer">
                <Upload className="h-4 w-4" /> Add
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files, "gallery")}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Published (visible to public)
            </label>
          </div>

          {saving && uploadMsg && (
            <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-4 text-sm text-primary border border-primary/20 animate-pulse">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="font-medium">{uploadMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-60"
            >
              {saving ? "Saving..." : initial ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
