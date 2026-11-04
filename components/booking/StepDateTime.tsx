"use client";
import { useEffect, useMemo, useState } from "react";
import { groupByDaypart } from "@/lib/slots.ts";
import { dayNumber, monthYear, weekdayShort } from "@/lib/format.ts";
import { addDays, weekdayOf, zonedParts } from "@/lib/time.ts";
import type { AvailabilityResponse, DaySummary, TimeSlot } from "@/types/salon.ts";
import { Eyebrow } from "../ui";
import { useWizard } from "./store";
import type { WizardData } from "./types";

function mondayOf(date: string) {
  const wd = weekdayOf(date);
  return addDays(date, wd === 0 ? -6 : 1 - wd);
}

export function StepDateTime({ data, refreshKey }: { data: WizardData; refreshKey: number }) {
  const { serviceId, staffId, date, slot, selectDate, selectSlot } = useWizard();
  const today = useMemo(() => zonedParts(new Date(), data.settings.timeZone).date, [data.settings.timeZone]);
  const lastDay = addDays(today, data.settings.bookingHorizonDays);
  const [weekStart, setWeekStart] = useState(() => mondayOf(date ?? today));
  const [days, setDays] = useState<DaySummary[] | null>(null);
  const [slots, setSlots] = useState<TimeSlot[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const staffParam = staffId ?? "any";

  // Week-overzicht: aantal vrije plekken per dag
  useEffect(() => {
    if (!serviceId) return;
    const ctrl = new AbortController();
    setDays(null);
    fetch(`/api/availability/week?from=${weekStart}&days=7&serviceId=${serviceId}&staffId=${staffParam}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((j: { days: DaySummary[] }) => {
        setDays(j.days);
        // Nog geen dag gekozen (of gekozen dag valt buiten deze week)? Pak de eerste dag met plek.
        const current = useWizard.getState().date;
        const inWeek = current && j.days.some((d) => d.date === current);
        if (!inWeek) {
          const first = j.days.find((d) => d.count > 0 && d.date >= today);
          if (first) selectDate(first.date);
        }
      })
      .catch((e) => e?.name !== "AbortError" && setError("Agenda even niet bereikbaar."));
    return () => ctrl.abort();
  }, [serviceId, staffParam, weekStart, today, selectDate, refreshKey]);

  // Tijdsloten voor gekozen dag
  useEffect(() => {
    if (!serviceId || !date) return;
    const ctrl = new AbortController();
    setSlots(null);
    setError(null);
    fetch(`/api/availability?date=${date}&serviceId=${serviceId}&staffId=${staffParam}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((j: AvailabilityResponse) => setSlots(j.slots))
      .catch((e) => e?.name !== "AbortError" && setError("Agenda even niet bereikbaar. Probeer het zo opnieuw."));
    return () => ctrl.abort();
  }, [serviceId, staffParam, date, refreshKey]);

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const canPrev = weekStart > mondayOf(today);
  const canNext = addDays(weekStart, 7) <= lastDay;
  const groups = slots ? groupByDaypart(slots) : null;
  const showStaff = staffParam === "any";

  return (
    <section aria-labelledby="step-title">
      <Eyebrow>Stap 03 — Datum & tijd</Eyebrow>
      <h1 id="step-title" className="display mt-2 text-[clamp(3rem,13vw,6.5rem)]">
        Claim je tijdslot
      </h1>

      {/* Maand + weeknavigatie */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setWeekStart(addDays(weekStart, -7))}
          disabled={!canPrev}
          aria-label="Vorige week"
          className="brutal-press grid size-12 place-items-center bg-card font-mono text-xl font-bold"
        >
          ←
        </button>
        <p className="display text-3xl sm:text-4xl" aria-live="polite">
          {monthYear(weekDates[3])}
        </p>
        <button
          type="button"
          onClick={() => setWeekStart(addDays(weekStart, 7))}
          disabled={!canNext}
          aria-label="Volgende week"
          className="brutal-press grid size-12 place-items-center bg-card font-mono text-xl font-bold"
        >
          →
        </button>
      </div>

      {/* Dagen */}
      <ul className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-3" aria-label="Kies een dag">
        {weekDates.map((d) => {
          const info = days?.find((x) => x.date === d);
          const past = d < today || d > lastDay;
          const disabled = past || !info || !info.open || info.count === 0;
          const selected = d === date;
          const label = !info ? "" : !info.open ? "dicht" : info.count === 0 ? "vol" : `${info.count}`;
          return (
            <li key={d}>
              <button
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                aria-label={`${weekdayShort(d)} ${dayNumber(d)}${info?.open ? `, ${info.count} plekken vrij` : ", gesloten"}`}
                onClick={() => selectDate(d)}
                className={`brutal-press flex w-full flex-col items-center py-2.5 sm:py-3 ${
                  selected ? "bg-signal" : "bg-card"
                } ${d === today ? "outline-2 outline-dashed outline-offset-[-6px] outline-ink" : ""}`}
              >
                <span className="label-mono text-[0.62rem] sm:text-[0.7rem]">{weekdayShort(d).replace(".", "")}</span>
                <span className="display mt-1 text-2xl sm:text-4xl">{dayNumber(d)}</span>
                <span className={`mt-1 h-4 font-mono text-[0.6rem] font-bold uppercase sm:text-[0.68rem] ${days ? "" : "animate-pulse"}`}>
                  {days ? label : "··"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Tijdsloten */}
      <div className="mt-8" aria-live="polite" aria-busy={!slots && !error}>
        {error && (
          <p role="alert" className="border-2 bg-card shadow-brutal border-error p-4 font-bold text-error">
            {error}
          </p>
        )}
        {!error && date && !slots && <SlotSkeleton />}
        {!error && slots && slots.length === 0 && (
          <p className="border-2 border-ink bg-card shadow-brutal p-5 font-bold">Vol. Deze dag zit dicht — pak een andere dag hierboven.</p>
        )}
        {groups &&
          (["ochtend", "middag", "avond"] as const).map(
            (part) =>
              groups[part].length > 0 && (
                <fieldset key={part} className="mb-6">
                  <legend className="label-mono mb-3 flex w-full items-center gap-3">
                    {part}
                    <span className="h-0.5 flex-1 bg-ink" aria-hidden />
                    <span className="text-muted">{groups[part].length}</span>
                  </legend>
                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5">
                    {groups[part].map((s) => {
                      const selected = slot?.time === s.time && slot.staffId === s.staffId;
                      return (
                        <button
                          key={s.time}
                          type="button"
                          aria-pressed={selected}
                          aria-label={`${s.time}${showStaff ? ` bij ${s.staffName}` : ""}`}
                          onClick={() => selectSlot(selected ? null : s)}
                          className={`brutal-press flex min-h-14 flex-col items-center justify-center px-2 py-2 font-mono ${
                            selected ? "bg-signal" : "bg-card"
                          }`}
                        >
                          <span className="text-lg font-bold tabular-nums">{s.time}</span>
                          {showStaff && <span className="text-[0.68rem] font-bold uppercase opacity-80">{s.staffName}</span>}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ),
          )}
      </div>
    </section>
  );
}

function SlotSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5" aria-label="Tijden laden">
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="h-14 animate-pulse border-2 border-ink/25 bg-card" />
      ))}
    </div>
  );
}
