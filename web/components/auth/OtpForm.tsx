"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/images/logo.jpg";
import { otpSchema, OTPInput } from "@/validators/otpSchema";
import { ZodError } from "zod";

export default function OtpForm() {
  const router = useRouter();

  // 6 input refs
  const inputsRef = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // For react-hook-form, combine otp string to validate
  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<OTPInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
    mode: "onTouched",
  });

  // On each input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // allow only numbers
    if (val.length > 1) return; // Only allow single character

    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);

    clearErrors("otp");

    // Move to next input if value entered
    if (val && idx < 5) {
      inputsRef[idx + 1].current?.focus();
    }
  };

  // On keydown: handle backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
  ) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      // Go back to previous input
      inputsRef[idx - 1].current?.focus();
    }
  };

  // On paste: allow user to paste entire OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const data = e.clipboardData.getData("Text").replace(/\D/g, "");
    if (data.length === 6) {
      setOtp(data.split(""));
      // Focus last box
      setTimeout(() => inputsRef[5].current?.focus(), 10);
    }
    e.preventDefault();
  };

  // Submit
  const onSubmit = async () => {
    const otpValue = otp.join("");
    // Validate using Zod
    try {
      otpSchema.parse({ otp: otpValue });
    } catch (e: unknown) {
      if (
        typeof e === "object" &&
        e !== null &&
        "errors" in e &&
        Array.isArray((e as import("zod").ZodError).errors)
      ) {
        setError("otp", {
          message:
            (e as import("zod").ZodError).errors?.[0]?.message || "Invalid OTP",
        });
      } else {
        setError("otp", { message: "Invalid OTP" });
      }
      return;
    }

    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpValue }),
      });
      const result = await res.json();

      if (!res.ok || result.error) {
        throw new Error(result.error || "Invalid OTP");
      }
      router.push("/home");
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
        OTP Verification
      </h2>
      <p className="mb-4 text-center text-gray-100 text-sm">
        Enter the 6-digit OTP sent to your email or mobile.
      </p>

      <div className="flex justify-center gap-2 mb-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <input
            key={idx}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            ref={inputsRef[idx]}
            value={otp[idx]}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            className="w-10 h-12 text-center text-lg rounded border focus:outline-none focus:border-blue-700 text-black"
            autoFocus={idx === 0}
          />
        ))}
      </div>
      {errors.otp && (
        <p className="text-red-400 text-sm mt-2 text-center">
          {errors.otp.message}
        </p>
      )}
      {serverError && (
        <p className="text-red-400 text-sm mt-2 text-center">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-900 hover:bg-blue-700 text-white py-2 rounded transition font-semibold tracking-wide mt-4"
      >
        {loading ? "Verifying..." : "VERIFY OTP"}
      </button>

      {/* Back to Login" */}
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
      {/* Optionally: Resend OTP link */}
      <div className="mt-2 text-xs text-center text-black">
        Didn’t receive?{" "}
        <button
          type="button"
          className="text-blue-700 hover:underline ml-1"
          disabled={loading}
          // onClick={handleResendOtp}
        >
          Resend OTP
        </button>
      </div>
    </form>
  );
}
