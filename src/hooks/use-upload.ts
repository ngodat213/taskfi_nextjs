import { useMutation } from "@tanstack/react-query";

import { uploadService } from "@/services/upload.service";

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadService.uploadImage(file),
  });
}

export function useDeleteImage() {
  return useMutation({
    mutationFn: (publicId: string) => uploadService.deleteImage(publicId),
  });
}
