import NextAuth from "next-auth";
import { nextAuthConfig } from "@/lib/auth/nextAuthConfig";

const handler = NextAuth(nextAuthConfig);

export const GET = handler;
export const POST = handler;
