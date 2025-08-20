"use client";

import Image from "next/image";
import defaultAvatar from "@/public/images/avatar.png";

interface AvatarProps {
  src?: string;
  alt?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt = "User Avatar" }) => (
  <div className="relative">
    <Image
      src={src || defaultAvatar}
      alt={alt}
      width={36}
      height={36}
      className="rounded-full border-2 border-slate-600/50 hover:border-blue-400 transition-colors duration-200"
    />
    {/* Active dot indicator */}
    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-slate-800 rounded-full" />
  </div>
);
