import apiClient, { ApiResponse } from "~/lib/api-client";
import type {
  AdminLoginRequest,
  AdminOtpVerifyRequest,
  AdminRegisterRequest,
  AuthTokenData,
  ForgotPasswordRequest,
  OtpResponse,
  ResetPasswordRequest,
  VerifyEmailRequest
} from "~/types/auth.types";

class AdminAuthService {
  async login(data: AdminLoginRequest): Promise<ApiResponse<OtpResponse>> {
    const response = await apiClient.post<ApiResponse<OtpResponse>>(
      "/auth/login/admin",
      data
    );
    return response.data;
  }

  async verifyOtp(
    data: AdminOtpVerifyRequest
  ): Promise<ApiResponse<AuthTokenData>> {
    const response = await apiClient.post<ApiResponse<AuthTokenData>>(
      "/auth/verify-otp-admin",
      data
    );
    return response.data;
  }

  async register(data: AdminRegisterRequest): Promise<
    ApiResponse<{
      message: string;
      email: string;
      expires_in_seconds: number;
      remaining_time: string;
    }>
  > {
    const response = await apiClient.post<ApiResponse>(
      "/auth/register/admin",
      data
    );
    return response.data;
  }

  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<OtpResponse>> {
    const response = await apiClient.post<ApiResponse<OtpResponse>>(
      "/auth/forgot-password",
      data
    );
    return response.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>(
      "/auth/reset-password",
      data
    );
    return response.data;
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>(
      "/auth/verify-email",
      data
    );
    return response.data;
  }
}

export default new AdminAuthService();
