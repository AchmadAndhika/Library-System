// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ status: true });

  // Hapus semua cookie
  response.cookies.set("user_id", "", { path: "/", maxAge: 0 });
  response.cookies.set("role", "", { path: "/", maxAge: 0 });
  response.cookies.set("name", "", { path: "/", maxAge: 0 });

  return response;
}
