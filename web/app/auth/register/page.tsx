"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegistrationInput,
  registrationSchema,
} from "@/validators/registerSchema";
import InputField from "@/components/auth/InputField";
import Image from "next/image";
import Logo from "@/public/images/logo.jpg";
import { useRouter } from "next/navigation";
import api from "@/lib/api/axiosInstance";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationInput) => {
    setLoading(true);
    setServerError("");

    try {
      const payload = {
        ...data,
        phone: data.phone.startsWith("+91") ? data.phone : `+91${data.phone}`,
      };

      const res = await api.post("/auth/register", payload);

      if (res.status === 200) {
        router.push("/verify-otp");
      } else {
        throw new Error(res.data?.message || "Something went wrong");
      }
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        setServerError(
          err.response?.data?.message || err.message || "Something went wrong",
        );
      } else if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Something went wrong");
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full max-w-sm bg-white/20 backdrop-blur-lg border-2 border-white/50 rounded-xl px-8 pt-14 pb-6 shadow-xl text-white"
      >
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-lg bg-white">
          <Image src={Logo} alt="Logo" layout="fill" objectFit="contain" />
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">Sign Up</h2>

        <InputField
          label="Full Name"
          placeholder="Enter your name"
          type="text"
          icon="user"
          error={errors.name?.message}
          {...register("name")}
        />

        <InputField
          label="Email ID"
          placeholder="Enter your email"
          type="email"
          icon="envelope"
          error={errors.email?.message}
          {...register("email")}
        />

        <InputField
          label="Phone Number"
          placeholder="e.g. +919876543210"
          type="tel"
          icon="phone"
          error={errors.phone?.message}
          {...register("phone")}
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
          <p className="text-red-400 text-sm text-center">{serverError}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-900 hover:bg-blue-700 text-white py-2 rounded transition font-semibold tracking-wide mt-4"
          disabled={loading}
        >
          {loading ? "Registering..." : "REGISTER"}
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
