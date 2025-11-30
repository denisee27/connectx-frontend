import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { loginSchema } from "../utils/validation";
import { useLogin } from "../hooks/useLogin";

export function LoginModal({ isOpen, onClose, onSuccess }) {
  const { mutate: performLogin, isPending } = useLogin();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    performLogin(data, {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (err) => {
        setServerError(err.message || "An unexpected error occurred.");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">

        <div className="p-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Sign In</h2>
          <p className="text-center text-gray-600 mb-6 text-sm">
            Please login to view your personalized event recommendations.
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
              <p className="mb-4 text-center text-sm text-red-600">{serverError}</p>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                {...register("email")}
                type="text"
                placeholder="Enter your email"
                className="px-3 py-2 mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary focus:ring-primary outline-none transition-all"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className="px-3 py-2 mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary focus:ring-primary outline-none transition-all"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-white font-semibold cursor-pointer hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 shadow-md"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="w-full rounded-lg border border-primary px-4 py-2.5 text-primary cursor-pointer mt-2 font-semibold hover:bg-secondary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 shadow-md"
            >
              {isPending ? "Wait a moment..." : "Cancel"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
