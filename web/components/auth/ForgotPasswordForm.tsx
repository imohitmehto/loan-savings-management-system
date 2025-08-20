"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/images/logo.jpg";
import {
  ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/validators/forgotPasswordSchema";
import InputField from "@/components/auth/InputField";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true);
    setServerError("");
    setSuccess("");
    try {
      // Send both username and email to the API
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: data.userName, email: data.email }),
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || "Failed to send reset email");
      }
      setSuccess("If registered, we've sent a reset link to your email.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative w-full max-w-sm bg-white/20 backdrop-blur-lg border-2 border-white/50 rounded-xl px-8 pt-14 pb-6 shadow-xl text-white"
      autoComplete="off"
    >
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-lg bg-white">
        <Image src={Logo} alt="Logo" fill className="object-contain" />
      </div>

      <h2 className="text-xl font-semibold text-center mb-6">
        Forgot Password
      </h2>
      <p className="mb-4 text-center text-gray-100 text-sm">
        Enter your username and registered email to receive a reset link.
      </p>

      <InputField
        label="Username"
        placeholder="Enter your username"
        type="text"
        icon="user"
        error={errors.userName?.message}
        {...register("userName")}
      />

      <InputField
        label="Email"
        placeholder="Enter your email"
        type="email"
        icon="envelope"
        error={errors.email?.message}
        {...register("email")}
      />

      {serverError && (
        <p className="text-red-400 text-sm mt-2 text-center">{serverError}</p>
      )}
      {success && (
        <p className="text-green-400 text-sm mt-2 text-center">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-900 hover:bg-blue-700 text-white py-2 rounded transition font-semibold tracking-wide mt-4"
      >
        {loading ? "Sending..." : "SEND RESET LINK"}
      </button>

      <div className="mt-4 text-xs text-center text-black">
        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="text-blue-700 hover:underline"
          disabled={loading}
        >
          &larr; Back to Login
        </button>
      </div>
    </form>
  );
}
