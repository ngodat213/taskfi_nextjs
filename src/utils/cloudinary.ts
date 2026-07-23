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
