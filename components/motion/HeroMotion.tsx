"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Arrow, Eyebrow } from "@/components/ui";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const ctaClass =
  "brutal-press inline-flex min-h-14 items-center justify-center gap-3 px-6 font-mono text-[0.95rem] font-bold uppercase tracking-wide";

export function HeroMotion() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center xl:gap-14">
      {/* ── Left Column: Kinetic Typography & Copy ── */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_EXPO }}
        >
          <Eyebrow>Voor Kappers, Barbershops & Hair Stylists</Eyebrow>
        </motion.div>

        <h1 className="display mt-4 text-[clamp(3.5rem,6.2vw,7.8rem)] leading-[0.88]">
          {/* Line 1: Masked Kinetic Reveal */}
          <span className="block overflow-hidden py-1">
            <motion.span
              className="block"
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.05 }}
            >
              GEEN 35% COMMISSIE.
            </motion.span>
          </span>

          {/* Line 2: Masked Kinetic Reveal with Signal Highlighter */}
          <span className="relative inline-block overflow-hidden py-1 text-ink">
            <motion.span
              className="block"
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.18 }}
            >
              EEN EERLIJKE MICRO-FEE.
            </motion.span>
            <motion.span
              aria-hidden
              className="absolute -bottom-1 left-0 -z-10 h-[0.3em] w-full bg-signal"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ transformOrigin: "left" }}
              transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.55 }}
            />
          </span>
        </h1>

        <motion.p
          className="mt-8 max-w-2xl text-xl leading-relaxed text-ink/90 sm:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.35 }}
        >
          Stop met € 15,- tot € 25,- per nieuwe klant afdragen aan Treatwell. StudioChair levert een{" "}
          <strong>high-end salon-website</strong> en een <strong>4-staps planner</strong> voor slechts{" "}
          <strong>€ 0,75 per boeking</strong>. Zonder wurgcontracten, mét Google Calendar 2-weg synchronisatie en
          no-show borg.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.48 }}
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ y: 2 }}>
            <Link href="/demo" className={`${ctaClass} bg-signal text-ink shadow-brutal`}>
              Bekijk Live Demo (Atelier Eugène) <Arrow />
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ y: 2 }}>
            <a href="#besparing" className={`${ctaClass} bg-card text-ink shadow-brutal`}>
              Bereken Je Winst ↓
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Right Column: Grand Hero Photo Frame with Motion ── */}
      <motion.div
        className="relative group"
        initial={{ opacity: 0, scale: 0.96, y: 35, rotate: -1.5 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 1 }}
        whileHover={{ rotate: 0, y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
        transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.25 }}
      >
        <div className="relative border-2 border-ink bg-card p-4 sm:p-5 shadow-brutal-lg transition-shadow duration-300 group-hover:shadow-[10px_10px_0_0_#0e0e0e]">
          <div className="relative aspect-[4/3] sm:aspect-[16/11] xl:aspect-[5/4] w-full overflow-hidden border-2 border-ink bg-ink">
            <Image
              src="/images/hero-barber.jpg"
              alt="Kapper aan het werk in een moderne salon met StudioChair"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-[center_30%] transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 border-2 border-ink bg-paper px-3.5 py-1.5 font-mono text-xs font-bold uppercase shadow-brutal-sm text-ink">
              ⚡ 100% Jouw Vakmanschap
            </div>
            <div className="hidden sm:block absolute top-4 right-4 border-2 border-ink bg-signal px-3 py-1 font-mono text-xs font-bold uppercase text-ink shadow-brutal-sm">
              Geen Platform-Tax
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between px-1 font-mono text-xs sm:text-sm text-muted">
            <span>Jouw stoel, jouw agenda, jouw winst.</span>
            <span className="font-bold text-ink">0% Treatwell-commissie</span>
          </div>
        </div>

        {/* Floating Brutalist Badge with Spring Entrance */}
        <motion.div
          className="absolute -bottom-4 -left-4 hidden border-2 border-ink bg-signal px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink shadow-brutal sm:block"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.65 }}
          whileHover={{ scale: 1.05 }}
        >
          ⚡ Geen wurgcommissie
        </motion.div>
      </motion.div>
    </div>
  );
}
