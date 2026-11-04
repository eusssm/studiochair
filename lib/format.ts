/** Weergave-helpers (NL). */

export function euro(cents: number, opts: { short?: boolean } = {}): string {
  const whole = cents % 100 === 0;
  if (opts.short && whole) return `€${cents / 100},-`;
  return `€${(cents / 100).toFixed(2).replace(".", ",")}`;
}

export function duration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}u${String(m).padStart(2, "0")}` : `${h} uur`;
}

const dayFmt = (opts: Intl.DateTimeFormatOptions) => (date: string) =>
  new Intl.DateTimeFormat("nl-NL", { ...opts, timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));

export const weekdayShort = dayFmt({ weekday: "short" });
export const dayNumber = dayFmt({ day: "numeric" });
export const monthYear = dayFmt({ month: "long", year: "numeric" });
export const longDate = dayFmt({ weekday: "long", day: "numeric", month: "long" });
