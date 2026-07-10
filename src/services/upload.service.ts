import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { BaseResponse } from "@/types/api.types";

export const uploadService = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<BaseResponse<{ url: string }>>(
      API_ENDPOINTS.UPLOADS.IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};
