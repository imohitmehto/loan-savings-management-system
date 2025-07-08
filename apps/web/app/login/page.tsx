"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validators/loginSchema";
import { LoginInput } from "@/types/auth";
import { useState } from "react";
import Image from "next/image";
import Logo from "@/public/images/logo.jpg";
import InputField from "@/components/form/InputField";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

 const onSubmit = async (data: LoginInput) => {
  setLoading(true);
  setServerError("");

  try {
    const res = await api.post("/auth/login", data);

    const token = res.data.accessToken;
    if (!token) throw new Error("Token not returned");

    if (rememberMe) {
      localStorage.setItem("accessToken", token);
    } else {
      sessionStorage.setItem("accessToken", token);
    }

    router.push("/home");
  } catch (err: any) {
    setServerError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <main
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Glass Box */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full max-w-sm bg-white/20 backdrop-blur-lg border-2 border-white/50 rounded-xl px-8 pt-14 pb-6 shadow-xl text-white"
      >
        {/* Avatar */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-lg bg-white">
          <Image src={Logo} alt="Logo" layout="fill" objectFit="contain" />
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">Sign In</h2>

        <InputField
          label="Email ID"
          placeholder="Enter your email"
          type="email"
          icon="user"
          error={errors.email?.message}
          {...register("email")}
        />

        <InputField
          label="Password"
          placeholder="Enter your password"
          type="password"
          icon="lock"
          error={errors.password?.message}
          {...register("password")}
        />

        {serverError && (
          <p className="text-red-400 text-sm mt-2 text-center">{serverError}</p>
        )}

        <div className="flex justify-between items-center text-sm mb-4 text-black">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <span>Remember me</span>
          </label>
          <a href="#" className="hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-900 hover:bg-blue-700 text-white py-2 rounded transition font-semibold tracking-wide"
          disabled={loading}
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>
      </form>

      <footer className="absolute bottom-4 text-xs text-gray-300">
        Developed by{" "}
        <a href="#" className="hover:text-white">
          Mohit Mehto 🤍
        </a>
      </footer>
    </main>
  );
}
