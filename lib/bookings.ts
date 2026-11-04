/**
 * Boekingsflow (STUDIOCHAIR.md §5 POST /api/bookings):
 * valideren → slot opnieuw checken onder lock → (aanbetaling) → agenda + mail.
 */
import "server-only";
import { Resend } from "resend";
import BookingConfirmationEmail from "@/components/emails/BookingConfirmationEmail";
import type { Booking, BookingRequest, BookingResponse, SalonData } from "@/types/salon.ts";
import { getSlots } from "./availability.ts";
import { createIcs } from "./calendar.ts";
import { duration, euro, longDate } from "./format.ts";
import { googleEnabled, insertEvent } from "./google.ts";
import { createDepositPayment, mollieEnabled } from "./mollie.ts";
import { generateBookingCode, saveBooking, withLock } from "./store.ts";
import { zonedToUtc } from "./time.ts";

export class BookingError extends Error {
  constructor(message: string, public status = 400, public code = "booking_error") {
    super(message);
  }
}

const HOLD_MINUTES = 15;

export async function createBooking(req: BookingRequest, data: SalonData, siteUrl: string): Promise<BookingResponse> {
  const service = data.services.find((s) => s.id === req.serviceId);
  if (!service) throw new BookingError("Onbekende behandeling", 404, "unknown_service");
  const staff = data.staff.find((s) => s.id === req.staffId && s.isActive);
  if (!staff) throw new BookingError("Deze kapper is niet beschikbaar", 404, "unknown_staff");

  return withLock(`${staff.id}:${req.date}`, async () => {
    // Race-condition check: is dit slot nog steeds vrij?
    const slots = await getSlots(data, { date: req.date, durationMinutes: service.durationMinutes, staffId: staff.id });
    if (!slots.some((s) => s.time === req.time)) {
      throw new BookingError("Te laat — iemand anders claimde deze stoel net. Kies een ander tijdslot.", 409, "slot_taken");
    }

    const tz = data.settings.timeZone;
    const start = zonedToUtc(req.date, req.time, tz);
    const end = new Date(start.getTime() + service.durationMinutes * 60_000);
    const deposit = data.settings.depositAmountCents;
    const needsPayment = deposit > 0 && mollieEnabled();

    const booking: Booking = {
      ...req,
      code: generateBookingCode(),
      status: needsPayment ? "pending_payment" : "confirmed",
      createdAt: new Date().toISOString(),
      startUtc: start.toISOString(),
      endUtc: end.toISOString(),
      durationMinutes: service.durationMinutes,
      priceCents: service.priceCents,
      depositCents: deposit,
      holdUntil: needsPayment ? new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString() : undefined,
    };
    saveBooking(booking); // houdt de stoel direct vast

    if (needsPayment) {
      const payment = await createDepositPayment({
        amountCents: deposit,
        description: `Aanbetaling ${booking.code} — ${service.name}`,
        bookingCode: booking.code,
        siteUrl,
      });
      booking.paymentId = payment.id;
      saveBooking(booking);
      return { bookingCode: booking.code, status: booking.status, checkoutUrl: payment.checkoutUrl, booking };
    }

    await finalizeBooking(booking, data);
    return { bookingCode: booking.code, status: booking.status, booking };
  });
}

/** Na (eventuele) betaling: agenda-event + bevestigingsmail. Fouten hier blokkeren de boeking niet. */
export async function finalizeBooking(booking: Booking, data: SalonData) {
  booking.status = "confirmed";
  booking.holdUntil = undefined;
  saveBooking(booking);

  const service = data.services.find((s) => s.id === booking.serviceId)!;
  const staff = data.staff.find((s) => s.id === booking.staffId)!;
  const { settings } = data;
  const c = booking.customer;

  if (googleEnabled() && staff.calendarId) {
    try {
      booking.calendarEventId = await insertEvent({
        calendarId: staff.calendarId,
        summary: `${service.name}: ${c.name} (${c.phone})`,
        description: [
          `Boekingscode: ${booking.code}`,
          `E-mail: ${c.email}`,
          c.notes ? `Opmerking: ${c.notes}` : null,
          booking.depositCents && booking.paymentId ? `Aanbetaling: ${euro(booking.depositCents)} (Mollie ${booking.paymentId})` : null,
        ]
          .filter(Boolean)
          .join("\n"),
        startUtc: booking.startUtc,
        endUtc: booking.endUtc,
        timeZone: settings.timeZone,
        location: `${settings.name}, ${settings.address}`,
      });
      saveBooking(booking);
    } catch (err) {
      console.error("[studiochair] Kon agenda-event niet aanmaken:", err);
    }
  } else {
    console.info(`[studiochair] (demo) Agenda ${staff.name}: ${service.name} — ${c.name} op ${booking.date} ${booking.time}`);
  }

  const ics = createIcs({
    uid: `${booking.code}@studiochair`,
    startUtc: booking.startUtc,
    endUtc: booking.endUtc,
    summary: `${service.name} bij ${staff.name} — ${settings.name}`,
    description: `Boekingscode ${booking.code}. Verhinderd? Bel ${settings.phone}.`,
    location: `${settings.name}, ${settings.address}`,
    organizerName: settings.name,
    organizerEmail: settings.email,
  });

  if (!process.env.RESEND_API_KEY) {
    console.info(`[studiochair] (demo) Bevestigingsmail naar ${c.email} overgeslagen — geen RESEND_API_KEY.`);
    return;
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? `${settings.name} <onboarding@resend.dev>`,
      to: c.email,
      replyTo: settings.email,
      subject: `Stoel staat vast: ${longDate(booking.date)} om ${booking.time}`,
      react: BookingConfirmationEmail({
        salonName: settings.name,
        salonAddress: settings.address,
        salonPhone: settings.phone,
        customerName: c.name,
        serviceName: service.name,
        staffName: staff.name,
        dateLabel: longDate(booking.date),
        time: booking.time,
        durationLabel: duration(service.durationMinutes),
        priceLabel: euro(service.priceCents, { short: true }),
        depositLabel: booking.paymentId ? `${euro(booking.depositCents)} betaald` : undefined,
        bookingCode: booking.code,
      }),
      attachments: [{ filename: `${booking.code}.ics`, content: Buffer.from(ics).toString("base64") }],
    });
  } catch (err) {
    console.error("[studiochair] Mail versturen mislukt:", err);
  }
}
