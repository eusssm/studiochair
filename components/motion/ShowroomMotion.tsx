"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Arrow, Eyebrow } from "@/components/ui";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const ctaClass =
  "brutal-press inline-flex min-h-14 items-center justify-center gap-3 px-6 font-mono text-[0.95rem] font-bold uppercase tracking-wide";

const CHECKS = [
  {
    title: "Geen inloggen of gedoe:",
    desc: "Klanten boeken binnen 30 seconden via mobiel of desktop.",
  },
  {
    title: "Slimme stoelverdeling:",
    desc: "'Eerste beschikbare' vult automatisch de kapper met de minste bezetting.",
  },
  {
    title: "Directe agenda-uitnodiging:",
    desc: "Klant krijgt direct een e-mail en .ics kalender-bestand.",
  },
];

export function ShowroomMotion() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE_EXPO }}
      >
        <Eyebrow>Het levende bewijs</Eyebrow>
        <h2 className="display mt-2 text-[clamp(3rem,9vw,6rem)] leading-tight">
          Ervaar de live showroom: <span className="text-signal">Atelier Eugène</span>
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          We hebben een complete referentie-kapsalon gebouwd om te laten zien hoe snel, stoer en gebruiksvriendelijk
          StudioChair is voor zowel jouw klanten als jezelf.
        </p>

        <ul className="mt-8 space-y-4 font-mono text-sm">
          {CHECKS.map((c, i) => (
            <motion.li
              key={c.title}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: EASE_EXPO }}
            >
              <span className="flex size-6 shrink-0 items-center justify-center border-2 border-ink bg-signal font-bold text-ink">
                ✓
              </span>
              <span>
                <strong>{c.title}</strong> {c.desc}
              </span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-4">
          <motion.div whileHover={{ y: -2 }} whileTap={{ y: 2 }}>
            <Link href="/demo" className={`${ctaClass} bg-signal text-ink shadow-brutal`}>
              Bekijk de Salon Website →
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ y: 2 }}>
            <Link href="/boeken" className={`${ctaClass} bg-paper text-ink shadow-brutal`}>
              Test de 4-Staps Planner →
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Visual Card */}
      <motion.div
        className="border-2 border-ink bg-paper p-6 shadow-brutal-lg transition-shadow duration-300 hover:shadow-[10px_10px_0_0_#0e0e0e]"
        initial={{ opacity: 0, scale: 0.96, y: 35, rotate: 1 }}
        whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, ease: EASE_EXPO, delay: 0.2 }}
        whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      >
        <div className="border-b-2 border-ink pb-4">
          <span className="label-mono text-signal">Referentiecase</span>
          <p className="display mt-1 text-4xl">Atelier Eugène</p>
          <p className="font-mono text-xs text-muted">Craftsmanship & Editorial Styling (Ridderkerk)</p>
        </div>
        <div className="py-6 font-mono text-sm space-y-3">
          <div className="flex justify-between border-b border-ink/20 pb-2">
            <span className="text-muted">Aantal kappers:</span>
            <span className="font-bold">3 stoelen (Marcus, Sophie, Dex)</span>
          </div>
          <div className="flex justify-between border-b border-ink/20 pb-2">
            <span className="text-muted">Diensten:</span>
            <span className="font-bold">8 behandelingen</span>
          </div>
          <div className="flex justify-between border-b border-ink/20 pb-2">
            <span className="text-muted">CMS beheer:</span>
            <span className="font-bold text-signal">DatoCMS Live</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Kosten per boeking:</span>
            <span className="font-bold text-ink">€ 0,75 micro-fee</span>
          </div>
        </div>
        <Link
          href="/demo"
          className="brutal-press block w-full border-2 border-ink bg-ink py-3 text-center font-mono text-sm font-bold uppercase text-white shadow-brutal-sm"
        >
          Open Live Demo
        </Link>
      </motion.div>
    </div>
  );
}
