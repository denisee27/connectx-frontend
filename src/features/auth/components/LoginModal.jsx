import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "../hooks/useLogin";
import { X } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

function Modal({ open, onClose, children }) {
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 mx-auto w-full max-w-md rounded-t-2xl bg-card shadow-xl transition-transform duration-200 sm:inset-y-10 sm:bottom-auto sm:rounded-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const [serverError, setServerError] = useState("");
  const { mutateAsync: performLogin, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await performLogin(data);
      onSuccess();
    } catch (err) {
      setServerError(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="p-8">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">Welcome Back</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {serverError && <p className="mb-4 text-center text-sm text-red-600">{serverError}</p>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="px-2 mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary-color"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary px-2"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-primary-color px-4 py-2 text-white cursor-pointer hover:bg-secondary bg-primary font-semibold hover:bg-primary-dark-color disabled:opacity-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
