import apiClient, { ApiResponse } from "~/lib/api-client";
import type {
  ApprovalCheckResponse,
  AuthTokenData,
  CompanyProfileRequest,
  CreatePinRequest,
  PengelolaOtpRequest,
  PengelolaOtpVerifyRequest,
  VerifyPinRequest
} from "~/types/auth.types";

class PengelolaAuthService {
  async requestOtpRegister(data: PengelolaOtpRequest): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>(
      "/auth/request-otp/register",
      data
    );
    return response.data;
  }

  async requestOtpLogin(data: PengelolaOtpRequest): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>(
      "/auth/request-otp",
      data
    );
    return response.data;
  }

  async verifyOtpRegister(
    data: PengelolaOtpVerifyRequest
  ): Promise<ApiResponse<AuthTokenData>> {
    const response = await apiClient.post<ApiResponse<AuthTokenData>>(
      "/auth/verif-otp/register",
      data
    );
    return response.data;
  }

  async verifyOtpLogin(
    data: PengelolaOtpVerifyRequest
  ): Promise<ApiResponse<AuthTokenData>> {
    const response = await apiClient.post<ApiResponse<AuthTokenData>>(
      "/auth/verif-otp",
      data
    );
    return response.data;
  }

  async createCompanyProfile(
    data: CompanyProfileRequest
  ): Promise<ApiResponse<AuthTokenData>> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.post<ApiResponse<AuthTokenData>>(
      "/companyprofile/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  }

  async checkApproval(): Promise<ApiResponse<ApprovalCheckResponse>> {
    const response = await apiClient.get<ApiResponse<ApprovalCheckResponse>>(
      "/auth/cekapproval"
    );
    return response.data;
  }

  async createPin(data: CreatePinRequest): Promise<ApiResponse<AuthTokenData>> {
    const response = await apiClient.post<ApiResponse<AuthTokenData>>(
      "/pin/create",
      data
    );
    return response.data;
  }

  async verifyPin(data: VerifyPinRequest): Promise<ApiResponse<AuthTokenData>> {
    const response = await apiClient.post<ApiResponse<AuthTokenData>>(
      "/pin/verif",
      data
    );
    return response.data;
  }
}

export default new PengelolaAuthService();
