import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuthStore } from "../stores/authStore";
import { useUIStore } from "../../../core/stores/uiStore";
import logger from "../../../core/utils/logger";
import { use } from "react";

export const useForgotPassword = () => {
    const navigate = useNavigate();
    const showSuccess = useUIStore((state) => state.showSuccess);
    const showError = useUIStore((state) => state.showError);

    return useMutation({
        mutationFn: authApi.forgotPassword,
        onSuccess: (data) => {
            const { message } = data;
            showSuccess("Password reset email sent. Please check your inbox.");
            navigate("/login", { replace: true });
        },
        onError: (error) => {
            logger.warn("Forgot password failed", error);
            showError(error.message || "Forgot password failed. Please try again.");
        },
    });
};