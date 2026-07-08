import api from "@/core/lib/axios";

// ── Types ─────────────────────────────────────────────────────────────────

export interface User {
  _id?: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatar: string | null;
  coverPicturePreference: string;
  oauthProvider?: string;
  isVerified?: boolean;
  qualityPreference?: string;
  subtitlePreference?: string;
}

export interface UpdateUserPayload {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string; // required only when changing email
  avatar?: string;
  coverPicturePreference?: string;
}

export interface UpdateVideoStreamingPayload {
  quality?: "2160p" | "1080p" | "720p" | "480p";
  subtitle?: "en" | "fr" | "es" | "ar" | "de" | "it" | "pt" | "ru" | "zh" | "ja" | "ko" | "nl";
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

// ── Users API calls ───────────────────────────────────────────────────────

/**
 * GET /api/users/me
 * Returns the authenticated user's profile.
 */
export const getMe = async () => {
  const { data } = await api.get<{ success: boolean; user: User }>("/users/me");
  return data.user;
};

/**
 * GET /api/users/:id
 * Returns a public user profile by ID.
 */
export const getUserById = async (id: string) => {
  const { data } = await api.get<{ success: boolean; user: User }>(
    `/users/${id}`,
  );
  return data.user;
};

export const getUserByUsername = async (username: string) => {
  const { data } = await api.get<{ success: boolean; user: { email: string } }>(
    `/users/username/${username}`,
  );
  return data.user.email;
};

/**
 * GET /api/users
 * Returns all users (requires auth).
 */
export const getAllUsers = async () => {
  const { data } = await api.get<User[]>("/users");
  return data;
};

/**
 * PATCH /api/users/update
 * Updates the authenticated user's profile. Supports avatar file upload.
 */
export const updateUser = async (
  payload: UpdateUserPayload,
  avatarFile?: File,
) => {
  const form = new FormData();

  if (payload.username) form.append("username", payload.username);
  if (payload.firstName) form.append("firstName", payload.firstName);
  if (payload.lastName) form.append("lastName", payload.lastName);
  if (payload.email) form.append("email", payload.email);
  if (payload.currentPassword)
    form.append("currentPassword", payload.currentPassword);
  if (avatarFile) {
    form.append("avatar", avatarFile);
  } else if (payload.avatar) {
    form.append("avatar", payload.avatar);
  }

  const { data } = await api.patch<{ success: boolean; user: User }>(
    "/users/update",
    form
  );
  return data.user;
};

/**
 * PATCH /api/users/updateVideoStreaming
 * Updates the authenticated user's video streaming preferences.
 */
export const updateVideoStreaming = async (
  payload: UpdateVideoStreamingPayload,
) => {
  const { data } = await api.patch<{ success: boolean; message: string }>(
    "/users/updateVideoStreaming",
    payload,
  );
  return data;
};

/**
 * PATCH /api/users/updatePassword
 */
export const updatePassword = async (payload: UpdatePasswordPayload) => {
  const { data } = await api.patch<{ success: boolean; message: string }>(
    "/users/updatePassword",
    payload,
  );
  return data;
};
