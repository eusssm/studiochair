/**
 * Server-side beschikbaarheid: combineert salondata, agenda-busy en het algoritme.
 */
import "server-only";
import type { BusyWindow, DaySummary, SalonData, SalonStaff, TimeSlot } from "@/types/salon.ts";
import { computeSlots, shiftsFor } from "./slots.ts";
import { getBusyWindows, googleEnabled } from "./google.ts";
import { mockCalendarBusy, storeBusyWindows } from "./store.ts";
import { addDays, zonedParts } from "./time.ts";

export async function busyFor(staff: SalonStaff, date: string, data: SalonData): Promise<BusyWindow[]> {
  const own = storeBusyWindows(staff.id, date);
  if (googleEnabled() && staff.calendarId) {
    try {
      return [...(await getBusyWindows(staff.calendarId, date, data.settings.timeZone)), ...own];
    } catch (err) {
      console.error(`[studiochair] Google Calendar fout voor ${staff.name}:`, err);
      throw new Error("Agenda tijdelijk niet bereikbaar");
    }
  }
  return [...mockCalendarBusy(staff.id, date), ...own];
}

/** Grenzen: verleden, vandaag binnen lead time, en buiten de boekingshorizon. */
function dateBounds(date: string, data: SalonData): { bookable: boolean; notBefore?: number } {
  const now = zonedParts(new Date(), data.settings.timeZone);
  if (date < now.date) return { bookable: false };
  if (date > addDays(now.date, data.settings.bookingHorizonDays)) return { bookable: false };
  if (date === now.date) return { bookable: true, notBefore: now.minutes + data.settings.leadTimeMinutes };
  return { bookable: true };
}

export function resolveStaff(data: SalonData, staffId?: string | null): SalonStaff[] {
  const active = data.staff.filter((s) => s.isActive);
  if (!staffId || staffId === "any") return active;
  return active.filter((s) => s.id === staffId);
}

export async function getSlots(
  data: SalonData,
  opts: { date: string; durationMinutes: number; staffId?: string | null },
): Promise<TimeSlot[]> {
  const bounds = dateBounds(opts.date, data);
  if (!bounds.bookable) return [];
  const staff = resolveStaff(data, opts.staffId).filter((s) => shiftsFor(data.settings, s, opts.date).length);
  const busyByStaff: Record<string, BusyWindow[]> = {};
  await Promise.all(staff.map(async (s) => (busyByStaff[s.id] = await busyFor(s, opts.date, data))));
  return computeSlots({
    date: opts.date,
    settings: data.settings,
    staff,
    durationMinutes: opts.durationMinutes,
    busyByStaff,
    notBefore: bounds.notBefore,
  });
}

export async function getWeekSummary(
  data: SalonData,
  opts: { from: string; days: number; durationMinutes: number; staffId?: string | null },
): Promise<DaySummary[]> {
  const dates = Array.from({ length: opts.days }, (_, i) => addDays(opts.from, i));
  return Promise.all(
    dates.map(async (date) => {
      const open = resolveStaff(data, opts.staffId).some((s) => shiftsFor(data.settings, s, date).length > 0);
      if (!open) return { date, open: false, count: 0 };
      const slots = await getSlots(data, { date, durationMinutes: opts.durationMinutes, staffId: opts.staffId });
      return { date, open: true, count: slots.length };
    }),
  );
}
