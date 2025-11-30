import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useLogin } from "../hooks/useLogin";
import imageDemo from "../../../assets/demo_page.webp";
import logger from "../../../core/utils/logger";
import { loginSchema } from "../utils/validation";

export default function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { mutate: performLogin, isPending, error } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data) => {
    performLogin(data, {
      onSuccess: () => {
        navigate("/home");
      },
      onError: (err) => {
        setServerError(err.message || "An unexpected error occurred.");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md ">
        <div className="border border-secondary shadow-lg rounded-2xl p-8">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">Welcome Back</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
              <p className="mb-4 text-center text-sm text-red-600">{serverError}</p>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                {...register("email")}
                type="text"
                placeholder="Masukkan email Anda"
                className="px-2 mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary-color"
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
                placeholder="Masukkan password Anda"
                className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary px-2"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-md bg-primary-color px-4 py-2 text-white cursor-pointer hover:bg-secondary bg-primary font-semibold hover:bg-primary-dark-color disabled:opacity-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => navigate("/")}
              className="w-full rounded-md mt-4 px-4 py-2 text-primary cursor-pointer hover:bg-secondary hover:text-white bg-white border border-primary font-semibold hover:bg-primary-dark-color disabled:opacity-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color"
            >
              {isPending ? "Waiting for response..." : "Back to home"}
            </button>
          </form>
          <div className="flex justify-between mt-4 text-sm">
            <div className="text-gray-900">
              Don't have an account? <Link to="/register" className="font-medium text-primary hover:text-secondary">Sign up</Link>
            </div>
            <Link to={"/forgot-password"} className="font-medium text-primary-color hover:text-primary-dark-color">
              Forgot Password
            </Link>
            {/* <Link to={"/"} className="font-medium text-primary-color hover:text-primary-dark-color">
              See how it works.
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
