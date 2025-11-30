

import logger from "../../../core/utils/logger";
import useUIStore from "../../../core/stores/uiStore";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import { useNavigate } from "react-router-dom";

export const useVerifyEmail = () => {
    const showSuccess = useUIStore((state) => state.showSuccess);
    const showError = useUIStore((state) => state.showError);

    return useMutation({
        mutationFn: authApi.verifyEmail,
        onSuccess: (data) => {
            const { message } = data;
            showSuccess('Your email has been verified successfully.');
        },
        onError: (error) => {
            logger.warn("Verify Email failed", error);
            logger.info("error", error);
            showError(error.message || "Verify Email failed. Please try again");
        },
    });
};

export const useRequestEmailVerification = () => {
    const navigate = useNavigate();
    const showSuccess = useUIStore((state) => state.showSuccess);
    const showError = useUIStore((state) => state.showError);
    return useMutation({
        mutationFn: authApi.requestEmailVerification,
        onSuccess: (data) => {
            navigate('/login');
            showSuccess('Please check your email to verify your account.');
        },
        onError: (error) => {
            logger.warn("Request Email Verification failed", error);
            logger.info("error", error);
            showError(error.message || "Request Email Verification failed. Please try again");
        },
    });
}