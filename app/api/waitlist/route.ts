import { joinWaitlist } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    // fall through to validation error below
  }

  const result = joinWaitlist(body?.email);
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
