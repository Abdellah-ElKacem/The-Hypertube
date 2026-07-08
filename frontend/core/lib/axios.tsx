import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { setCookie, deleteCookie, getCookie } from "@/core/lib/cookies";

// Extend config to carry a _retry flag to prevent infinite refresh loops
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: false, // tokens are stored in cookies (managed client-side)
});

// ── Request interceptor ────────────────────────────────────────────────────
// Attach the stored access token to every outgoing request
api.interceptors.request.use((config) => {
  const token = getCookie("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ───────────────────────────────────────────────────
// On 401, attempt a silent token refresh then replay the original request.
// The backend expects { refreshToken } in the POST /auth/refresh body.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    const url = originalRequest?.url ?? "";
    const isAuthRoute =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/forgot-password") ||
      url.includes("/auth/reset-password") ||
      url.includes("/auth/verify-email") ||
      url.includes("/auth/resend-otp");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;
      try {
        const storedRefresh = getCookie("refresh_token");
        if (!storedRefresh) throw new Error("No refresh token");

        const { data } = await api.post<{
          success: boolean;
          accessToken: string;
          refreshToken: string;
        }>("/auth/refresh", { refreshToken: storedRefresh });

        setCookie("access_token", data.accessToken);
        setCookie("refresh_token", data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;