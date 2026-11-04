import { NextResponse } from "next/server";
import { finalizeBooking } from "@/lib/bookings.ts";
import { getSalonData } from "@/lib/datocms.ts";
import { getPaymentStatus, mollieEnabled } from "@/lib/mollie.ts";
import { findBookingByPayment, saveBooking } from "@/lib/store.ts";

export const dynamic = "force-dynamic";

/**
 * Mollie stuurt `id=tr_xxx` (form-encoded). We halen de status zelf op —
 * de webhook-body is nooit te vertrouwen.
 */
export async function POST(req: Request) {
  if (!mollieEnabled()) return NextResponse.json({ ok: false }, { status: 404 });
  const form = await req.formData();
  const id = String(form.get("id") ?? "");
  if (!id) return NextResponse.json({ error: "id ontbreekt" }, { status: 400 });

  const booking = findBookingByPayment(id);
  if (!booking) return new NextResponse(null, { status: 200 }); // onbekend: negeren, wel 200

  const status = await getPaymentStatus(id);
  if (status === "paid" && booking.status !== "confirmed") {
    await finalizeBooking(booking, await getSalonData());
  } else if (["canceled", "expired", "failed"].includes(status)) {
    booking.status = status === "expired" ? "expired" : "cancelled";
    saveBooking(booking);
  }
  return new NextResponse(null, { status: 200 });
}
