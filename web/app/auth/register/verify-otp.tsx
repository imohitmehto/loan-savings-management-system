"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/images/logo.png";
import api from "@/lib/api/axiosInstance";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      setMessage(res.data.message);
      router.push("/auth/login");
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        setError(
          (err as { response: { data: { message: string } } }).response.data
            .message || "OTP verification failed",
        );
      } else {
        setError("OTP verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/auth/send-otp", { email });
      setMessage(res.data.message || "OTP sent successfully");
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        setError(
          (err as { response: { data: { message: string } } }).response.data
            .message || "Failed to resend OTP",
        );
      } else {
        setError("Failed to resend OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="relative w-full max-w-sm bg-white/20 backdrop-blur-lg border-2 border-white/50 rounded-xl px-8 pt-14 pb-6 shadow-xl text-white">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-lg bg-white">
          <Image src={Logo} alt="Logo" layout="fill" objectFit="contain" />
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 rounded-md border text-black focus:outline-none mb-4"
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-md border text-black focus:outline-none mb-4"
        />

        {error && (
          <p className="text-red-400 text-sm text-center mb-2">{error}</p>
        )}
        {message && (
          <p className="text-green-400 text-sm text-center mb-2">{message}</p>
        )}

        <button
          onClick={handleVerify}
          className="w-full bg-blue-900 hover:bg-blue-700 text-white py-2 rounded transition font-semibold tracking-wide"
          disabled={loading}
        >
          {loading ? "Verifying..." : "VERIFY OTP"}
        </button>

        <div className="text-center text-sm mt-4">
          Didn&apos;t receive OTP?{" "}
          <span
            onClick={handleResend}
            className="text-blue-300 hover:underline cursor-pointer"
          >
            Resend OTP
          </span>
        </div>
      </div>

      <footer className="absolute bottom-4 text-xs text-gray-300">
        Developed by{" "}
        <a href="#" className="hover:text-white">
          Mohit Mehto 🤍
        </a>
      </footer>
    </main>
  );
}
