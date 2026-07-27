export const getCloudinaryUrl = (
  publicId: string | null | undefined,
): string | null => {
  if (!publicId) return null;

  // If it's already a full URL, return it as is
  if (publicId.startsWith("http")) return publicId;

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "duhncgkpo";

  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
};

export function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getFileNameFromUrl(url: string): string {
  if (!url) return "Attachment";
  try {
    const parts = url.split("/");
    const fullName = parts[parts.length - 1] || "Attachment";
    return decodeURIComponent(fullName.split("?")[0]);
  } catch {
    return "Attachment";
  }
}

export function isImageUrl(url: string): boolean {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)(\?.*)?$/i.test(url) || url.includes("/image/upload/");
}

export function getPublicIdFromAttachment(item: unknown): string | null {
  if (!item) return null;
  if (typeof item === "object") {
    const obj = item as Record<string, unknown>;
    if (typeof obj.publicId === "string" && obj.publicId) return obj.publicId;
    if (typeof obj.public_id === "string" && obj.public_id) return obj.public_id;
  }
  const url =
    typeof item === "string"
      ? item
      : (item as Record<string, string>).fileUrl ||
        (item as Record<string, string>).file_url;
  if (!url) return null;

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return url.split(".")[0];
  }

  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^/.]+$|$)/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}
