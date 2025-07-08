import apiClient, { ApiResponse } from "~/lib/api-client";
import type { AuthTokenData, RefreshTokenRequest } from "~/types/auth.types";

class CommonAuthService {
  async refreshToken(
    data: RefreshTokenRequest
  ): Promise<ApiResponse<AuthTokenData>> {
    const response = await apiClient.post<ApiResponse<AuthTokenData>>(
      "/auth/refresh-token",
      data
    );
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>("/auth/logout");
    return response.data;
  }

  setAuthToken(token: string) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete apiClient.defaults.headers.common["Authorization"];
  }
}

export default new CommonAuthService();
