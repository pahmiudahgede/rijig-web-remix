import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig
} from "axios";

export interface ApiResponse<T = any> {
  meta: {
    status: number;
    message: string;
  };
  data?: T;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.RIJIG_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (process.env.RIJIG_API_KEY) {
      config.headers["X-API-Key"] = process.env.RIJIG_API_KEY;
    }

    if (process.env.RIJIG_API_BASE_URL?.includes("ngrok")) {
      config.headers["ngrok-skip-browser-warning"] = "true";
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

let getRefreshToken: (() => string | null) | null = null;
let onTokenRefreshSuccess: ((data: any) => void) | null = null;
let onTokenRefreshError: (() => void) | null = null;

export function setTokenRefreshHandlers(handlers: {
  getRefreshToken: () => string | null;
  onSuccess: (data: any) => void;
  onError: () => void;
}) {
  getRefreshToken = handlers.getRefreshToken;
  onTokenRefreshSuccess = handlers.onSuccess;
  onTokenRefreshError = handlers.onError;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          if (!originalRequest._retry && getRefreshToken) {
            originalRequest._retry = true;

            if (!isRefreshing) {
              isRefreshing = true;

              try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) throw new Error("No refresh token");

                const response = await axios.post(
                  `${process.env.RIJIG_API_BASE_URL}/auth/refresh-token`,
                  { refresh_token: refreshToken },
                  {
                    headers: {
                      "X-API-Key": process.env.RIJIG_API_KEY,
                      "ngrok-skip-browser-warning": "true"
                    }
                  }
                );

                const { access_token } = response.data.data;

                apiClient.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${access_token}`;
                originalRequest.headers[
                  "Authorization"
                ] = `Bearer ${access_token}`;

                onTokenRefreshed(access_token);

                if (onTokenRefreshSuccess) {
                  onTokenRefreshSuccess(response.data.data);
                }

                isRefreshing = false;

                return apiClient(originalRequest);
              } catch (refreshError) {
                isRefreshing = false;

                if (onTokenRefreshError) {
                  onTokenRefreshError();
                }

                return Promise.reject(refreshError);
              }
            }

            return new Promise((resolve) => {
              subscribeTokenRefresh((token: string) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                resolve(apiClient(originalRequest));
              });
            });
          }
          break;
        case 403:
          break;
        case 404:
          break;
        case 422:
          break;
        case 500:
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
