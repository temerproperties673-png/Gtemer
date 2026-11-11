export type AdminProperty = {
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

export type AdminProject = {
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

export type AdminLead = {
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

export const inputCls =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
