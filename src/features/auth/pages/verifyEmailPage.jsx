import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useRequestEmailVerification, useVerifyEmail } from "../hooks/useVerifyEmail.js";

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const { token: tokenParam } = useParams();
    const emailQuery = searchParams.get('email'); // Mengambil nilai dari &email=...
    const { mutateAsync: requestEmailVerification, isPending: isRequesting } = useRequestEmailVerification();
    const tokenFromQuery = searchParams.get("token");
    const verificationToken = tokenParam || tokenFromQuery || "";

    const [status, setStatus] = useState(verificationToken ? "pending" : "error");
    const [statusMessage, setStatusMessage] = useState(
        verificationToken
            ? "Verifying your email, please wait..."
            : "Verification link is invalid or missing. Request a new link to continue."
    );

    const { mutate: verifyEmail } = useVerifyEmail();

    useEffect(() => {
        if (!verificationToken) return;
        console.log('emailParam:', emailQuery)
        setStatus("pending");
        setStatusMessage("Verifying your email, please wait...");
        verifyEmail(
            { token: verificationToken },
            {
                onSuccess: (response) => {
                    const message =
                        response?.message ||
                        response?.data?.message ||
                        "Your email has been verified successfully.";
                    setStatus("success");
                    setStatusMessage(message);
                },
                onError: (error) => {
                    setStatus("error");
                    setStatusMessage(
                        error?.message || "We couldn't verify your email. Please request a new link."
                    );
                },
            }
        );
    }, [verificationToken, verifyEmail]);
    const handleRequestEmail = async () => {
        if (!emailQuery) {
            setStatusMessage("Email parameter is missing. Cannot request verification link.");
            return;
        }
        try {
            await requestEmailVerification(
                { email: emailQuery },
                {
                    onSuccess: (response) => {
                        const message =
                            response?.message ||
                            response?.data?.message ||
                            "Request verification link sent successfully. Please check your email.";
                        setStatus("success");
                        setStatusMessage(message);
                    },
                    onError: (error) => {
                        setStatus("error");
                        setStatusMessage(
                            error?.message || "Failed to send verification link. Please try again."
                        );
                    },
                }

            );
            setStatusMessage("Verification link sent successfully. Please check your email.");
        } catch (error) {
            setStatusMessage("Failed to send verification link. Please try again.");
        }
    }
    const isPending = status === "pending";
    const isSuccess = status === "success";
    const isError = status === "error";

    return (
        <div className="flex min-h-screen items-center justify-center bg-white p-6">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 text-center shadow-md">
                <h1 className="text-2xl font-bold text-gray-900">Email Verification</h1>
                <p className="text-sm text-gray-600">{statusMessage}</p>
                {isPending && (
                    <p className="text-xs uppercase tracking-wide text-gray-400">Processing...</p>
                )}
                {isSuccess && (
                    <div className="space-y-3">
                        <Link
                            to="/login"
                            className="inline-flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Go to login
                        </Link>
                    </div>
                )}
                {isError && (
                    <div className="space-y-3">
                        <button
                            disabled={isRequesting}
                            className="cursor-pointer inline-flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            onClick={() => handleRequestEmail()}>
                            {isRequesting ? "Requesting..." :
                                "Request new verification link"
                            }
                        </button>
                        <Link
                            disabled={isRequesting}
                            to="/login"
                            className="inline-flex w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        >
                            {isRequesting ? "Wait a moment..." :
                                "Back to login"
                            }
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}