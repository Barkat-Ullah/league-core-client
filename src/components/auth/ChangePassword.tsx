/* eslint-disable react-hooks/incompatible-library */
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { useResetPasswordMutation } from "@/redux/apiHooks/auth/authApi";
import { alertError, alertSuccess } from "@/lib/confirm";

type ChangePasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailParam = searchParams.get("email");
  const email = emailParam ? decodeURIComponent(emailParam) : "";

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const newPasswordValue = watch("newPassword");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (values: ChangePasswordForm) => {
    try {
      if (!email) {
        await alertError("Missing email", "Email not found in the URL.");
        return;
      }

      // ✅ Your backend expects: { email, password }
      await resetPassword({
        email,
        password: values.newPassword,
      }).unwrap();

      await alertSuccess(
        "Password changed",
        "You can now sign in with your new password.",
      );
      router.push("/auth/signin");
    } catch (e) {
      console.error(e);
      await alertError("Change failed", "Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <Image
            src="/auth.png"
            alt="Change Password"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#201B1A] p-5 sm:p-8 rounded-3xl">
          {/* Go to Home - top */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-4 sm:mb-6 text-gray-300 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Go to Home
          </Link>

          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3">
            Change Password
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-10">
            Create your new password so you can access your account again.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 sm:space-y-6"
          >
            {/* New Password */}
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter Your New Password"
                  disabled={isLoading}
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 sm:px-4 py-2.5 sm:py-4 pr-11 focus:outline-none focus:border-[#CCFF00] transition placeholder-gray-600 disabled:opacity-60"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#CCFF00] transition"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword?.message && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 sm:mt-2">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter Your Confirm Password"
                  disabled={isLoading}
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 sm:px-4 py-2.5 sm:py-4 pr-11 focus:outline-none focus:border-[#CCFF00] transition placeholder-gray-600 disabled:opacity-60"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (v) =>
                      v === newPasswordValue || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#CCFF00] transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword?.message && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 sm:mt-2">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#CCFF00] text-black font-bold py-2.5 sm:py-3 rounded hover:bg-[#B8E600] transition text-base sm:text-lg disabled:opacity-60"
            >
              {isLoading ? "Updating..." : "Done"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <div>
              <Link
                href="/auth/signin"
                className="text-gray-400 text-sm hover:text-[#CCFF00] transition"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
