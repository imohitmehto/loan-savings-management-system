import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res = await axios.post(`${process.env.API_URL}/auth/login`, body);
    const token = res.data.access_token;

    const response = NextResponse.json({ success: true });

    // Set HttpOnly secure cookie
    response.cookies.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.response?.data?.message || "Login failed" },
      { status: 401 },
    );
  }
}
