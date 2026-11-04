/**
 * In-memory boekingsopslag + mock-agenda.
 *
 * ⚠️ Alleen voor development / demo. Op Vercel (serverless) is dit geheugen
 * per instance en vluchtig. In productie is Google Calendar de bron van
 * waarheid (zie lib/google.ts) — of vervang dit door een database (bv. Postgres/KV).
 */
import "server-only";
import type { Booking, BusyWindow } from "@/types/salon.ts";
import { toMinutes } from "./time.ts";

type Store = { bookings: Map<string, Booking>; locks: Map<string, Promise<void>> };

const g = globalThis as unknown as { __studiochair?: Store };
const store: Store = (g.__studiochair ??= { bookings: new Map(), locks: new Map() });

export function saveBooking(b: Booking) {
  store.bookings.set(b.code, b);
}

export function getBooking(code: string): Booking | undefined {
  const b = store.bookings.get(code);
  if (b && b.status === "pending_payment" && b.holdUntil && Date.parse(b.holdUntil) < Date.now()) {
    b.status = "expired";
  }
  return b;
}

export function findBookingByPayment(paymentId: string): Booking | undefined {
  for (const b of store.bookings.values()) if (b.paymentId === paymentId) return b;
}

/** Bezette vensters uit eigen boekingen (bevestigd of nog in betaling). */
export function storeBusyWindows(staffId: string, date: string): BusyWindow[] {
  const out: BusyWindow[] = [];
  for (const code of store.bookings.keys()) {
    const b = getBooking(code)!;
    if (b.staffId !== staffId || b.date !== date) continue;
    if (b.status !== "confirmed" && b.status !== "pending_payment") continue;
    const start = toMinutes(b.time);
    out.push({ start, end: start + b.durationMinutes });
  }
  return out;
}

/**
 * Simpele per-sleutel mutex: voorkomt dat twee gelijktijdige requests
 * dezelfde stoel claimen (race-condition lock uit de spec).
 */
export async function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = store.locks.get(key) ?? Promise.resolve();
  let release!: () => void;
  const next = new Promise<void>((r) => (release = r));
  store.locks.set(key, prev.then(() => next));
  await prev;
  try {
    return await fn();
  } finally {
    release();
    if (store.locks.get(key) === next) store.locks.delete(key);
  }
}

/** Deterministische "bestaande afspraken" zodat de demo er levendig uitziet. */
export function mockCalendarBusy(staffId: string, date: string): BusyWindow[] {
  let seed = 0;
  for (const ch of staffId + date) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const candidates = [9 * 60 + 15, 10 * 60 + 30, 11 * 60 + 45, 14 * 60, 15 * 60 + 15, 16 * 60 + 30, 18 * 60 + 30, 19 * 60 + 30];
  const out: BusyWindow[] = [];
  for (const start of candidates) {
    if (rand() < 0.38) out.push({ start, end: start + (rand() < 0.5 ? 30 : 45) });
  }
  return out;
}

export function generateBookingCode(): string {
  let code: string;
  do code = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
  while (store.bookings.has(code));
  return code;
}
