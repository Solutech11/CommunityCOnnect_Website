import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ApiError, request } from "./api";
import type { Session, User } from "../types";

const REFRESH_KEY = "community-connect-refresh";
let accessToken: string | null = null;
let refreshInFlight: Promise<string> | null = null;

function savedRefreshToken() {
  return typeof window === "undefined" ? null : window.sessionStorage.getItem(REFRESH_KEY);
}

function rememberSession(session: Session) {
  // The access token stays in memory; a tab-scoped refresh token survives Paystack redirects.
  window.sessionStorage.setItem(REFRESH_KEY, session.refreshToken);
  accessToken = session.accessToken;
}

function clearSession() {
  accessToken = null;
  if (typeof window !== "undefined") window.sessionStorage.removeItem(REFRESH_KEY);
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = savedRefreshToken();
  if (!refreshToken) throw new ApiError("Please sign in to continue.", 401, "AUTH_REQUIRED");
  if (!refreshInFlight) {
    refreshInFlight = request<{ session: Session }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }).then(({ session }) => {
      rememberSession(session);
      return session.accessToken;
    }).catch((error) => {
      clearSession();
      throw error;
    }).finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
}

export async function protectedRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!accessToken) await refreshAccessToken();
  const requestedWith = accessToken;
  try {
    return await request<T>(path, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
    // Another request may already have rotated the refresh token.
    const token = accessToken && accessToken !== requestedWith ? accessToken : await refreshAccessToken();
    return request<T>(path, { ...init, headers: { ...init.headers, Authorization: `Bearer ${token}` } });
  }
}

type AuthContextValue = {
  user: User | null;
  restoring: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    if (!savedRefreshToken()) { setRestoring(false); return; }
    void protectedRequest<{ user: User }>("/users/me")
      .then((data) => setUser(data.user))
      .catch(() => clearSession())
      .finally(() => setRestoring(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    const data = await request<{ user: User; session: Session }>("/auth/login", {
      method: "POST", body: JSON.stringify({ email, password }),
    });
    rememberSession(data.session);
    setUser(data.user);
  };

  const verifyEmail = async (email: string, otp: string) => {
    const data = await request<{ user: User; session: Session }>("/auth/verify-email", {
      method: "POST", body: JSON.stringify({ email, otp }),
    });
    rememberSession(data.session);
    setUser(data.user);
  };

  const signOut = async () => {
    const refreshToken = savedRefreshToken();
    try {
      if (refreshToken) await protectedRequest("/auth/logout", {
        method: "POST", body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Local sign-out still completes when the network is unavailable.
    } finally {
      clearSession();
      setUser(null);
    }
  };

  return <AuthContext.Provider value={{ user, restoring, signIn, verifyEmail, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider is missing");
  return context;
}
