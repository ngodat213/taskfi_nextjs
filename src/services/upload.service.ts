import { apiFetch } from "@/lib/api-fetch";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { BaseResponse, UploadResponse } from "@/types/api.types";

export const uploadService = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetch<BaseResponse<UploadResponse>>(
      API_ENDPOINTS.UPLOADS.UPLOAD,
      {
        method: "POST",
        body: formData,
      },
    );
  },
  deleteImage: async (publicId: string) => {
    return apiFetch<BaseResponse<void>>(
      `${API_ENDPOINTS.UPLOADS.DELETE}?publicId=${encodeURIComponent(publicId)}`,
      {
        method: "DELETE",
      },
    );
  },
};
