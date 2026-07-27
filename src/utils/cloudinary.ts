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
