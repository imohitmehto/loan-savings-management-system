"Use Client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/images/logo.jpg";
import { loginSchema } from "@/utils/validators/loginSchema";
import { LoginInput } from "@/types/auth";
import InputField from "@/components/auth/InputField";
import { signIn, useSession } from "next-auth/react";

export default function LoginForm() {
  const router = useRouter();
  // useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setServerError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        userName: data.userName,
        password: data.password,
        rememberMe,
        callbackUrl: "/home",
      });

      if (res?.error) throw new Error(res.error);

      const redirectUrl = res?.url || "/home";
      router.push(redirectUrl);
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // function useRedirectIfAuthenticated() {
  //   const { data: session, status } = useSession();
  //   const router = useRouter();

  //   useEffect(() => {
  //     if (status === "authenticated") {
  //       router.push("/home");
  //     }
  //   }, [status]);
  // }

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
        <a href="#" className="hover:underline">
          Forgot Password?
        </a>
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
