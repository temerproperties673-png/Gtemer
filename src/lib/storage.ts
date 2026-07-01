import { supabase } from "@/integrations/supabase/client";

const BUCKET = "property-images";
const LONG_EXPIRY = 60 * 60 * 24 * 365 * 10; // 10 years

function compressImageToWebP(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !file.type.startsWith("image/")) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image element"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function uploadPropertyImage(file: File): Promise<string> {
  let uploadData: File | Blob = file;
  let ext = file.name.split(".").pop() || "jpg";
  let contentType = file.type;

  if (typeof window !== "undefined" && file.type.startsWith("image/")) {
    try {
      const compressedBlob = await compressImageToWebP(file);
      uploadData = compressedBlob;
      ext = "webp";
      contentType = "image/webp";
    } catch (err) {
      console.error("Client-side image compression failed, falling back to raw file:", err);
    }
  }

  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, uploadData, {
    cacheControl: "31536000",
    contentType,
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
