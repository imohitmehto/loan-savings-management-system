"Use Client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/images/logo.png";
import { loginSchema } from "@/validators/loginSchema";
import InputField from "@/components/auth/InputField";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { z } from "zod";

export default function LoginForm() {
  const router = useRouter();
  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setServerError("");

    try {
      if (!data.userName || !data.password) {
        setServerError("Username and password are required");
        return;
      }

      const res = await signIn("credentials", {
        redirect: false,
        userName: data.userName,
        password: data.password,
        rememberMe,
        callbackUrl: "/home",
      });

      if (res?.error) {
        console.error("Login failed:", res.error);
        setServerError("Invalid username or password.");
        return;
      }

      const redirectUrl = res?.url || "/home";
      router.push(redirectUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative w-full max-w-sm bg-white/20 backdrop-blur-lg border-2 border-white/50 rounded-xl px-8 pt-14 pb-6 shadow-xl text-white"
    >
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-lg bg-white">
        <Image src={Logo} alt="Logo" fill className="object-contain" />
      </div>

      <h2 className="text-xl font-semibold text-center mb-6">Sign In</h2>

      <InputField
        label="Username"
        placeholder="Enter your Username"
        type="text"
        icon="user"
        error={errors.userName?.message}
        {...register("userName")}
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
        <Link
          href="/auth/forgot-password"
          className="text-black hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-900 hover:bg-blue-700 text-white py-2 rounded transition font-semibold tracking-wide"
      >
        {loading ? "Logging in..." : "LOGIN"}
      </button>
    </form>
  );
}
