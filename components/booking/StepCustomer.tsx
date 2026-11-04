"use client";
import { useState } from "react";
import { customerSchema } from "@/lib/schemas.ts";
import { euro } from "@/lib/format.ts";
import type { BookingResponse } from "@/types/salon.ts";
import { Eyebrow } from "../ui";
import { type CustomerDraft, useWizard } from "./store";
import type { WizardData } from "./types";

type Errors = Partial<Record<keyof CustomerDraft, string>>;

const fields: {
  key: keyof CustomerDraft;
  label: string;
  hint?: string;
  type: string;
  autoComplete: string;
  inputMode?: "email" | "tel" | "text";
  placeholder: string;
  optional?: boolean;
}[] = [
  { key: "name", label: "Naam", type: "text", autoComplete: "name", placeholder: "Voor- en achternaam" },
  { key: "phone", label: "Telefoon", hint: "Voor je herinnering via sms/WhatsApp", type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "06 12 34 56 78" },
  { key: "email", label: "E-mail", hint: "Hier komt je bevestiging + agenda-uitnodiging", type: "email", autoComplete: "email", inputMode: "email", placeholder: "jij@voorbeeld.nl" },
  { key: "notes", label: "Opmerking", type: "text", autoComplete: "off", placeholder: "Bv. zijkanten op 0,5 mm", optional: true },
];

export const CUSTOMER_FORM_ID = "customer-form";

export function StepCustomer({
  data,
  onSubmittingChange,
  onSlotTaken,
}: {
  data: WizardData;
  onSubmittingChange: (v: boolean) => void;
  onSlotTaken: () => void;
}) {
  const { customer, setCustomer, serviceId, slot, date, setResult } = useWizard();
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [slotTaken, setSlotTaken] = useState(false);
  const service = data.services.find((s) => s.id === serviceId);
  const deposit = data.settings.depositAmountCents;

  const validateField = (key: keyof CustomerDraft) => {
    const r = customerSchema.safeParse(customer);
    const issue = r.success ? undefined : r.error.issues.find((i) => i.path[0] === key);
    setErrors((e) => ({ ...e, [key]: issue?.message }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSlotTaken(false);
    const parsed = customerSchema.safeParse(customer);
    if (!parsed.success) {
      const next: Errors = {};
      for (const i of parsed.error.issues) next[i.path[0] as keyof CustomerDraft] ??= i.message;
      setErrors(next);
      document.getElementById(`f-${parsed.error.issues[0].path[0] as string}`)?.focus();
      return;
    }
    if (!slot || !date || !serviceId) return;

    onSubmittingChange(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, staffId: slot.staffId, date, time: slot.time, customer: parsed.data }),
      });
      const json = await res.json();
      if (res.status === 409) {
        setSlotTaken(true);
        setFormError(json.error);
        return;
      }
      if (!res.ok) throw new Error(json.error ?? "Boeken mislukt");
      const result = json as BookingResponse;
      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl); // naar iDEAL (Mollie)
        return;
      }
      setResult(result);
    } catch (err) {
      setFormError((err as Error).message || "Er ging iets mis. Probeer opnieuw.");
    } finally {
      onSubmittingChange(false);
    }
  }

  return (
    <section aria-labelledby="step-title">
      <Eyebrow>Stap 04 — Gegevens</Eyebrow>
      <h1 id="step-title" className="display mt-2 text-[clamp(3rem,13vw,6.5rem)]">
        Bijna in de stoel
      </h1>

      <form id={CUSTOMER_FORM_ID} noValidate onSubmit={onSubmit} className="mt-7 grid gap-5">
        {fields.map((f) => {
          const err = errors[f.key];
          const describedBy = [f.hint && `h-${f.key}`, err && `e-${f.key}`].filter(Boolean).join(" ") || undefined;
          return (
            <div key={f.key}>
              <label htmlFor={`f-${f.key}`} className="label-mono flex items-baseline justify-between text-ink">
                {f.label}
                {f.optional && <span className="text-muted">optioneel</span>}
              </label>
              <input
                id={`f-${f.key}`}
                name={f.key}
                type={f.type}
                inputMode={f.inputMode}
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                value={customer[f.key]}
                required={!f.optional}
                aria-invalid={Boolean(err)}
                aria-describedby={describedBy}
                onChange={(e) => {
                  setCustomer({ [f.key]: e.target.value });
                  if (err) setErrors((x) => ({ ...x, [f.key]: undefined }));
                }}
                onBlur={() => customer[f.key] && validateField(f.key)}
                className={`mt-2 block min-h-14 w-full border-2 border-ink bg-card px-4 text-lg shadow-brutal-sm outline-none transition-shadow placeholder:text-muted/70 focus:shadow-brutal focus-visible:shadow-[4px_4px_0_0_var(--color-signal)] ${
                  err ? "border-error shadow-[3px_3px_0_0_var(--color-error)]" : ""
                }`}
              />
              {f.hint && !err && (
                <p id={`h-${f.key}`} className="mt-1.5 text-sm text-muted">
                  {f.hint}
                </p>
              )}
              {err && (
                <p id={`e-${f.key}`} className="mt-1.5 font-mono text-sm font-bold text-error">
                  ✕ {err}
                </p>
              )}
            </div>
          );
        })}

        {service && (
          <div className="border-2 border-ink shadow-brutal mt-1 bg-ink p-4 text-white sm:p-5">
            <div className="flex items-baseline justify-between gap-4">
              <span className="label-mono">Totaal</span>
              <span className="font-mono text-2xl font-bold tabular-nums">{euro(service.priceCents, { short: true })}</span>
            </div>
            {deposit > 0 && (
              <p className="mt-2 text-sm leading-snug text-white/85">
                <span className="mr-1 inline-block border-2 border-white bg-signal px-1.5 font-mono text-xs font-bold text-ink">
                  iDEAL
                </span>
                Aanbetaling <strong className="font-mono text-white">{euro(deposit)}</strong> nu, tegen no-shows. Wordt
                verrekend met je behandeling.
              </p>
            )}
          </div>
        )}

        {formError && (
          <div role="alert" className="border-2 bg-card shadow-brutal border-error p-4">
            <p className="font-bold text-error">{formError}</p>
            {slotTaken && (
              <button type="button" onClick={onSlotTaken} className="brutal-press mt-3 bg-signal px-4 py-2 font-mono text-sm font-bold uppercase">
                ← Ander tijdslot kiezen
              </button>
            )}
          </div>
        )}
      </form>
    </section>
  );
}
