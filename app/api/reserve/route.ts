import { reservePiece } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { name?: unknown; email?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    // fall through to validation error below
  }

  const result = reservePiece(body?.name, body?.email);
  const status = result.ok ? 200 : result.code === "soldout" ? 409 : 400;
  return Response.json(result, { status });
}
