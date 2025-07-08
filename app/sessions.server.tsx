import {createThemeSessionResolver} from 'remix-themes'
import { createCookieSessionStorage, redirect } from "@remix-run/node"
import type { UserRole, RegistrationStatus, TokenType } from "~/types/auth.types";
import commonAuthService from "~/services/auth/common.service";

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  role: UserRole;
  deviceId?: string;
  email?: string;
  phone?: string;
  tokenType?: TokenType;
  registrationStatus?: RegistrationStatus;
  nextStep?: string;
}

// Session flash data
export interface SessionFlashData {
  error?: string;
  success?: string;
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__remix-themes',
    // domain: 'remix.run',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    // secrets: ['s3cr3t'],
    secrets: [process.env.SESSION_SECRET || "s3cr3t"],
    secure: process.env.NODE_ENV === "production",
    // secure: true,
  },
})

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// Commit session
export async function commitSession(session: any) {
  return sessionStorage.commitSession(session);
}

// Destroy session
export async function destroySession(session: any) {
  return sessionStorage.destroySession(session);
}

// Create user session
export async function createUserSession({
  request,
  sessionData,
  redirectTo,
}: {
  request: Request;
  sessionData: SessionData;
  redirectTo: string;
}) {
  const session = await getSession(request);
  
  // Set all session data
  Object.entries(sessionData).forEach(([key, value]) => {
    if (value !== undefined) {
      session.set(key as keyof SessionData, value);
    }
  });

  // Set auth token for API client (server-side)
  commonAuthService.setAuthToken(sessionData.accessToken);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

// Get user from session
export async function getUserSession(request: Request): Promise<SessionData | null> {
  const session = await getSession(request);
  
  const accessToken = session.get("accessToken");
  if (!accessToken) return null;

  // Set auth token for API client
  commonAuthService.setAuthToken(accessToken);

  return {
    accessToken: session.get("accessToken") || "",
    refreshToken: session.get("refreshToken") || "",
    sessionId: session.get("sessionId") || "",
    role: session.get("role") || "pengelola",
    deviceId: session.get("deviceId"),
    email: session.get("email"),
    phone: session.get("phone"),
    tokenType: session.get("tokenType"),
    registrationStatus: session.get("registrationStatus"),
    nextStep: session.get("nextStep"),
  };
}

// Require user session (for protected routes)
export async function requireUserSession(
  request: Request,
  role?: UserRole,
  requiredStatus?: RegistrationStatus
) {
  const userSession = await getUserSession(request);
  
  if (!userSession) {
    throw redirect("/");
  }

  // Check role if specified
  if (role && userSession.role !== role) {
    throw redirect("/");
  }

  // Check registration status if specified
  if (requiredStatus && userSession.registrationStatus !== requiredStatus) {
    // Redirect based on current status and role
    if (userSession.role === "pengelola") {
      switch (userSession.registrationStatus) {
        case "uncomplete":
          throw redirect("/authpengelola/completingcompanyprofile");
        case "awaiting_approval":
          throw redirect("/authpengelola/waitingapprovalfromadministrator");
        case "approved":
          throw redirect("/authpengelola/createanewpin");
        default:
          break;
      }
    }
  }

  return userSession;
}

// Logout user
export async function logout(request: Request) {
  const session = await getSession(request);
  
  try {
    // Call logout API
    await commonAuthService.logout();
  } catch (error) {
    // Continue logout even if API fails
    console.error("Logout API error:", error);
  }

  // Clear auth token
  commonAuthService.removeAuthToken();

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)

