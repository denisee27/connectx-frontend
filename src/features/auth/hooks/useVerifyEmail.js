

import logger from "../../../core/utils/logger";
import useUIStore from "../../../core/stores/uiStore";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";

export const useVerifyEmail = () => {
    const showSuccess = useUIStore((state) => state.showSuccess);
    const showError = useUIStore((state) => state.showError);

    return useMutation({
        mutationFn: authApi.verifyEmail,
        onSuccess: (data) => {
            const { message } = data;
            showSuccess(message);
        },
        onError: (error) => {
            logger.warn("Verify Email failed", error);
            logger.info("error", error);
            showError(error.message || "Verify Email failed. Please try again");
        },
    });
};