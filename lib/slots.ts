/**
 * StudioChair — tijdslot- & beschikbaarheidsalgoritme (STUDIOCHAIR.md §4).
 * Pure functies: geen I/O, dus makkelijk te testen.
 *
 * Regels
 * 1. Een slot claimt `duration + buffer` minuten aaneengesloten.
 * 2. Het volledige blok moet binnen één shift (ochtend/middag/avond) vallen.
 * 3. Collision check: T is geldig ⇔ ∀ afspraak A:
 *      T + duration + buffer ≤ A.start   ∨   T ≥ A.end + buffer
 *    (de buffer na een bestaande afspraak wordt ook gerespecteerd, zodat
 *     er tussen elke twee afspraken precies één buffer zit).
 * 4. Startmomenten liggen op het `slotIntervalMinutes`-raster vanaf het begin
 *    van de shift.
 * 5. "Eerste beschikbare": per tijdstip één slot, toegewezen aan de kapper
 *    met de minste bezetting die dag (eerlijke verdeling).
 */
import type { BusyWindow, SalonSetting, SalonStaff, Shift, TimeSlot, Weekday } from "../types/salon.ts";
import { toHHMM, toMinutes, weekdayOf } from "./time.ts";

export interface SlotParams {
  shifts: Shift[];
  busy: BusyWindow[];
  durationMinutes: number;
  bufferMinutes: number;
  intervalMinutes: number;
  /** Starttijden vóór dit tijdstip (minuten) worden overgeslagen, bv. "nu + lead time" */
  notBefore?: number;
}

export function isFree(
  t: number,
  busy: BusyWindow[],
  durationMinutes: number,
  bufferMinutes: number,
): boolean {
  const end = t + durationMinutes + bufferMinutes;
  return busy.every((a) => end <= a.start || t >= a.end + bufferMinutes);
}

/** Alle geldige starttijden (minuten vanaf middernacht) voor één kapper. */
export function computeStartTimes(p: SlotParams): number[] {
  const out: number[] = [];
  const block = p.durationMinutes + p.bufferMinutes;
  const step = Math.max(5, p.intervalMinutes);
  for (const shift of p.shifts) {
    const s = toMinutes(shift.start);
    const e = toMinutes(shift.end);
    for (let t = s; t + block <= e; t += step) {
      if (p.notBefore !== undefined && t < p.notBefore) continue;
      if (isFree(t, p.busy, p.durationMinutes, p.bufferMinutes)) out.push(t);
    }
  }
  return out;
}

export function shiftsFor(settings: SalonSetting, staff: SalonStaff, date: string): Shift[] {
  const wd = weekdayOf(date) as Weekday;
  if (!staff.isActive || !staff.workingDays.includes(wd)) return [];
  return settings.openingHours[wd] ?? [];
}

export interface MultiStaffParams {
  date: string;
  settings: SalonSetting;
  staff: SalonStaff[];
  durationMinutes: number;
  busyByStaff: Record<string, BusyWindow[]>;
  notBefore?: number;
}

/**
 * Berekent slots voor één of meerdere kappers.
 * Eén kapper → alle vrije tijden van die kapper.
 * Meerdere kappers ("eerste beschikbare") → unie, per tijdstip één kapper.
 */
export function computeSlots(p: MultiStaffParams): TimeSlot[] {
  const perStaff = p.staff.map((st) => {
    const busy = p.busyByStaff[st.id] ?? [];
    const times = computeStartTimes({
      shifts: shiftsFor(p.settings, st, p.date),
      busy,
      durationMinutes: p.durationMinutes,
      bufferMinutes: p.settings.bufferMinutes,
      intervalMinutes: p.settings.slotIntervalMinutes,
      notBefore: p.notBefore,
    });
    const load = busy.reduce((sum, b) => sum + (b.end - b.start), 0);
    return { st, times: new Set(times), load };
  });

  const byTime = new Map<number, TimeSlot>();
  // Minst bezette kapper eerst → wint bij gelijke tijden.
  const ordered = [...perStaff].sort((a, b) => a.load - b.load);
  for (const { st, times } of ordered) {
    for (const t of times) {
      if (!byTime.has(t)) byTime.set(t, { time: toHHMM(t), staffId: st.id, staffName: st.name });
    }
  }
  return [...byTime.entries()].sort(([a], [b]) => a - b).map(([, s]) => s);
}

/** Groepeert slots in dagdelen voor de UI. */
export function groupByDaypart(slots: TimeSlot[]) {
  const groups = { ochtend: [] as TimeSlot[], middag: [] as TimeSlot[], avond: [] as TimeSlot[] };
  for (const s of slots) {
    const m = toMinutes(s.time);
    if (m < 13 * 60) groups.ochtend.push(s);
    else if (m < 18 * 60) groups.middag.push(s);
    else groups.avond.push(s);
  }
  return groups;
}
