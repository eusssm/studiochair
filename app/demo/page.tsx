import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSlots } from "@/lib/availability.ts";
import { getSalonData } from "@/lib/datocms.ts";
import { duration, euro, longDate } from "@/lib/format.ts";
import { addDays, zonedParts } from "@/lib/time.ts";
import type { SalonData, Weekday } from "@/types/salon.ts";
import { Arrow, Badge, Eyebrow } from "@/components/ui";
import { DemoBanner } from "@/components/demo/DemoBanner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Demo — Atelier Eugène op StudioChair",
  description: "Ervaar de 0% commissie salon website en boekingsplanner van StudioChair in actie.",
};

const DAYS: [Weekday, string][] = [
  [1, "Maandag"],
  [2, "Dinsdag"],
  [3, "Woensdag"],
  [4, "Donderdag"],
  [5, "Vrijdag"],
  [6, "Zaterdag"],
  [0, "Zondag"],
];

async function nextFreeChair(data: SalonData) {
  const svc = data.services.find((s) => s.isPopular) ?? data.services[0];
  if (!svc) return null;
  const today = zonedParts(new Date(), data.settings.timeZone).date;
  try {
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      const slots = await getSlots(data, { date, durationMinutes: svc.durationMinutes, staffId: "any" });
      if (slots.length) return { date, slot: slots[0], isToday: i === 0, isTomorrow: i === 1 };
    }
  } catch {
    /* agenda niet bereikbaar → geen teaser */
  }
  return null;
}

const ctaClass =
  "brutal-press inline-flex min-h-14 items-center justify-center gap-3 px-6 font-mono text-[0.95rem] font-bold uppercase tracking-wide";

export default async function DemoPage() {
  const data = await getSalonData();
  const { settings } = data;
  const next = await nextFreeChair(data);
  const cats = [...data.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const [first, ...rest] = settings.name.split(" ");

  return (
    <>
      <DemoBanner />

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-14 focus:z-50 focus:bg-signal focus:p-3 focus:font-bold">
        Naar inhoud
      </a>

      {/* ── Nav ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Hoofdmenu">
          <Link href="/demo" className="display text-2xl">
            {settings.name}
          </Link>
          <div className="flex items-center gap-6">
            <ul className="hidden gap-6 font-mono text-sm font-bold uppercase md:flex">
              <li><a href="#prijzen" className="underline-offset-4 hover:underline">Prijzen</a></li>
              <li><a href="#team" className="underline-offset-4 hover:underline">Team</a></li>
              <li><a href="#info" className="underline-offset-4 hover:underline">Info</a></li>
            </ul>
            <Link href="/boeken" className={`${ctaClass} min-h-11 bg-signal px-4 text-sm shadow-brutal-sm`}>
              Boek <span className="hidden sm:inline">een stoel</span> <Arrow className="size-4" />
            </Link>
          </div>
        </nav>
      </header>

      <main id="main">
        {/* ── Hero ────────────────────────────────────────── */}
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:items-end lg:pt-16">
          <div>
            <Eyebrow>{settings.address} — Barbershop & Salon</Eyebrow>
            <h1 className="display mt-4 text-[clamp(3.75rem,20vw,13rem)]">
              {first}
              <br />
              <span className="relative inline-block">
                {rest.join(" ")}
                <span aria-hidden className="absolute -bottom-1 left-0 -z-10 h-[0.28em] w-full bg-signal" />
              </span>
            </h1>
            <p className="mt-6 max-w-md text-xl leading-snug">
              {settings.tagline}. Geen wachtrij, geen gedoe — kies je behandeling, je kapper en je tijd. Klaar.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/boeken" className={`${ctaClass} bg-signal`}>
                Claim je stoel <Arrow />
              </Link>
              <a href="#prijzen" className={`${ctaClass} bg-card`}>
                Bekijk prijzen
              </a>
            </div>
          </div>

          {next && (
            <Link
              href="/boeken"
              className="brutal-press block rotate-1 bg-card p-5 shadow-brutal-lg transition-transform hover:rotate-0"
            >
              <div className="flex items-center justify-between">
                <Eyebrow className="text-ink">Eerstvolgende stoel</Eyebrow>
                <span className="relative flex size-3" aria-hidden>
                  <span className="absolute inline-flex size-full animate-ping bg-signal opacity-75" />
                  <span className="relative inline-flex size-3 border-2 border-ink bg-signal" />
                </span>
              </div>
              <p className="display mt-4 text-7xl tabular-nums">{next.slot.time}</p>
              <p className="mt-2 font-bold">
                {next.isToday ? "Vandaag" : next.isTomorrow ? "Morgen" : longDate(next.date)} · bij {next.slot.staffName}
              </p>
              <p className="mt-4 flex items-center gap-2 border-t-2 border-ink pt-3 font-mono text-sm font-bold uppercase">
                Pak &apos;m <Arrow className="size-4" />
              </p>
            </Link>
          )}
        </section>

        {/* ── Marquee ─────────────────────────────────────── */}
        <div className="overflow-hidden border-y-2 border-ink bg-signal py-3" aria-hidden>
          <div className="marquee-track flex w-max">
            {[0, 1].map((k) => (
              <p key={k} className="display flex shrink-0 gap-8 pr-8 text-4xl">
                {["Skin fades", "Balayage", "Beard trims", "Precision cuts", "Kids cuts", "Geen wachtrij"].map((w) => (
                  <span key={w} className="flex items-center gap-8">
                    {w} <span className="text-card">✦</span>
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>

        {/* ── Prijzen ─────────────────────────────────────── */}
        <section id="prijzen" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <Eyebrow>Prijslijst</Eyebrow>
          <h2 className="display mt-2 text-[clamp(3rem,12vw,7rem)]">Wat we fiksen</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {cats.map((c) => (
              <div key={c.id} className="border-2 border-ink bg-card shadow-brutal">
                <h3 className="display border-b-2 border-ink bg-ink px-5 py-3 text-3xl text-white">{c.title}</h3>
                <ul className="divide-y-2 divide-ink">
                  {data.services
                    .filter((s) => s.categoryId === c.id)
                    .map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/boeken?service=${s.id}`}
                          className="group flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-signal focus-visible:bg-signal"
                        >
                          <span>
                            <span className="flex flex-wrap items-center gap-2 font-bold">
                              {s.name}
                              {s.isPopular && <Badge className="group-hover:bg-card">Populair</Badge>}
                            </span>
                            <span className="mt-1 block text-sm text-muted group-hover:text-ink">{s.description}</span>
                          </span>
                          <span className="shrink-0 text-right font-mono text-sm font-bold tabular-nums">
                            <span className="block text-base">{euro(s.priceCents, { short: true })}</span>
                            <span className="block text-muted group-hover:text-ink">{duration(s.durationMinutes)}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Team ────────────────────────────────────────── */}
        <section id="team" className="scroll-mt-20 border-y-2 border-ink bg-card">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <Eyebrow>Het team</Eyebrow>
            <h2 className="display mt-2 text-[clamp(3rem,12vw,7rem)]">Wie pakt de schaar</h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-3">
              {data.staff
                .filter((s) => s.isActive)
                .map((s, i) => (
                  <li key={s.id} className={`border-2 border-ink shadow-brutal bg-paper ${i % 2 ? "sm:translate-y-6" : ""}`}>
                    <div className="relative aspect-square border-b-2 border-ink">
                      {s.avatar && (
                        <Image src={s.avatar.url} alt={s.avatar.alt} fill unoptimized={s.avatar.url.endsWith(".svg")} sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
                      )}
                    </div>
                    <div className="p-5">
                      <p className="display text-4xl sm:text-3xl lg:text-5xl truncate">{s.name}</p>
                      <p className="mt-1 text-muted">{s.role}</p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </section>

        {/* ── Info + CTA ──────────────────────────────────── */}
        <section id="info" className="mx-auto grid max-w-6xl scroll-mt-20 gap-8 px-4 py-20 sm:px-6 md:grid-cols-2">
          <div className="border-2 border-ink bg-card shadow-brutal p-6">
            <h2 className="display text-5xl">Open</h2>
            <dl className="mt-5 divide-y-2 divide-dashed divide-ink/30 font-mono text-sm">
              {DAYS.map(([wd, label]) => {
                const shifts = settings.openingHours[wd] ?? [];
                return (
                  <div key={wd} className="flex justify-between gap-4 py-2">
                    <dt className="font-bold uppercase">{label}</dt>
                    <dd className="text-right tabular-nums">
                      {shifts.length ? `${shifts[0].start}–${shifts.at(-1)!.end}` : <span className="text-muted">dicht</span>}
                      {shifts.some((s) => s.label === "avond") && <Badge className="ml-2">koopavond</Badge>}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-5 border-t-2 border-ink pt-4">
              <strong>{settings.address}</strong>
              <br />
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="font-mono underline underline-offset-4">
                {settings.phone}
              </a>
            </p>
          </div>

          <div className="border-2 border-ink flex flex-col justify-between bg-ink p-6 text-white shadow-[8px_8px_0_0_var(--color-signal)]">
            <h2 className="display text-[clamp(3.5rem,11vw,6rem)]">
              Klaar met <span className="text-signal">wachten?</span>
            </h2>
            <div className="mt-8">
              <p className="mb-5 text-white/85">Boek in 4 tikken. Direct bevestigd, meteen in je agenda.</p>
              <Link href="/boeken" className={`${ctaClass} w-full border-white bg-signal text-ink shadow-[4px_4px_0_0_#fff]`}>
                Stoel claimen <Arrow />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-ink">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-4 py-6 font-mono text-xs uppercase sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {settings.name}</p>
          <p className="text-muted">
            Live Showcase: <strong className="text-ink">StudioChair</strong> by Studio Maaijen — 0% commissie
          </p>
        </div>
      </footer>
    </>
  );
}
