import { getStats } from "@/lib/db";

// Always reflect live database state — never cache this response.
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(getStats());
}
