import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Star,
  Eye,
  EyeOff,
  Search,
  Building2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadPropertyImage, deletePropertyImages } from "@/lib/storage";
import { Field, TableRowSkeleton } from "./AdminShared";
import { type AdminProperty, inputCls, slugify } from "./adminUtils";

export function PropertiesTab() {
  const [items, setItems] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminProperty | null>(null);
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
      setItems((data || []) as AdminProperty[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (p: AdminProperty) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const urlsToDelete = [p.cover_image, ...(p.gallery || [])].filter(
      (url): url is string => !!url,
    );
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

  const togglePublish = async (p: AdminProperty) => {
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

function PropertyForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: AdminProperty | null;
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
        toast.error(
          err instanceof Error
            ? `Cover image upload failed: ${err.message}`
            : "Cover image upload failed",
        );
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
          toast.error(
            err instanceof Error
              ? `Gallery image upload failed (image ${i + 1}): ${err.message}`
              : `Gallery image upload failed (image ${i + 1})`,
          );
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
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? "Saving..." : initial ? "Save Changes" : "Create Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
