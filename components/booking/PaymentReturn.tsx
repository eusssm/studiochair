"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Booking } from "@/types/salon.ts";
import { BookingConfirmation } from "./BookingConfirmation";
import type { WizardData } from "./types";

/** Pollt de boekingsstatus tot de Mollie-webhook de betaling bevestigd heeft. */
export function PaymentReturn({ code, data }: { code: string; data: WizardData }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [state, setState] = useState<"loading" | "pending" | "failed" | "notfound">("loading");

  useEffect(() => {
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      const res = await fetch(`/api/bookings/${encodeURIComponent(code)}`, { cache: "no-store" });
      if (res.status === 404) return setState("notfound");
      const { booking } = (await res.json()) as { booking: Booking };
      setBooking(booking);
      if (booking.status === "confirmed") return;
      if (booking.status === "cancelled" || booking.status === "expired") return setState("failed");
      setState("pending");
      if (++tries < 20) timer = setTimeout(poll, 1500);
    };
    poll();
    return () => clearTimeout(timer);
  }, [code]);

  if (booking?.status === "confirmed") return <BookingConfirmation data={data} booking={booking} />;

  const copy = {
    loading: ["Even checken…", "We halen je boeking op."],
    pending: ["Betaling verwerken…", "Nog een paar tellen. Deze pagina ververst zelf."],
    failed: ["Betaling niet gelukt.", "Je stoel is weer vrijgegeven. Probeer het opnieuw."],
    notfound: ["Boeking niet gevonden.", "Klopt de link? Bel de salon als je twijfelt."],
  }[state];

  return (
    <section className="max-w-2xl" aria-live="polite">
      <h1 className="display text-[clamp(3rem,13vw,6.5rem)]">{copy[0]}</h1>
      <p className="mt-3 text-lg">{copy[1]}</p>
      {(state === "failed" || state === "notfound") && (
        <Link href="/boeken" className="brutal-press mt-8 inline-flex min-h-14 items-center bg-signal px-6 font-mono font-bold uppercase">
          Opnieuw proberen →
        </Link>
      )}
    </section>
  );
}
