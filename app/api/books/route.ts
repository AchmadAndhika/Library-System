// app/api/books/route.ts
// Next.js API Route — proxy ke backend Hono

const HONO_URL = process.env.HONO_URL || "http://localhost:3001";

export async function GET() {
  try {
    const res = await fetch(`${HONO_URL}/api/books`);
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json(
      { status: false, message: "Backend not reachable", data: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const res = await fetch(`${HONO_URL}/books/action`, {
      method: "POST",
      body: formData,
    });
    // Hono redirect setelah action, kita return success
    return Response.json({ status: true, message: "Book saved" });
  } catch {
    return Response.json(
      { status: false, message: "Backend not reachable" },
      { status: 500 }
    );
  }
}
