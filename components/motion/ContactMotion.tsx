"use client";

import { motion } from "framer-motion";
import { Eyebrow } from "@/components/ui";
import { ContactForm } from "@/components/b2b/ContactForm";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

export function ContactMotion() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_500px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE_EXPO }}
      >
        <Eyebrow>Klaar voor meer marge?</Eyebrow>
        <h2 className="display mt-2 text-[clamp(2.75rem,8vw,5.5rem)] leading-tight">
          Krijg een voorstel voor jouw salon
        </h2>
        <p className="mt-6 text-lg text-muted">
          Vul het formulier in. We kijken direct naar jouw huidige situatie, rekenen je exacte besparing voor en
          plannen een korte online demonstratie.
        </p>

        <motion.div
          className="mt-10 border-2 border-ink bg-paper p-6 shadow-brutal space-y-3 font-mono text-sm transition-shadow hover:shadow-brutal-lg"
          whileHover={{ y: -3, transition: { duration: 0.18, ease: "easeOut" } }}
        >
          <p className="font-bold">Studio Maaijen</p>
          <p className="text-muted">Ridderkerk, Nederland</p>
          <p>
            E-mail:{" "}
            <a href="mailto:info@studio-maaijen.nl" className="font-bold underline underline-offset-4">
              info@studio-maaijen.nl
            </a>
          </p>
          <p>
            Website:{" "}
            <a
              href="https://www.studio-maaijen.nl"
              target="_blank"
              rel="noreferrer"
              className="font-bold underline underline-offset-4"
            >
              www.studio-maaijen.nl
            </a>
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.15, ease: EASE_EXPO }}
      >
        <ContactForm />
      </motion.div>
    </div>
  );
}
