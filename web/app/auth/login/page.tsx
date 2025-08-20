"use client";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <LoginForm />
      <footer className="absolute bottom-4 text-xs text-gray-300">
        Developed by{" "}
        <a href="#" className="hover:text-white">
          Mohit Mehto 🤍
        </a>
      </footer>
    </main>
  );
}
