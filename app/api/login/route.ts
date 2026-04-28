// app/api/login/route.ts
import { NextResponse } from "next/server";

const HONO_URL = process.env.HONO_URL || "http://localhost:3001";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Kirim sebagai "email" ke Hono (bukan userId)
    const res = await fetch(`${HONO_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.userId ?? body.email,
        password: body.password,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.status) {
      return NextResponse.json(data, { status: res.status });
    }

    const response = NextResponse.json(data, { status: 200 });

    const cookieOptions = {
      path: "/",
      httpOnly: false,
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 8,
    };

    response.cookies.set("user_id", String(data.data.id), cookieOptions);
    response.cookies.set("role", String(data.data.role_id), cookieOptions);
    response.cookies.set("name", String(data.data.name), cookieOptions);

    return response;
  } catch {
    return NextResponse.json(
      { status: false, message: "Backend not reachable." },
      { status: 500 }
    );
  }
}
