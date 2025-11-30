import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import useUIStore from "../../../core/stores/uiStore";
import logger from "../../../core/utils/logger";

export const useResetPassword = () => {
    const navigate = useNavigate();
    const showSuccess = useUIStore((state) => state.showSuccess);
    const showError = useUIStore((state) => state.showError);

    return useMutation({
        mutationFn: authApi.resetPassword,
        onSuccess: (data) => {
            const message =
                data?.message ||
                data?.data?.message ||
                "Your password has been reset successfully. You can now log in.";
            showSuccess(message);
            logger.info("Password reset successful, redirecting to login");
            navigate("/login", { replace: true });
        },
        onError: (error) => {
            logger.warn("Password reset failed", error);
            showError(error?.message || "Password reset failed. Please try again.");
        },
    });
};