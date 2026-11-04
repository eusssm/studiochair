import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, Eyebrow } from "@/components/ui";
import { CommissionCalculator } from "@/components/b2b/CommissionCalculator";
import { MotionConfigProvider } from "@/components/motion/MotionConfigProvider";
import { HeroMotion } from "@/components/motion/HeroMotion";
import { MetricsMotion } from "@/components/motion/MetricsMotion";
import { PillarsMotion } from "@/components/motion/PillarsMotion";
import { ShowroomMotion } from "@/components/motion/ShowroomMotion";
import { ComparisonMotion } from "@/components/motion/ComparisonMotion";
import { PricingMotion } from "@/components/motion/PricingMotion";
import { ContactMotion } from "@/components/motion/ContactMotion";
import { MotionDiv } from "@/components/motion/MotionSection";

export const metadata: Metadata = {
  title: "StudioChair — Geen 35% Treatwell-tax, slechts een eerlijke micro-fee | Voor Kappers & Salons",
  description:
    "Het high-end boekingsplatform en maatwerk website voor kapsalons en barbershops. Stop met 35% commissie afdragen aan Treatwell. Slechts een eerlijke micro-fee van €0,75 per boeking.",
};

export default function B2BHomePage() {
  return (
    <MotionConfigProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-signal focus:p-3 focus:font-bold text-ink"
      >
        Naar inhoud
      </a>

      {/* ── Top Bar ───────────────────────────────────────── */}
      <div className="border-b-2 border-ink bg-ink px-4 py-2 text-white sm:px-6 lg:px-12">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between text-xs font-mono">
          <p className="flex items-center gap-2">
            <span className="inline-block size-2 bg-signal" aria-hidden />
            <span>Een product van <strong>Studio Maaijen</strong> (Ridderkerk)</span>
          </p>
          <Link href="/demo" className="hidden items-center gap-1.5 font-bold uppercase text-signal hover:underline sm:flex">
            Bekijk de live kappersdemo (Atelier Eugène) <Arrow className="size-3" />
          </Link>
        </div>
      </div>

      {/* ── Nav ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-12" aria-label="Hoofdmenu">
          <Link href="/" className="display flex items-center gap-2 text-xl tracking-wider sm:text-3xl">
            STUDIOCHAIR
            <span className="border border-ink bg-signal px-1.5 py-0.5 font-mono text-[0.65rem] font-bold text-ink">
              MICRO-FEE
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <ul className="hidden gap-6 font-mono text-sm font-bold uppercase lg:flex">
              <li><a href="#waarom" className="underline-offset-4 hover:underline">Waarom</a></li>
              <li><a href="#besparing" className="underline-offset-4 hover:underline">Besparing</a></li>
              <li><a href="#showroom" className="underline-offset-4 hover:underline">Showroom</a></li>
              <li><a href="#vergelijking" className="underline-offset-4 hover:underline">Vergelijking</a></li>
              <li><a href="#tarieven" className="underline-offset-4 hover:underline">Tarieven</a></li>
            </ul>
            <div className="flex items-center gap-2">
              <Link
                href="/demo"
                className="brutal-press hidden h-9 items-center gap-1.5 border-2 border-ink bg-card px-3 font-mono text-xs font-bold uppercase shadow-brutal-sm sm:inline-flex sm:h-11 sm:px-4 sm:text-sm"
              >
                Live Demo <Arrow className="size-3.5" />
              </Link>
              <a
                href="#contact"
                className="brutal-press inline-flex h-9 items-center justify-center border-2 border-ink bg-signal px-3 font-mono text-xs font-bold uppercase shadow-brutal-sm sm:h-11 sm:px-4 sm:text-sm"
              >
                <span className="sm:hidden">Aanvragen</span>
                <span className="hidden sm:inline">Voorstel Aanvragen</span>
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main id="main">
        {/* ── Hero ────────────────────────────────────────── */}
        <section className="mx-auto max-w-[1600px] px-4 pb-16 pt-10 sm:px-6 lg:px-12 lg:pt-16">
          <HeroMotion />
          <MetricsMotion />
        </section>

        {/* ── Marquee ─────────────────────────────────────── */}
        <div className="overflow-hidden border-y-2 border-ink bg-signal py-3" aria-hidden>
          <div className="marquee-track flex w-max font-bold">
            {[0, 1].map((k) => (
              <p key={k} className="display flex shrink-0 gap-8 pr-8 text-3xl">
                {[
                  "Geen 35% Treatwell-tax",
                  "Vanaf €0,50 per boeking",
                  "Directe iDEAL aanbetaling",
                  "Google Calendar 2-weg sync",
                  "4-staps wizard",
                  "DatoCMS dashboard",
                  "Jouw eigen merk",
                ].map((w) => (
                  <span key={w} className="flex items-center gap-8">
                    {w} <span className="text-card">✦</span>
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>

        {/* ── Besparing / Calculator ──────────────────────── */}
        <section id="besparing" className="mx-auto max-w-[1600px] scroll-mt-20 px-4 py-20 sm:px-6 lg:px-12">
          <MotionDiv className="mb-8 max-w-2xl">
            <Eyebrow>Rekenvoorbeeld</Eyebrow>
            <h2 className="display mt-2 text-[clamp(2.75rem,8vw,5.5rem)]">
              Wat bespaar je met de micro-fee?
            </h2>
            <p className="mt-4 text-lg text-muted">
              Treatwell pakt <strong>35% commissie</strong> op elke nieuwe klant plus maandelijkse softwarekosten. Met StudioChair betaal je slechts <strong>€ 0,75 per boeking</strong>. Sleep de sliders en zie direct jouw jaarlijkse winst.
            </p>
          </MotionDiv>

          <CommissionCalculator />
        </section>

        {/* ── Showroom / Demo Teaser ──────────────────────── */}
        <section id="showroom" className="scroll-mt-20 border-y-2 border-ink bg-card py-20">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12">
            <ShowroomMotion />
          </div>
        </section>

        {/* ── 4 Harde Voordelen ─────────────────────────────── */}
        <section id="waarom" className="mx-auto max-w-[1600px] scroll-mt-20 px-4 py-20 sm:px-6 lg:px-12">
          <MotionDiv>
            <Eyebrow>Waarom StudioChair</Eyebrow>
            <h2 className="display mt-2 text-[clamp(2.75rem,8vw,5.5rem)]">
              Gebouwd voor salons die willen groeien
            </h2>
          </MotionDiv>
          <PillarsMotion />
        </section>

        {/* ── Vergelijking ─────────────────────────────────── */}
        <section id="vergelijking" className="scroll-mt-20 border-y-2 border-ink bg-card py-20">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12">
            <MotionDiv>
              <Eyebrow>De vergelijking</Eyebrow>
              <h2 className="display mt-2 text-[clamp(2.75rem,8vw,5.5rem)]">
                StudioChair vs. Treatwell
              </h2>
            </MotionDiv>
            <ComparisonMotion />
          </div>
        </section>

        {/* ── Tarieven / Investering ───────────────────────── */}
        <section id="tarieven" className="mx-auto max-w-[1600px] scroll-mt-20 px-4 py-20 sm:px-6 lg:px-12">
          <MotionDiv className="max-w-2xl">
            <Eyebrow>Transparante Investering</Eyebrow>
            <h2 className="display mt-2 text-[clamp(2.75rem,8vw,5.5rem)]">
              Eenvoudig & eerlijk verdienmodel
            </h2>
            <p className="mt-4 text-lg text-muted">
              Geen 35% commissie over jouw zweet en vakmanschap. Je betaalt eenmalig voor het bouwen van jouw maatwerk salon-omgeving en daarna een lage vaste basis plus een micro-fee per boeking.
            </p>
          </MotionDiv>
          <PricingMotion />
        </section>

        {/* ── Contact / Aanvraag ──────────────────────────── */}
        <section id="contact" className="scroll-mt-20 border-t-2 border-ink bg-card py-20">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12">
            <ContactMotion />
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t-2 border-ink bg-paper py-8">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-12 font-mono text-xs uppercase">
          <p>© {new Date().getFullYear()} StudioChair — Een merk van Studio Maaijen.</p>
          <div className="flex gap-6">
            <Link href="/demo" className="underline underline-offset-4 hover:text-signal">
              Live Demo (Atelier Eugène)
            </Link>
            <a href="https://www.studio-maaijen.nl" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-signal">
              Studio Maaijen
            </a>
          </div>
        </div>
      </footer>
    </MotionConfigProvider>
  );
}
