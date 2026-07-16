import { apiFetch } from "@/lib/api-fetch";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { BaseResponse, UploadResponse } from "@/types/api.types";

export const uploadService = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetch<BaseResponse<UploadResponse>>(API_ENDPOINTS.UPLOADS.IMAGE, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
