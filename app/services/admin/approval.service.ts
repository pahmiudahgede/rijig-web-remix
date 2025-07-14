// app/services/admin/approval.service.ts
import apiClient, { ApiResponse } from "~/lib/api-client";
import type {
  UserRole,
  PendingUsersResponse,
  ApprovalDetailsResponse,
  ApprovalActionRequest,
  ApprovalActionResponse
} from "~/types/approval.types";

class ApprovalService {
  /**
   * Get pending users by role
   */
  async getPendingUsers(
    role: UserRole,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PendingUsersResponse>> {
    const response = await apiClient.get<ApiResponse<PendingUsersResponse>>(
      `/needapprove/pending`,
      {
        params: {
          role,
          page,
          limit
        }
      }
    );
    return response.data;
  }

  /**
   * Get approval details for specific user
   */
  async getApprovalDetails(
    userId: string
  ): Promise<ApiResponse<ApprovalDetailsResponse>> {
    const response = await apiClient.get<ApiResponse<ApprovalDetailsResponse>>(
      `/needapprove/${userId}/approval-details`
    );
    return response.data;
  }

  /**
   * Perform approval action (approve/reject)
   */
  async performApprovalAction(
    data: ApprovalActionRequest
  ): Promise<ApiResponse<ApprovalActionResponse>> {
    const response = await apiClient.post<ApiResponse<ApprovalActionResponse>>(
      `/needapprove/approval-action`,
      data
    );
    return response.data;
  }

  /**
   * Get all pending users (both pengelola and pengepul)
   */
  async getAllPendingUsers(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    pengelola: ApiResponse<PendingUsersResponse>;
    pengepul: ApiResponse<PendingUsersResponse>;
  }> {
    const [pengelolaResponse, pengepulResponse] = await Promise.all([
      this.getPendingUsers("pengelola", page, limit),
      this.getPendingUsers("pengepul", page, limit)
    ]);

    return {
      pengelola: pengelolaResponse,
      pengepul: pengepulResponse
    };
  }
}

export default new ApprovalService();