import { NextResponse } from "next/server";
import { getBooking } from "@/lib/store.ts";

export const dynamic = "force-dynamic";

/** GET /api/bookings/BK-12345 — status (gebruikt na Mollie-redirect) */
export async function GET(_req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const booking = getBooking(code);
  if (!booking) return NextResponse.json({ error: "Boeking niet gevonden" }, { status: 404 });
  return NextResponse.json({ bookingCode: booking.code, status: booking.status, booking });
}
