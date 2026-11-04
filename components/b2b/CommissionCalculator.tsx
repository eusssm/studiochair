"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { euro } from "@/lib/format.ts";
import { Arrow } from "@/components/ui";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

export function CommissionCalculator() {
  const [appointmentsPerWeek, setAppointmentsPerWeek] = useState(60);
  const [averagePrice, setAveragePrice] = useState(45);
  const [feePerBooking, setFeePerBooking] = useState(0.75);

  const appointmentsId = useId();
  const priceId = useId();

  const WEEKS_PER_YEAR = 50;
  const yearlyBookings = appointmentsPerWeek * WEEKS_PER_YEAR;
  const yearlyRevenueCents = yearlyBookings * averagePrice * 100;

  // Treatwell berekening (marktconform):
  // Gemiddeld 25% van de boekingen valt onder Treatwell 35% commissie (nieuwe klanten)
  // Plus €49/mnd platform softwarefee + 2% verwerkingskosten over online betalingen
  const treatwellNewClients = yearlyBookings * 0.25;
  const treatwellCommissionCents = Math.round(treatwellNewClients * averagePrice * 100 * 0.35);
  const treatwellMonthlySoftwareCents = 49 * 100 * 12;
  const treatwellProcessingCents = Math.round(yearlyRevenueCents * 0.5 * 0.02);
  const totalTreatwellYearlyCents = treatwellCommissionCents + treatwellMonthlySoftwareCents + treatwellProcessingCents;

  // StudioChair Micro-fee model:
  // €29/mnd vast (hosting + agenda sync + CMS) + gekozen microfee per boeking (€0,50 of €0,75)
  const studiochairMonthlyBaseCents = 29 * 100 * 12;
  const studiochairBookingFeeCents = Math.round(yearlyBookings * feePerBooking * 100);
  const totalStudiochairYearlyCents = studiochairMonthlyBaseCents + studiochairBookingFeeCents;

  const yearlySavingsCents = Math.max(0, totalTreatwellYearlyCents - totalStudiochairYearlyCents);
  const threeYearSavingsCents = yearlySavingsCents * 3;

  // Drukke maand (bijv. December: 1,5x het weekgemiddelde)
  const decemberBookings = Math.round(appointmentsPerWeek * 5.5);
  const decemberStudiochairCost = Math.round(decemberBookings * feePerBooking + 29);
  const decemberTreatwellCost = Math.round((decemberBookings * 0.25 * averagePrice * 0.35) + 49 + (decemberBookings * averagePrice * 0.5 * 0.02));

  return (
    <motion.div
      className="border-2 border-ink bg-card p-6 shadow-brutal-lg sm:p-10 transition-shadow duration-300 hover:shadow-[10px_10px_0_0_#0e0e0e]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE_EXPO }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-6">
        <div>
          <span className="label-mono text-signal">Transparante vergelijking</span>
          <h3 className="display mt-1 text-3xl sm:text-5xl">De Eerlijke Micro-Fee Calculator</h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
          <span>Jouw StudioChair fee:</span>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setFeePerBooking(0.5)}
            className={`brutal-press px-3 py-1.5 transition-colors ${
              feePerBooking === 0.5 ? "bg-signal text-ink" : "bg-paper text-muted"
            }`}
          >
            € 0,50 / boeking
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setFeePerBooking(0.75)}
            className={`brutal-press px-3 py-1.5 transition-colors ${
              feePerBooking === 0.75 ? "bg-signal text-ink" : "bg-paper text-muted"
            }`}
          >
            € 0,75 / boeking
          </motion.button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Sliders */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <div className="flex items-baseline justify-between font-mono">
              <label htmlFor={appointmentsId} className="label-mono">
                Afspraken per week
              </label>
              <span className="display text-3xl tabular-nums text-ink">{appointmentsPerWeek}</span>
            </div>
            <input
              id={appointmentsId}
              type="range"
              min={20}
              max={150}
              step={5}
              value={appointmentsPerWeek}
              onChange={(e) => setAppointmentsPerWeek(Number(e.target.value))}
              className="mt-3 h-3 w-full cursor-pointer appearance-none border-2 border-ink bg-paper accent-signal"
            />
            <div className="mt-1 flex justify-between font-mono text-xs text-muted">
              <span>20 klanten/wk</span>
              <span>150 klanten/wk</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between font-mono">
              <label htmlFor={priceId} className="label-mono">
                Gemiddelde behandelprijs
              </label>
              <span className="display text-3xl tabular-nums text-ink">€ {averagePrice}</span>
            </div>
            <input
              id={priceId}
              type="range"
              min={25}
              max={120}
              step={5}
              value={averagePrice}
              onChange={(e) => setAveragePrice(Number(e.target.value))}
              className="mt-3 h-3 w-full cursor-pointer appearance-none border-2 border-ink bg-paper accent-signal"
            />
            <div className="mt-1 flex justify-between font-mono text-xs text-muted">
              <span>€ 25 (snel knippen)</span>
              <span>€ 120 (kleuren/styling)</span>
            </div>
          </div>

          <motion.div
            className="border-2 border-dashed border-ink/40 bg-paper p-4 font-mono text-xs text-muted space-y-1"
            whileHover={{ borderColor: "rgba(14, 14, 14, 0.8)" }}
          >
            <p className="font-bold text-ink">Wat kost een piekmaand (zoals december)?</p>
            <p>
              In december (~{decemberBookings} knipbeurten) betaal je bij Treatwell al snel <strong>€ {decemberTreatwellCost},-</strong>. 
              Bij StudioChair betaal je slechts <strong>€ {decemberStudiochairCost},-</strong> (de vaste €29 + €{feePerBooking.toFixed(2)} per boeking).
            </p>
          </motion.div>
        </div>

        {/* Resultaat boxen */}
        <div className="flex flex-col justify-between gap-4">
          <motion.div
            className="border-2 border-ink bg-ink p-6 text-white shadow-brutal transition-transform duration-200"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <span className="label-mono text-white/70">Kosten bij Treatwell per jaar</span>
              <span className="border border-white/40 bg-error/80 px-2 py-0.5 font-mono text-xs font-bold text-white uppercase">
                35% tax + €49/mnd
              </span>
            </div>
            <p className="display mt-2 text-5xl tabular-nums text-signal sm:text-6xl">
              - {euro(totalTreatwellYearlyCents, { short: true })}
            </p>
            <p className="mt-2 font-mono text-xs text-white/80">
              Gebaseerd op 35% commissie over nieuwe klanten, 2% online transactiekosten en de maandelijkse softwarefee.
            </p>
          </motion.div>

          <motion.div
            className="border-2 border-ink bg-signal p-6 text-ink shadow-brutal transition-transform duration-200"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <span className="label-mono text-ink">Jouw netto besparing per jaar</span>
              <span className="border-2 border-ink bg-card px-2 py-0.5 font-mono text-xs font-bold uppercase">
                € {feePerBooking.toFixed(2)} micro-fee
              </span>
            </div>
            <p className="display mt-2 text-4xl tabular-nums sm:text-5xl">
              + {euro(yearlySavingsCents, { short: true })}
            </p>
            <p className="mt-2 font-mono text-xs font-bold">
              Je betaalt slechts {euro(totalStudiochairYearlyCents, { short: true })} all-in per jaar aan StudioChair. De rest van de marge (€ {euro(yearlySavingsCents, { short: true })}) steek je direct zelf in je zak.
            </p>
            <p className="mt-1 font-mono text-xs text-ink/80">
              Besparing over 3 jaar: <strong>{euro(threeYearSavingsCents, { short: true })}</strong>.
            </p>
            <motion.a
              href="#contact"
              whileHover={{ y: -1 }}
              whileTap={{ y: 2 }}
              className="brutal-press mt-5 inline-flex w-full items-center justify-center gap-2 border-2 border-ink bg-card py-3 font-mono text-sm font-bold uppercase shadow-brutal-sm"
            >
              Kies voor de eerlijke micro-fee <Arrow className="size-4" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
