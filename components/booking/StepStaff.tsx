"use client";
import Image from "next/image";
import { Eyebrow } from "../ui";
import { useWizard } from "./store";
import type { WizardData } from "./types";

export function StepStaff({ data, onPicked }: { data: WizardData; onPicked: () => void }) {
  const { staffId, selectStaff } = useWizard();

  const options = [
    { id: "any", name: "Eerste beschikbare", role: "Snelste plek in de salon", avatar: null },
    ...data.staff,
  ];

  return (
    <section aria-labelledby="step-title">
      <Eyebrow>Stap 02 — Kapper</Eyebrow>
      <h1 id="step-title" className="display mt-2 text-[clamp(3rem,13vw,6.5rem)]">
        Wie pakt de schaar?
      </h1>

      <ul className="mt-7 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {options.map((o) => {
          const selected = staffId === o.id;
          const isAny = o.id === "any";
          return (
            <li key={o.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  selectStaff(o.id);
                  onPicked();
                }}
                className={`brutal-press flex h-full w-full flex-col text-left ${selected ? "bg-signal" : "bg-card"}`}
              >
                <span className="relative block aspect-square w-full border-b-2 border-ink bg-paper">
                  {isAny ? (
                    <span className="absolute inset-0 grid place-items-center bg-ink">
                      <span className="display text-[clamp(3.5rem,14vw,5.5rem)] text-signal" aria-hidden>
                        ★
                      </span>
                    </span>
                  ) : o.avatar ? (
                    <Image src={o.avatar.url} alt={o.avatar.alt} fill unoptimized={o.avatar.url.endsWith(".svg")} sizes="(min-width: 1280px) 220px, 50vw" className="object-cover" />
                  ) : (
                    <span className="display absolute inset-0 grid place-items-center text-7xl">{o.name[0]}</span>
                  )}
                  {selected && (
                    <span className="absolute right-2 top-2 border-2 border-ink bg-card px-2 py-0.5 font-mono text-xs font-bold uppercase">
                      Gekozen
                    </span>
                  )}
                </span>
                <span className="flex flex-1 flex-col p-3 sm:p-4">
                  <span className="display text-3xl sm:text-4xl">{o.name}</span>
                  <span className={`mt-1 text-sm leading-snug ${selected ? "text-ink" : "text-muted"}`}>{o.role}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
