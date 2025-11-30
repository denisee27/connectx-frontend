import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../../assets/logo/main-logo-white.png";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { forgotPasswordSchema } from "../utils/validation";
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { mutate: performForgotPassword, isPending, error } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data) => {
    performForgotPassword(data);
  };

  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (error) {
      setServerError(error.message);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-2">
      <div className="border border-secondary w-full md:w-3/5 lg:w-2/5 rounded-lg bg-white p-4 md:p-6 lg:p-10 flex flex-col">
        <img src={logo} alt="ConnectX" className="h-10 sm:h-22 mx-auto" />
        <p className="text-center opacity-50 mb-4 text-xs">Reset your password now</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col"
        >
          {serverError && (
            <p className="mb-4 text-center text-sm w-full text-red-600">{serverError}</p>
          )}
          <label className="block text-sm md:text-[18px] font-medium black lg:text-lg xl:text-xl justify-center text-center mt-3">
            Please enter Your Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="mt-3 mb-2 h-10 xl:h-12 block w-full rounded-md border-gray-400 border-[1px] focus:ring-primary focus:border-primary outline-none transition-all ps-2 text-center"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 text-center mb-2">{errors.email.message}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-7 rounded-md bg-primary-color px-4 py-2 text-white cursor-pointer hover:bg-secondary bg-primary font-semibold hover:bg-primary-dark-color disabled:opacity-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color"
          >
            {isPending ? "Sending Data..." : "Submit"}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => navigate("/login")}
            className="w-full mt-4 rounded-md px-4 py-2 text-primary cursor-pointer hover:bg-secondary hover:text-white bg-white border border-primary font-semibold hover:bg-primary-dark-color disabled:opacity-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color"
          >
            {isPending ? "Waiting for response..." : "Back to login"}
          </button>
        </form>
      </div>
    </div>
  );
}