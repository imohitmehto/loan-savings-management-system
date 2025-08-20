"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";

// Mock user data (replace with fetch from server or props)
const initialUser = {
  avatar: "/images/avatar.png",
  name: "Deepak Soni",
  email: "deepak@example.com",
  bio: "Administrator",
};

export default function EditProfileForm() {
  const [form, setForm] = useState(initialUser);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  // Handle avatar upload
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setAvatarFile(e.target.files[0]);
      setForm((f) => ({
        ...f,
        avatar: URL.createObjectURL(e.target.files![0]),
      }));
    }
  }

  // Simulate update handler (replace with server mutation logic)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Example validation
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    // TODO: Replace this with your API PATCH/PUT call
    setTimeout(() => {
      setSuccess("Profile updated successfully!");
    }, 1000);
  }

  return (
    <form
      className="max-w-xl mx-auto bg-slate-800 rounded-xl shadow-md p-8 flex flex-col items-center gap-6"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <h3 className="text-2xl font-bold mb-2">Edit Profile</h3>
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-24 h-24">
          <Image
            src={form.avatar}
            alt="Avatar"
            fill
            className="rounded-full border-4 border-slate-700 object-cover"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleAvatarChange}
        />
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 rounded-full text-white font-semibold hover:bg-blue-700 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          Change Avatar
        </button>
      </div>
      {/* Name and Email */}
      <div className="w-full">
        <label className="block mb-1 font-medium text-slate-200">Name</label>
        <input
          className="w-full px-3 py-2 rounded bg-slate-900 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="w-full">
        <label className="block mb-1 font-medium text-slate-200">Email</label>
        <input
          className="w-full px-3 py-2 rounded bg-slate-900 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      {/* Bio */}
      <div className="w-full">
        <label className="block mb-1 font-medium text-slate-200">Bio</label>
        <textarea
          className="w-full px-3 py-2 rounded bg-slate-900 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="bio"
          value={form.bio}
          rows={3}
          onChange={handleChange}
        />
      </div>
      {/* Error / Success */}
      {error && <div className="w-full text-red-400 font-medium">{error}</div>}
      {success && (
        <div className="w-full text-green-400 font-medium">{success}</div>
      )}
      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2 mt-2 bg-green-600 rounded-lg hover:bg-green-700 text-white font-semibold transition"
      >
        Save Changes
      </button>
    </form>
  );
}
