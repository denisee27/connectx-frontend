import axios from "axios";
import api from "../../../core/api/index.js";
import { env } from "../../../core/config/env.js";
import { useAuthStore } from "../stores/authStore.js";
import { logger } from "../../../core/utils/logger.js";
import { email } from "zod";

/**
 * Auth API module
 *
 * Exposes typed wrappers around the shared API client so features
 * don't have to reach into axios directly.
 */

/**
 * Login user with credentials
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<{ user: object, accessToken: string }>}
 */
export const loginUser = async (credentials) => {
  logger.info("Attempting login", { email: credentials.email });
  const data = await api.post("/auth/login", credentials);
  return data;
};

/**
 * Logout current user
 * @returns {Promise<{ success: boolean }>}
 */
export const logoutUser = async () => {
  logger.info("Performing logout");
  return api.post("/auth/logout");
};

export const forgotPassword = async (email) => {
  logger.info("Attempting forgot password", email);
  const data = await api.post("/auth/forgot-password", email);
  return data;
};

/**
 * Get current user profile/session restore
 * @returns {Promise<object>}
 */
export const getMe = async () => {
  logger.info("Fetching current user profile");
  return api.get("/auth/me");
};

/**
 * Register new user
 */
export const registerUser = async (credentials) => {
  logger.info("Attempting registration", { email: credentials.email });
  const data = await api.post("/auth/register", credentials);
  logger.warn("information data", data);
  return data;
};

/**
 * Reset password using token and new credentials
 * @param {{ token: string, password: string, confirmPassword?: string }} payload
 * @returns {Promise<{ message?: string }>}
 */
export const resetPassword = async (payload) => {
  const { token, password, confirmPassword } = payload;
  logger.info("Attempting password reset", { hasToken: Boolean(token) });
  if (!token) {
    throw new Error("Reset token is required.");
  }

  const data = await api.post("/auth/reset-password", { token, password, confirmPassword });
  return data;
};

/**
 * Refresh access token.
 * Uses a bare axios instance to avoid recursive interceptor execution.
 * @returns {Promise<{ user: object, accessToken: string }>}
 */
export const refreshToken = async () => {
  const accessToken = useAuthStore.getState().accessToken;

  const response = await axios.post(
    `${env.VITE_API_BASE_URL}/auth/refresh`,
    {},
    {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      withCredentials: true,
    }
  );

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.error || "Failed to refresh token");
};


export const verifyEmail = async (payload) => {
  const token = payload?.token;
  logger.info("Attempting verify email", { hasToken: Boolean(token) });
  if (!token) {
    throw new Error("Verification token is required.");
  }
  const data = await api.post("/auth/email/verify", { token });
  return data;
};

export const requestEmailVerification = async (email) => {
  console.log('email', email)
  logger.info("Attempting request email verification", email);
  const data = await api.post("/auth/email/request", email);
  return data;
};

/**
 * Convenience export for future service composition.
 */
export const authApi = {
  login: loginUser,
  logout: logoutUser,
  getMe,
  forgotPassword: forgotPassword,
  refresh: refreshToken,
  register: registerUser,
  resetPassword: resetPassword,
  verifyEmail: verifyEmail,
  requestEmailVerification: requestEmailVerification,
};
