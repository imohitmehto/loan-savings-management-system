'use client';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <main
      className="w-screen h-screen overflow-hidden m-0 p-0 flex flex-col justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <ForgotPasswordForm />
      <footer className="absolute bottom-4 text-xs text-gray-300">
        Developed by{' '}
        <a href="#" className="hover:text-white">
          Mohit Mehto 🤍
        </a>
      </footer>
    </main>
  );
}
