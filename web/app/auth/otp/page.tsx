'use client';

import OtpForm from '@/components/auth/OtpForm';

export default function OtpPage() {
  return (
    <main
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <OtpForm />
      <footer className="absolute bottom-4 text-xs text-gray-300">
        Developed by{' '}
        <a href="#" className="hover:text-white">
          Mohit Mehto 🤍
        </a>
      </footer>
    </main>
  );
}
