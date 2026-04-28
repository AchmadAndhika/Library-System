// app/api/borrows/route.ts

const HONO_URL = process.env.HONO_URL || "http://localhost:3001";

export async function GET() {
  try {
    const res = await fetch(`${HONO_URL}/api/borrows`);
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json(
      { status: false, message: "Backend not reachable", data: [] },
      { status: 500 }
    );
  }
}
