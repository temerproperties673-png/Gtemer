import p1 from "@/assets/property-1.jpg";
import p2 from "@/assets/property-2.jpg";
import p3 from "@/assets/property-3.jpg";
import p4 from "@/assets/property-4.jpg";
import p5 from "@/assets/property-5.jpg";
import p6 from "@/assets/property-6.jpg";

export const CONSULTANT = {
  name: "Addis Property Market",
  title: "Senior Sales Consultant — Temer Properties",
  phone: "+251949775542",
  phoneDisplay: "+251 949 775 542",
  whatsapp: "251923791278",
  email: "Getumaru7@gmail.com",
  office: "Bole, Addis Ababa, Ethiopia",
  officeCoordinates: "8.992234,38.791513",
};

export const waLink = (message: string) =>
  `https://wa.me/${CONSULTANT.whatsapp}?text=${encodeURIComponent(message)}`;

export type Property = {
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
