// app/services/trash/category.service.ts
import apiClient, { ApiResponse } from "~/lib/api-client";
import type {
  TrashCategory,
  CreateTrashCategoryRequest,
  UpdateTrashCategoryRequest
} from "~/types/trash.types";

class TrashCategoryService {
  async getCategories(): Promise<ApiResponse<TrashCategory[]>> {
    const response = await apiClient.get<ApiResponse<TrashCategory[]>>(
      "/trash/category"
    );
    return response.data;
  }

  async createCategory(data: CreateTrashCategoryRequest): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("variety", data.variety);
    formData.append("estimated_price", data.estimated_price);
    formData.append("icon", data.icon);

    const response = await apiClient.post<ApiResponse>(
      "/trash/category/with-icon",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  }

  async updateCategory(
    id: string,
    data: UpdateTrashCategoryRequest
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("variety", data.variety);
    formData.append("estimated_price", data.estimated_price);
    
    if (data.icon) {
      formData.append("icon", data.icon);
    }

    const response = await apiClient.put<ApiResponse>(
      `/trash/category/${id}/with-icon`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  }

  async deleteCategory(id: string): Promise<ApiResponse> {
    const response = await apiClient.delete<ApiResponse>(
      `/trash/category/${id}`
    );
    return response.data;
  }
}

export default new TrashCategoryService();