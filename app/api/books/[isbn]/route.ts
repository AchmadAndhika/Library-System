// app/api/books/[isbn]/route.ts

const HONO_URL = process.env.HONO_URL || "http://localhost:3001";

export async function GET(
  _request: Request,
  { params }: { params: { isbn: string } }
) {
  try {
    const res = await fetch(`${HONO_URL}/api/books/${params.isbn}`);
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json(
      { status: false, message: "Backend not reachable", data: null },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { isbn: string } }
) {
  try {
    await fetch(`${HONO_URL}/books/delete/${params.isbn}`);
    return Response.json({ status: true, message: "Book deleted" });
  } catch {
    return Response.json(
      { status: false, message: "Backend not reachable" },
      { status: 500 }
    );
  }
}
