/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLoginMutation } from "@/redux/apiHooks/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import Cookies from "js-cookie";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

type FormData = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("Logging in...");

    try {
      const response = await login(data).unwrap();

      const token = response?.data?.token ?? null;
      const user = response?.data ?? null;
      const role = response?.data?.role;

      if (token) Cookies.set("token", token);
      if (role) Cookies.set("role", role, { path: "/" });

      dispatch(setUser({ user, token }));

      let redirectUrl = "";

      switch (role) {
        case "ADMIN":
          redirectUrl = "/dashboard/admin";
          break;
        case "PLAYER":
          redirectUrl = "/dashboard/player";
          break;
        case "COACH":
          redirectUrl = "/";
          break;
        case "MANAGER":
          redirectUrl = "/";
          break;
        default:
          toast.error("Invalid role!", { id: toastId });
          return;
      }

      toast.success(response.message || "Login successful", {
        id: toastId,
      });

      router.push(redirectUrl);
    } catch (error: any) {
      if (error?.status === 403) {
        const message = error?.data?.message;

        if (message?.includes("Email not verified")) {
          toast.error("Email not verified. Please verify your email.", {
            id: toastId,
          });

          router.push(`/auth/verification?email=${data.email}`);
          return;
        }
      }

      toast.error(error?.data?.message || "Login failed", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <Image
            src="/auth.png"
            alt="Soccer Player"
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
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-10">
            Welcome back! Continue register tournament and manage everything
            properly.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 sm:space-y-6"
          >
            {/* Email */}
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Your Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 sm:px-4 py-2.5 sm:py-4 focus:outline-none focus:border-[#CCFF00] transition placeholder-gray-600"
              />
              {errors.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 sm:px-4 py-2.5 sm:py-4 pr-11 focus:outline-none focus:border-[#CCFF00] transition placeholder-gray-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#CCFF00] transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-gray-400 text-sm hover:text-[#CCFF00] transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#CCFF00] text-black font-bold py-2.5 sm:py-3 rounded hover:bg-[#B8E600] transition text-base sm:text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Bottom Links */}
          <div className="mt-8 text-center space-y-4">
            <div>
              <span className="text-gray-400">
                Don&apos;t have any account?{" "}
              </span>
              <Link
                href="/auth/signup"
                className="text-[#CCFF00] font-semibold hover:text-[#B8E600] transition"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
