import { supabase } from "@/integrations/supabase/client";

const BUCKET = "property-images";
const LONG_EXPIRY = 60 * 60 * 24 * 365 * 10; // 10 years

export async function uploadPropertyImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, LONG_EXPIRY);
  if (signErr) throw signErr;
  return data.signedUrl;
}

export function getStoragePathFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split(`/storage/v1/object/sign/${BUCKET}/`);
    if (parts.length > 1) return parts[1];

    const publicParts = parsed.pathname.split(`/storage/v1/object/public/${BUCKET}/`);
    if (publicParts.length > 1) return publicParts[1];

    const generalParts = parsed.pathname.split(`/${BUCKET}/`);
    if (generalParts.length > 1) return generalParts[1];

    return null;
  } catch {
    return null;
  }
}

export async function deletePropertyImages(urls: string[]): Promise<void> {
  const paths = urls
    .map(getStoragePathFromUrl)
    .filter((p): p is string => p !== null);

  if (paths.length === 0) return;

  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) {
    console.error("Failed to delete images from storage:", error);
    throw error;
  }
}
