"use client";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { euro } from "@/lib/format.ts";
import { Arrow, Button } from "../ui";
import { BookingConfirmation } from "./BookingConfirmation";
import { CUSTOMER_FORM_ID, StepCustomer } from "./StepCustomer";
import { StepDateTime } from "./StepDateTime";
import { StepService } from "./StepService";
import { StepStaff } from "./StepStaff";
import { useWizard } from "./store";
import { Summary } from "./Summary";
import type { WizardData } from "./types";

const STEPS = ["Behandeling", "Kapper", "Tijd", "Gegevens"] as const;

export function BookingWizard({ data, initialServiceId }: { data: WizardData; initialServiceId?: string }) {
  const s = useWizard();
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Deeplink vanaf de prijslijst: /boeken?service=skin-fade
  useEffect(() => {
    if (!initialServiceId) return;
    const svc = data.services.find((x) => x.id === initialServiceId);
    if (svc) {
      useWizard.getState().setCategory(svc.categoryId);
      useWizard.getState().selectService(svc.id);
      useWizard.getState().goTo(1);
    }
  }, [initialServiceId, data.services]);

  // Bij stapwissel: naar boven + focus op de nieuwe kop (screenreaders horen de stap).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const t = setTimeout(() => mainRef.current?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true }), 50);
    return () => clearTimeout(t);
  }, [s.step]);

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  const autoAdvance = () => {
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => useWizard.getState().next(), 260);
  };

  const service = data.services.find((x) => x.id === s.serviceId);
  const canContinue = [Boolean(s.serviceId), Boolean(s.staffId), Boolean(s.slot), true][s.step] ?? false;
  const done = s.step === 4 && s.result;

  const footerLine = [
    service?.name,
    s.slot && `${s.slot.time}${s.staffId === "any" ? ` · ${s.slot.staffName}` : ""}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-svh flex-col">
        {/* ── Header ─────────────────────────────────────── */}
        <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            {s.step > 0 && !done ? (
              <button
                type="button"
                onClick={() => s.back()}
                className="brutal-press flex h-11 items-center gap-2 bg-card px-3 font-mono text-sm font-bold uppercase shadow-brutal-sm"
              >
                ← Terug
              </button>
            ) : (
              <Link href="/" className="display truncate text-2xl">
                {data.settings.name}
              </Link>
            )}
            {!done && (
              <p className="font-mono text-sm font-bold tabular-nums" aria-live="polite">
                <span className="sr-only">Stap </span>
                {String(s.step + 1).padStart(2, "0")}
                <span className="text-muted">/04</span>
                <span className="ml-2 hidden uppercase sm:inline">{STEPS[Math.min(s.step, 3)]}</span>
              </p>
            )}
          </div>
          {/* Voortgang: 4 blokken */}
          <ol className="mx-auto grid max-w-6xl grid-cols-4 gap-1.5 px-4 pb-3 sm:px-6" aria-label="Voortgang">
            {STEPS.map((label, i) => (
              <li key={label} className="relative h-2.5 border-2 border-ink bg-card" aria-current={i === s.step ? "step" : undefined}>
                <span className="sr-only">
                  {label}
                  {i < s.step || done ? " (klaar)" : ""}
                </span>
                <motion.span
                  aria-hidden
                  className="absolute inset-0 origin-left bg-ink"
                  initial={false}
                  animate={{ scaleX: i < s.step || done ? 1 : i === s.step ? 0.5 : 0, backgroundColor: i === s.step && !done ? "#FF4500" : "#0E0E0E" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </li>
            ))}
          </ol>
        </header>

        {/* ── Content ────────────────────────────────────── */}
        <div className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-4 pb-40 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:pt-12">
          <main ref={mainRef} className="min-w-0 [&_h1]:outline-none">
            <AnimatePresence mode="wait" initial={false} custom={s.direction}>
              <motion.div
                key={s.step}
                custom={s.direction}
                variants={{
                  enter: (d: number) => ({ x: d * 48, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d * -48, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.2, 0.9, 0.1, 1] }}
              >
                {s.step === 0 && <StepService data={data} onPicked={autoAdvance} />}
                {s.step === 1 && <StepStaff data={data} onPicked={autoAdvance} />}
                {s.step === 2 && <StepDateTime data={data} refreshKey={refreshKey} />}
                {s.step === 3 && (
                  <StepCustomer
                    data={data}
                    onSubmittingChange={setSubmitting}
                    onSlotTaken={() => {
                      s.selectSlot(null);
                      setRefreshKey((k) => k + 1);
                      s.goTo(2);
                    }}
                  />
                )}
                {done && <BookingConfirmation data={data} booking={s.result!.booking} onAgain={() => s.reset()} />}
              </motion.div>
            </AnimatePresence>
          </main>
          {!done && (
            <div className="hidden lg:block">
              <Summary data={data} />
            </div>
          )}
        </div>

        {/* ── Sticky actiebalk ───────────────────────────── */}
        {!done && (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink bg-paper pb-[env(safe-area-inset-bottom)]">
            <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
              <div className="min-w-0 flex-1 lg:hidden">
                {service ? (
                  <>
                    <p className="truncate text-sm font-bold">{footerLine}</p>
                    <p className="font-mono text-sm font-bold tabular-nums">{euro(service.priceCents, { short: true })}</p>
                  </>
                ) : (
                  <p className="label-mono text-muted">Kies om door te gaan</p>
                )}
              </div>
              <div className="hidden flex-1 lg:block">
                <p className="label-mono text-muted">
                  0% gedoe · direct bevestigd · {data.settings.address}
                </p>
              </div>
              {s.step < 3 ? (
                <Button
                  type="button"
                  variant={canContinue ? "signal" : "card"}
                  disabled={!canContinue}
                  onClick={() => s.next()}
                  className="shrink-0 sm:min-w-56"
                >
                  Verder <Arrow />
                </Button>
              ) : (
                <Button
                  type="submit"
                  form={CUSTOMER_FORM_ID}
                  variant="signal"
                  disabled={submitting}
                  aria-busy={submitting}
                  className="shrink-0 sm:min-w-72"
                >
                  {submitting ? "Vastleggen…" : (
                    <>
                      Stoel vastleggen <Arrow />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
