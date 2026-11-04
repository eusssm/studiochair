import { NextResponse } from "next/server";
import { getWeekSummary } from "@/lib/availability.ts";
import { getSalonData } from "@/lib/datocms.ts";
import { zodError } from "@/lib/http.ts";
import { weekQuerySchema } from "@/lib/schemas.ts";

export const dynamic = "force-dynamic";

/** GET /api/availability/week?from=2026-11-03&days=7&serviceId=…&staffId=… → aantal vrije plekken per dag */
export async function GET(req: Request) {
  const parsed = weekQuerySchema.safeParse(Object.fromEntries(new URL(req.url).searchParams));
  if (!parsed.success) return zodError(parsed.error);

  const data = await getSalonData();
  const service = data.services.find((s) => s.id === parsed.data.serviceId);
  if (!service) return NextResponse.json({ error: "Onbekende behandeling" }, { status: 404 });

  try {
    const days = await getWeekSummary(data, { ...parsed.data, durationMinutes: service.durationMinutes });
    return NextResponse.json({ days }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 503 });
  }
}
