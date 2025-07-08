import { setTokenRefreshHandlers } from "~/lib/api-client";
import type { SessionData } from "~/sessions.server";

export function setupTokenRefresh(sessionData?: SessionData | null) {
  if (typeof window === "undefined") return;

  if (sessionData) {
    if (sessionData.accessToken) {
      window.sessionStorage.setItem("access_token", sessionData.accessToken);
    }
    if (sessionData.refreshToken) {
      window.sessionStorage.setItem("refresh_token", sessionData.refreshToken);
    }
  }

  setTokenRefreshHandlers({
    getRefreshToken: () => {
      return window.sessionStorage.getItem("refresh_token");
    },
    onSuccess: (data) => {
      if (data.access_token) {
        window.sessionStorage.setItem("access_token", data.access_token);
      }
      if (data.refresh_token) {
        window.sessionStorage.setItem("refresh_token", data.refresh_token);
      }
    },
    onError: () => {
      window.sessionStorage.removeItem("access_token");
      window.sessionStorage.removeItem("refresh_token");

      if (window.location.pathname.startsWith("/sys-rijig-adminpanel")) {
        window.location.href = "/sys-rijig-administrator/sign-infirst";
      } else if (window.location.pathname.startsWith("/pengelola")) {
        window.location.href = "/authpengelola";
      }
    }
  });
}
