import { NextResponse } from "next/server";
import { getSlots } from "@/lib/availability.ts";
import { getSalonData } from "@/lib/datocms.ts";
import { zodError } from "@/lib/http.ts";
import { availabilityQuerySchema } from "@/lib/schemas.ts";
import type { AvailabilityResponse } from "@/types/salon.ts";

export const dynamic = "force-dynamic";

/** GET /api/availability?date=2026-11-05&serviceId=skin-fade&staffId=marcus|any */
export async function GET(req: Request) {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = availabilityQuerySchema.safeParse(params);
  if (!parsed.success) return zodError(parsed.error);

  const data = await getSalonData();
  const service = data.services.find((s) => s.id === parsed.data.serviceId);
  if (!service) return NextResponse.json({ error: "Onbekende behandeling" }, { status: 404 });

  try {
    const slots = await getSlots(data, {
      date: parsed.data.date,
      durationMinutes: service.durationMinutes,
      staffId: parsed.data.staffId,
    });
    const body: AvailabilityResponse = { date: parsed.data.date, serviceDuration: service.durationMinutes, slots };
    return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 503 });
  }
}
