"use client";
import { useMemo, useRef } from "react";
import { duration, euro } from "@/lib/format.ts";
import { Badge, Eyebrow } from "../ui";
import { useWizard } from "./store";
import type { WizardData } from "./types";

export function StepService({ data, onPicked }: { data: WizardData; onPicked: () => void }) {
  const { categoryId, serviceId, setCategory, selectService } = useWizard();
  const cats = useMemo(() => [...data.categories].sort((a, b) => a.sortOrder - b.sortOrder), [data.categories]);
  const activeCat = categoryId ?? cats[0]?.id;
  const services = data.services.filter((s) => s.categoryId === activeCat);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + cats.length) % cats.length;
    setCategory(cats[n].id);
    tabRefs.current[n]?.focus();
  };

  return (
    <section aria-labelledby="step-title">
      <Eyebrow>Stap 01 — Behandeling</Eyebrow>
      <h1 id="step-title" className="display mt-2 text-[clamp(3rem,13vw,6.5rem)]">
        Wat gaan we fiksen?
      </h1>

      <div role="tablist" aria-label="Categorieën" className="no-scrollbar -mx-4 mt-6 flex gap-3 overflow-x-auto px-4 pb-2 pt-1">
        {cats.map((c, i) => {
          const count = data.services.filter((s) => s.categoryId === c.id).length;
          const selected = c.id === activeCat;
          return (
            <button
              key={c.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${c.slug}`}
              aria-selected={selected}
              aria-controls="service-panel"
              tabIndex={selected ? 0 : -1}
              onKeyDown={(e) => onTabKey(e, i)}
              onClick={() => setCategory(c.id)}
              className={`brutal-press shrink-0 whitespace-nowrap px-4 py-2.5 font-mono text-sm font-bold uppercase ${
                selected ? "bg-ink text-white" : "bg-card"
              }`}
            >
              {c.title} <span className={selected ? "text-signal" : "text-muted"}>({count})</span>
            </button>
          );
        })}
      </div>

      <ul id="service-panel" role="tabpanel" aria-labelledby={`tab-${cats.find((c) => c.id === activeCat)?.slug}`} className="mt-5 grid gap-4">
        {services.map((s) => {
          const selected = s.id === serviceId;
          return (
            <li key={s.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  selectService(s.id);
                  onPicked();
                }}
                className={`brutal-press group relative flex w-full items-start gap-4 p-4 text-left sm:p-5 ${
                  selected ? "bg-signal" : "bg-card"
                }`}
              >
                <span
                  aria-hidden
                  className={`mt-1 grid size-6 shrink-0 place-items-center border-2 border-ink ${selected ? "bg-ink" : "bg-card"}`}
                >
                  {selected && <span className="size-2.5 bg-signal" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-bold leading-tight sm:text-xl">{s.name}</span>
                    {s.isPopular && <Badge className={selected ? "bg-card" : ""}>Meest gekozen</Badge>}
                  </span>
                  <span className={`mt-1.5 block text-[0.95rem] leading-snug ${selected ? "text-ink" : "text-muted"}`}>
                    {s.description}
                  </span>
                </span>
                <span className="shrink-0 text-right font-mono text-sm font-bold tabular-nums">
                  <span className="block text-base">{euro(s.priceCents, { short: true })}</span>
                  <span className="block opacity-80">{duration(s.durationMinutes)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
