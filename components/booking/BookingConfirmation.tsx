"use client";
import { motion } from "framer-motion";
import { createIcs, downloadIcs } from "@/lib/calendar.ts";
import { duration, euro, longDate } from "@/lib/format.ts";
import type { Booking } from "@/types/salon.ts";
import { Arrow, Button, Eyebrow } from "../ui";
import type { WizardData } from "./types";

export function BookingConfirmation({
  data,
  booking,
  onAgain,
}: {
  data: WizardData;
  booking: Booking;
  onAgain?: () => void;
}) {
  const service = data.services.find((s) => s.id === booking.serviceId);
  const staff = data.staff.find((s) => s.id === booking.staffId);
  const { settings } = data;
  const first = booking.customer.name.split(" ")[0];

  const ics = () =>
    createIcs({
      uid: `${booking.code}@studiochair`,
      startUtc: booking.startUtc,
      endUtc: booking.endUtc,
      summary: `${service?.name ?? "Afspraak"} bij ${staff?.name ?? settings.name} — ${settings.name}`,
      description: `Boekingscode ${booking.code}. Verhinderd? Bel ${settings.phone}.`,
      location: `${settings.name}, ${settings.address}`,
    });

  const rows: [string, string][] = [
    ["Wat", service?.name ?? "—"],
    ["Wie", staff?.name ?? "—"],
    ["Wanneer", `${longDate(booking.date)} · ${booking.time}`],
    ["Duur", duration(booking.durationMinutes)],
    ["Prijs", euro(booking.priceCents, { short: true })],
  ];
  if (booking.paymentId) rows.push(["Aanbetaling", `${euro(booking.depositCents)} betaald`]);

  return (
    <section aria-labelledby="done-title" className="mx-auto max-w-2xl">
      <motion.div
        initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: -3, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 18 }}
        className="inline-block border-2 border-ink bg-signal px-4 py-2 font-mono text-xl font-bold shadow-brutal"
      >
        {booking.code}
      </motion.div>

      <h1 id="done-title" tabIndex={-1} className="display mt-6 text-[clamp(3.5rem,16vw,8rem)] outline-none">
        Stoel staat vast, {first}.
      </h1>
      <p className="mt-3 max-w-md text-lg">
        Bevestiging is onderweg naar <strong className="[overflow-wrap:anywhere]">{booking.customer.email}</strong>. Zet &apos;m meteen in je agenda.
      </p>

      <dl className="border-2 border-ink bg-card shadow-brutal mt-8 divide-y-2 divide-ink">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4 px-4 py-3 sm:px-5">
            <dt className="label-mono text-muted">{k}</dt>
            <dd className="text-right font-bold">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button variant="signal" onClick={() => downloadIcs(ics(), `${booking.code}.ics`)} className="sm:flex-1">
          Zet in agenda (.ics) <Arrow />
        </Button>
        {onAgain && (
          <Button variant="card" onClick={onAgain} className="sm:flex-1">
            Nog een stoel claimen
          </Button>
        )}
      </div>

      <Eyebrow className="mt-10">
        Verhinderd? Bel {settings.phone} — uiterlijk 24 uur van tevoren.
      </Eyebrow>
    </section>
  );
}
