import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useResetPassword } from "../hooks/useResetPassword";
import { resetPasswordSchema } from "../utils/validation";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
    const { token: tokenParam } = useParams();
    const [searchParams] = useSearchParams();
    const tokenFromQuery = searchParams.get("token");
    const resetToken = tokenParam || tokenFromQuery || "";

    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutate: performReset, isPending, error } = useResetPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values) => {
        if (!resetToken) {
            setServerError("Reset token is missing or invalid. Request a new link to continue.");
            return;
        }

        setServerError("");
        performReset({
            token: resetToken,
            password: values.password,
            confirmPassword: values.confirmPassword,
        });
    };

    useEffect(() => {
        if (error) {
            setServerError(
                error?.message || "Unable to reset password right now. Please try again shortly."
            );
        }
    }, [error]);

    const isTokenMissing = !resetToken;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
            <div className="border border-secondary w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">Reset Password</h2>
                <p className="mb-6 text-center text-sm text-gray-600">
                    Choose a strong password to secure your account.
                </p>

                {serverError && (
                    <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{serverError}</p>
                )}

                {isTokenMissing ? (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                            We couldn&apos;t find a valid reset link. It may have expired or been used already.
                        </p>
                        <Link
                            to="/forgot-password"
                            className="inline-flex w-full justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        >
                            Request a new reset link
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 mt-1 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <input
                                    {...register("confirmPassword")}
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="Re-enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 mt-1 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full rounded-md bg-primary px-4 py-2 text-sm cursor-pointer font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"
                        >
                            {isPending ? "Updating password..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm text-gray-600">
                    Remembered your password?{" "}
                    <Link to="/login" className="font-semibold cursor-pointer text-primary hover:text-secondary">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}