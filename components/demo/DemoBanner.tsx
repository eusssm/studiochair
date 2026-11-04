import Link from "next/link";
import { Arrow } from "../ui";

export function DemoBanner() {
  return (
    <aside
      aria-label="Demo notificatie"
      className="border-b-2 border-ink bg-ink px-4 py-2 text-white sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="flex size-2" aria-hidden>
            <span className="inline-flex size-full animate-ping rounded-full bg-signal opacity-75" />
          </span>
          <span className="font-bold uppercase tracking-wider text-signal">Live Showroom</span>
          <span className="hidden text-white/60 sm:inline">—</span>
          <span className="text-white/85">
            Dit is de demo-kapsalon <strong>Atelier Eugène</strong>, gebouwd op StudioChair.
          </span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-white underline underline-offset-4 hover:text-signal"
        >
          ← Terug naar StudioChair B2B <Arrow className="size-3" />
        </Link>
      </div>
    </aside>
  );
}
