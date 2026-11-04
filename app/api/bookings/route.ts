import { NextResponse } from "next/server";
import { BookingError, createBooking } from "@/lib/bookings.ts";
import { getSalonData } from "@/lib/datocms.ts";
import { siteUrl, zodError } from "@/lib/http.ts";
import { bookingRequestSchema } from "@/lib/schemas.ts";

export const dynamic = "force-dynamic";

/** POST /api/bookings — zie STUDIOCHAIR.md §5 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body moet JSON zijn" }, { status: 400 });
  }
  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  try {
    const data = await getSalonData();
    const result = await createBooking(
      { ...parsed.data, customer: { ...parsed.data.customer, notes: parsed.data.customer.notes || undefined } },
      data,
      siteUrl(req),
    );
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof BookingError) return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    console.error("[studiochair] Boeking mislukt:", err);
    return NextResponse.json({ error: "Er ging iets mis. Probeer het opnieuw of bel de salon." }, { status: 500 });
  }
}
