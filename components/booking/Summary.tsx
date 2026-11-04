"use client";
import { duration, euro, longDate } from "@/lib/format.ts";
import { Eyebrow } from "../ui";
import { type Step, useWizard } from "./store";
import type { WizardData } from "./types";

/** "De bon" — desktop-sidebar met je keuzes; elke regel is klikbaar om terug te gaan. */
export function Summary({ data }: { data: WizardData }) {
  const { serviceId, staffId, date, slot, step, goTo } = useWizard();
  const service = data.services.find((s) => s.id === serviceId);
  const staffName =
    slot?.staffName ?? (staffId === "any" ? "Eerste beschikbare" : data.staff.find((s) => s.id === staffId)?.name);

  const rows: { label: string; value?: string; step: Step }[] = [
    { label: "Behandeling", value: service?.name, step: 0 },
    { label: "Kapper", value: staffName, step: 1 },
    { label: "Moment", value: date && slot ? `${longDate(date)} · ${slot.time}` : undefined, step: 2 },
  ];

  return (
    <aside aria-label="Jouw afspraak" className="border-2 border-ink bg-card sticky top-28 shadow-brutal-lg">
      <div className="border-b-2 border-ink bg-ink px-5 py-3 text-white">
        <p className="label-mono">Jouw bon</p>
      </div>
      <ul className="divide-y-2 divide-dashed divide-ink/30">
        {rows.map((r) => (
          <li key={r.label}>
            <button
              type="button"
              disabled={!r.value || r.step >= step}
              onClick={() => goTo(r.step)}
              className="group flex w-full items-baseline justify-between gap-3 px-5 py-4 text-left disabled:cursor-default"
            >
              <Eyebrow>{r.label}</Eyebrow>
              <span className={`text-right font-bold ${r.value ? "" : "text-muted/60"} group-enabled:underline group-enabled:decoration-2 group-enabled:underline-offset-4 group-enabled:hover:decoration-signal`}>
                {r.value ?? "—"}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-baseline justify-between border-t-2 border-ink px-5 py-4">
        <span className="label-mono">Totaal</span>
        <span className="font-mono text-2xl font-bold tabular-nums">
          {service ? euro(service.priceCents, { short: true }) : "€—"}
        </span>
      </div>
      {service && (
        <p className="border-t-2 border-ink px-5 py-3 font-mono text-xs uppercase text-muted">
          {duration(service.durationMinutes)} in de stoel
          {data.settings.depositAmountCents > 0 && ` · ${euro(data.settings.depositAmountCents)} aanbetaling`}
        </p>
      )}
    </aside>
  );
}
