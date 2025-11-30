import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { authApi } from "../api";
import { useUIStore } from "../../../core/stores/uiStore";
import logger from "../../../core/utils/logger";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const showError = useUIStore((state) => state.showError);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const { user, accessToken } = data.data;
      if (localStorage.getItem("uid")) {
        localStorage.removeItem("uid");
      }
      setAuth({ user, accessToken });
    },
    onError: (error) => {
      logger.warn("Login failed", error);
      logger.info("error", error);
      showError(error.message || "Login failed. Please check your credentials.");
    },
  });
};
