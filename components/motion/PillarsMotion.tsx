"use client";

import { motion } from "framer-motion";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

interface Pillar {
  num: string;
  title: string;
  body: string;
}

const PILLARS: Pillar[] = [
  {
    num: "01",
    title: "Slechts € 0,75 per boeking",
    body: "Geen 35% commissie over jouw knipbeurten. Je betaalt enkel een fractie van de prijs per succesvolle afspraak. 100% van het behandelbedrag gaat via Mollie iDEAL direct naar jouw eigen rekening.",
  },
  {
    num: "02",
    title: "85% Minder No-Shows",
    body: "Laat klanten optioneel een aanbetaling doen (bijvoorbeeld €15 via iDEAL). Mensen die aanbetalen komen opdagen. De aanbetaling wordt automatisch verrekend bij het afrekenen in de salon.",
  },
  {
    num: "03",
    title: "Google Calendar Twee-Weg",
    body: "Elke kapper heeft zijn eigen Google Agenda. Plan je een tandartsafspraak of privégebeurtenis in je telefoon? Dan sluit dat tijdslot direct automatisch in de planner. Nooit meer dubbel geboekt.",
  },
  {
    num: "04",
    title: "Eenvoudig CMS Beheer",
    body: "Prijzen verhogen, nieuwe behandeling toevoegen of een tijdelijke kapper inroosteren? Je regelt het zelf in een eenvoudig, professioneel CMS zonder technische kennis.",
  },
];

export function PillarsMotion() {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2">
      {PILLARS.map((p, idx) => (
        <motion.div
          key={p.num}
          className="group border-2 border-ink bg-card p-6 shadow-brutal sm:p-8 transition-shadow duration-200 hover:shadow-brutal-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: idx * 0.1, ease: EASE_EXPO }}
          whileHover={{ y: -4, transition: { duration: 0.18, ease: "easeOut" } }}
        >
          <span className="display block text-5xl text-signal transition-transform duration-200 group-hover:scale-105 origin-left">
            {p.num}
          </span>
          <h3 className="display mt-3 text-3xl">{p.title}</h3>
          <p className="mt-3 text-base text-muted">{p.body}</p>
        </motion.div>
      ))}
    </div>
  );
}
