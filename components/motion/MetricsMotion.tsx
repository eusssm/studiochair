"use client";

import { motion } from "framer-motion";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

interface MetricItem {
  label: string;
  value: string;
  sub: string;
}

const METRICS: MetricItem[] = [
  {
    label: "Kosten per stoel",
    value: "€ 0,75",
    sub: "Vanaf €0,50. Geen 35% commissie.",
  },
  {
    label: "No-Show Preventie",
    value: "-85%",
    sub: "Met optionele iDEAL aanbetaling.",
  },
  {
    label: "Agenda Sync",
    value: "2-WEG",
    sub: "Google Calendar koppeling per kapper.",
  },
  {
    label: "Content Beheer",
    value: "DATOCMS",
    sub: "Prijzen en team live zelf aanpassen.",
  },
];

export function MetricsMotion() {
  return (
    <motion.div
      className="mt-14 grid gap-4 border-2 border-ink bg-card p-6 shadow-brutal sm:grid-cols-2 sm:p-8 lg:grid-cols-4"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE_EXPO }}
    >
      {METRICS.map((m, idx) => (
        <motion.div
          key={m.label}
          className={`pb-4 sm:pb-0 ${
            idx < METRICS.length - 1
              ? "border-b-2 border-ink/20 sm:border-b-0 sm:border-r-2 sm:pr-4"
              : ""
          }`}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 * idx, ease: EASE_EXPO }}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
        >
          <span className="label-mono text-signal">{m.label}</span>
          <p className="display mt-1 text-4xl">{m.value}</p>
          <p className="font-mono text-xs text-muted">{m.sub}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
