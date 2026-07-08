import api from "@/core/lib/axios";
import { setCookie, deleteCookie, getCookie } from "@/core/lib/cookies";

// ── Types ─────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string; // backend login uses username, not email
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

// ── Token helpers ─────────────────────────────────────────────────────────

export const saveTokens = (tokens: AuthTokens) => {
  setCookie("access_token", tokens.accessToken);
  setCookie("refresh_token", tokens.refreshToken);
};

export const clearTokens = () => {
  deleteCookie("access_token");
  deleteCookie("refresh_token");
};

export const getAccessToken = () => getCookie("access_token");

export const 
isAuthenticated = () => !!getAccessToken();

// ── Auth API calls ────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Returns success message, then sends an OTP to the user's email.
 */
export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post<{ success: boolean; message: string }>(
    "/auth/register",
    payload,
  );
  return data;
};

/**
 * POST /api/auth/login
 * Stores both accessToken and refreshToken in cookies on success.
 */
export const login = async (payload: LoginPayload) => {
  const { data } = await api.post<
    { success: boolean } & AuthTokens
  >("/auth/login", payload);

  saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
};

/**
 * POST /api/auth/logout
 * Clears local tokens regardless of server response.
 */
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    clearTokens();
  }
};

/**
 * POST /api/auth/verify-email
 */
export const verifyEmail = async (payload: VerifyEmailPayload) => {
  const { data } = await api.post<{ success: boolean; message: string }>(
    "/auth/verify-email",
    payload,
  );
  return data;
};

/**
 * POST /api/auth/resend-otp
 */
export const resendOtp = async (email: string) => {
  const { data } = await api.post<{ success: boolean; message: string }>(
    "/auth/resend-otp",
    { email },
  );
  return data;
};

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const { data } = await api.post<{ success: boolean; message: string }>(
    "/auth/forgot-password",
    payload,
  );
  return data;
};

/**
 * POST /api/auth/reset-password/:token
 */
export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await api.post<{ success: boolean; message: string }>(
    `/auth/reset-password/${payload.token}`,
    { newPassword: payload.newPassword },
  );
  return data;
};

/**
 * OAuth redirect URLs (browser redirect, not axios)
 */
export const oauthRedirect = {
  google: (redirectTo?: string) => {
    if (redirectTo) {
      setCookie("oauth_redirect_to", redirectTo);
    } else {
      deleteCookie("oauth_redirect_to");
    }
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  },
  fortyTwo: (redirectTo?: string) => {
    if (redirectTo) {
      setCookie("oauth_redirect_to", redirectTo);
    } else {
      deleteCookie("oauth_redirect_to");
    }
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/42`;
  },
};

/**
 * Extract OAuth tokens from URL query params (called on the callback landing page).
 * Backend redirects to: /?token=ACCESS&refreshToken=REFRESH
 * Note: This is now handled automatically by AuthProvider on mount.
 */
export const handleOAuthCallback = (): boolean => {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const refreshToken = params.get("refreshToken");

  if (token && refreshToken) {
    saveTokens({ accessToken: token, refreshToken });
    // Clean up URL
    window.history.replaceState({}, "", window.location.pathname);
    return true;
  }
  return false;
};
