"use client";

import { motion } from "framer-motion";
import { Arrow } from "@/components/ui";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const ctaClass =
  "brutal-press inline-flex min-h-14 items-center justify-center gap-3 px-6 font-mono text-[0.95rem] font-bold uppercase tracking-wide";

export function PricingMotion() {
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-2">
      {/* Setup Pakket */}
      <motion.div
        className="flex flex-col justify-between border-2 border-ink bg-card p-6 shadow-brutal-lg sm:p-8 transition-shadow duration-300 hover:shadow-[10px_10px_0_0_#0e0e0e]"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE_EXPO }}
        whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      >
        <div>
          <span className="border-2 border-ink bg-paper px-2 py-0.5 font-mono text-xs font-bold uppercase">
            Eenmalig
          </span>
          <h3 className="display mt-4 text-4xl">StudioChair Complete Setup</h3>
          <p className="mt-2 text-muted">
            Volledig op maat gemaakt, ingericht en live gezet door Studio Maaijen.
          </p>
          <div className="mt-6 border-y-2 border-ink py-4">
            <p className="display text-5xl">Op Maat</p>
            <p className="font-mono text-xs text-muted">Investering afgestemd op salon-omvang & wensen</p>
          </div>
          <ul className="mt-6 space-y-3 font-mono text-sm">
            <li className="flex items-center gap-2">✓ Volledige salon-website in jouw huisstijl</li>
            <li className="flex items-center gap-2">✓ 4-staps boekingsflow gekoppeld</li>
            <li className="flex items-center gap-2">✓ Google Calendar 2-weg koppeling per stoel</li>
            <li className="flex items-center gap-2">✓ Mollie iDEAL aanbetalingen ingericht</li>
            <li className="flex items-center gap-2">✓ DatoCMS dashboard & contenttraining</li>
            <li className="flex items-center gap-2">✓ Automatische e-mailbevestigingen + .ics</li>
          </ul>
        </div>
        <a href="#contact" className={`${ctaClass} mt-8 w-full bg-signal text-ink`}>
          Vraag Voorstel Aan <Arrow />
        </a>
      </motion.div>

      {/* Maandelijks beheer met Micro-fee */}
      <motion.div
        className="flex flex-col justify-between border-2 border-ink bg-ink p-6 text-white shadow-brutal-lg sm:p-8 transition-shadow duration-300 hover:shadow-[10px_10px_0_0_#ff4500]"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.15, ease: EASE_EXPO }}
        whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      >
        <div>
          <span className="border-2 border-white bg-signal px-2 py-0.5 font-mono text-xs font-bold uppercase text-ink">
            Lopend Model
          </span>
          <h3 className="display mt-4 text-4xl">Lage Basis + Micro-Fee</h3>
          <p className="mt-2 text-white/80">
            Zorgeloos online zonder omkijken naar techniek, updates of hosting.
          </p>
          <div className="mt-6 border-y-2 border-white/30 py-4">
            <p className="display text-4xl text-signal sm:text-5xl">
              € 29,- <span className="text-2xl text-white">/mnd</span>
            </p>
            <p className="mt-1 font-mono text-sm text-white/90">
              + slechts <strong className="text-signal">€ 0,75</strong> per voltooide boeking
            </p>
          </div>
          <ul className="mt-6 space-y-3 font-mono text-sm text-white/90">
            <li className="flex items-center gap-2">✓ Razendsnelle Vercel Edge hosting & SSL</li>
            <li className="flex items-center gap-2">✓ 24/7 continue agenda-synchronisatie</li>
            <li className="flex items-center gap-2">✓ DatoCMS licentie & live beheer</li>
            <li className="flex items-center gap-2">✓ Geen 35% commissie bij nieuwe klanten</li>
            <li className="flex items-center gap-2">✓ Directe support van Studio Maaijen</li>
          </ul>
        </div>
        <a
          href="#contact"
          className={`${ctaClass} mt-8 w-full border-white bg-card text-ink shadow-[4px_4px_0_0_#fff] hover:shadow-[6px_6px_0_0_#fff]`}
        >
          Start Met StudioChair <Arrow />
        </a>
      </motion.div>
    </div>
  );
}
