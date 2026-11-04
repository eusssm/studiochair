"use client";

import { motion } from "framer-motion";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

interface ComparisonRow {
  feature: string;
  studiochair: string;
  treatwell: string;
  generic: string;
}

const ROWS: ComparisonRow[] = [
  {
    feature: "Kosten per nieuwe klant",
    studiochair: "Vaste micro-fee (€ 0,75)",
    treatwell: "35% commissie (€ 15 – € 30 per klant)",
    generic: "Abonnement + transactiekosten",
  },
  {
    feature: "Piekmaanden (bijv. december)",
    studiochair: "Eerlijk: je betaalt enkel die €0,75",
    treatwell: "Duizenden euro's aan commissie kwijt",
    generic: "Vaak limieten op aantal boekingen",
  },
  {
    feature: "Eigendom van klantdata",
    studiochair: "100% van jou",
    treatwell: "Eigendom van Treatwell (stuurt concurrent-acties)",
    generic: "Opgesloten in hun app",
  },
  {
    feature: "Design & Uitstraling",
    studiochair: "Uniek Awwwards-ontwerp op maat",
    treatwell: "Standaard marketplace grid",
    generic: "Generieke saaie widget",
  },
  {
    feature: "No-show preventie (iDEAL)",
    studiochair: "Direct op jouw Mollie-rekening",
    treatwell: "Via Treatwell uitbetaling",
    generic: "Soms creditcard-only",
  },
];

export function ComparisonMotion() {
  return (
    <motion.div
      className="mt-10 overflow-x-auto border-2 border-ink shadow-brutal-lg"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE_EXPO }}
    >
      <table className="w-full text-left font-sans">
        <thead>
          <tr className="border-b-2 border-ink bg-ink text-white font-mono text-sm">
            <th className="p-4 sm:p-5">Functie</th>
            <th className="bg-signal p-4 text-ink sm:p-5 font-bold">StudioChair</th>
            <th className="p-4 sm:p-5">Treatwell</th>
            <th className="p-4 sm:p-5">Generieke Software</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-ink bg-paper font-mono text-sm">
          {ROWS.map((r, i) => (
            <motion.tr
              key={r.feature}
              className="transition-colors hover:bg-card"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: EASE_EXPO }}
            >
              <td className="p-4 font-bold font-sans sm:p-5">{r.feature}</td>
              <td className="bg-signal/20 p-4 font-bold text-signal-dark sm:p-5">{r.studiochair}</td>
              <td className="p-4 sm:p-5 text-error font-bold">{r.treatwell}</td>
              <td className="p-4 sm:p-5 text-muted">{r.generic}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
