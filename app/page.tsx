import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow, Badge, Eyebrow } from "@/components/ui";
import { CommissionCalculator } from "@/components/b2b/CommissionCalculator";
import { ContactForm } from "@/components/b2b/ContactForm";

export const metadata: Metadata = {
  title: "StudioChair — Geen 35% Treatwell-tax, slechts een eerlijke micro-fee | Voor Kappers & Salons",
  description:
    "Het high-end boekingsplatform en maatwerk website voor kapsalons en barbershops. Stop met 35% commissie afdragen aan Treatwell. Slechts een eerlijke micro-fee van €0,75 per boeking.",
};

const ctaClass =
  "brutal-press inline-flex min-h-14 items-center justify-center gap-3 px-6 font-mono text-[0.95rem] font-bold uppercase tracking-wide";

export default function B2BHomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-signal focus:p-3 focus:font-bold text-ink"
      >
        Naar inhoud
      </a>

      {/* ── Top Bar ───────────────────────────────────────── */}
      <div className="border-b-2 border-ink bg-ink px-4 py-2 text-white sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs font-mono">
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
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6" aria-label="Hoofdmenu">
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
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:pt-16">
          <div>
            <Eyebrow>Voor Kappers, Barbershops & Hair Stylists</Eyebrow>
            <h1 className="display mt-4 text-[clamp(3.5rem,10.5vw,8.5rem)] leading-[0.88]">
              GEEN 35% COMMISSIE.
              <br />
              <span className="relative inline-block text-ink">
                EEN EERLIJKE MICRO-FEE.
                <span aria-hidden className="absolute -bottom-1 left-0 -z-10 h-[0.3em] w-full bg-signal" />
              </span>
            </h1>
            <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-2xl text-xl leading-relaxed text-ink/90 sm:text-2xl">
                Stop met € 15,- tot € 25,- per nieuwe klant afdragen aan Treatwell. StudioChair levert een <strong>high-end salon-website</strong> en een <strong>4-staps planner</strong> voor slechts <strong>€ 0,75 per boeking</strong>. Zonder wurgcontracten, mét Google Calendar 2-weg synchronisatie en no-show borg.
              </p>
              <div className="flex flex-wrap gap-4 md:flex-col md:items-stretch">
                <Link href="/demo" className={`${ctaClass} bg-signal text-ink shadow-brutal`}>
                  Bekijk Live Demo (Atelier Eugène) <Arrow />
                </Link>
                <a href="#besparing" className={`${ctaClass} bg-card text-ink shadow-brutal`}>
                  Bereken Je Winst ↓
                </a>
              </div>
            </div>
          </div>

          {/* Grand Hero Photo Showcase */}
          <div className="mt-10 sm:mt-12">
            <div className="border-2 border-ink bg-card p-3 sm:p-4 shadow-brutal-lg">
              <div className="relative aspect-[16/10] sm:aspect-[21/9] md:aspect-[16/7] w-full overflow-hidden border-2 border-ink bg-ink">
                <Image
                  src="/images/hero-barber.jpg"
                  alt="Kapper aan het werk in een moderne salon met StudioChair"
                  fill
                  priority
                  sizes="(min-width: 1280px) 1152px, 100vw"
                  className="object-cover object-[center_35%]"
                />
                {/* Top-left sticker */}
                <div className="absolute left-3 top-3 sm:left-5 sm:top-5 border-2 border-ink bg-signal px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-ink shadow-brutal-sm">
                  ⚡ 100% Jouw Vakmanschap
                </div>
                {/* Bottom floating badge */}
                <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 max-w-sm border-2 border-ink bg-paper/95 p-3 sm:p-4 backdrop-blur-sm shadow-brutal-sm">
                  <p className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-signal">Geen Platform-Gijzeling</p>
                  <p className="mt-1 font-sans text-xs sm:text-sm font-bold leading-snug text-ink">
                    Jouw stoel, jouw agenda, 100% jouw winst. Slechts € 0,75 per boeking.
                  </p>
                </div>
                {/* Bottom-right live showroom pill */}
                <div className="hidden sm:flex absolute bottom-5 right-5 items-center gap-2 border-2 border-ink bg-ink px-3 py-1.5 font-mono text-xs font-bold uppercase text-white shadow-brutal-sm">
                  <span className="size-2 rounded-full bg-signal" aria-hidden />
                  <span>Referentie: Atelier Eugène</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid gap-4 border-2 border-ink bg-card p-6 shadow-brutal sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-b-2 border-ink/20 pb-4 sm:border-b-0 sm:border-r-2 sm:pb-0 sm:pr-4">
              <span className="label-mono text-signal">Kosten per stoel</span>
              <p className="display mt-1 text-4xl">€ 0,75</p>
              <p className="font-mono text-xs text-muted">Vanaf €0,50. Geen 35% commissie.</p>
            </div>
            <div className="border-b-2 border-ink/20 pb-4 sm:border-b-0 lg:border-r-2 sm:pb-0 sm:pr-4">
              <span className="label-mono text-signal">No-Show Preventie</span>
              <p className="display mt-1 text-4xl">-85%</p>
              <p className="font-mono text-xs text-muted">Met optionele iDEAL aanbetaling.</p>
            </div>
            <div className="border-b-2 border-ink/20 pb-4 sm:border-b-0 sm:border-r-2 sm:pb-0 sm:pr-4">
              <span className="label-mono text-signal">Agenda Sync</span>
              <p className="display mt-1 text-4xl">2-WEG</p>
              <p className="font-mono text-xs text-muted">Google Calendar koppeling per kapper.</p>
            </div>
            <div>
              <span className="label-mono text-signal">Content Beheer</span>
              <p className="display mt-1 text-4xl">DATOCMS</p>
              <p className="font-mono text-xs text-muted">Prijzen en team live zelf aanpassen.</p>
            </div>
          </div>
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
        <section id="besparing" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <div className="mb-8 max-w-2xl">
            <Eyebrow>Rekenvoorbeeld</Eyebrow>
            <h2 className="display mt-2 text-[clamp(2.75rem,8vw,5.5rem)]">
              Wat bespaar je met de micro-fee?
            </h2>
            <p className="mt-4 text-lg text-muted">
              Treatwell pakt <strong>35% commissie</strong> op elke nieuwe klant plus maandelijkse softwarekosten. Met StudioChair betaal je slechts <strong>€ 0,75 per boeking</strong>. Sleep de sliders en zie direct jouw jaarlijkse winst.
            </p>
          </div>

          <CommissionCalculator />
        </section>

        {/* ── Showroom / Demo Teaser ──────────────────────── */}
        <section id="showroom" className="scroll-mt-20 border-y-2 border-ink bg-card py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
              <div>
                <Eyebrow>Het levende bewijs</Eyebrow>
                <h2 className="display mt-2 text-[clamp(3rem,9vw,6rem)] leading-tight">
                  Ervaar de live showroom: <span className="text-signal">Atelier Eugène</span>
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-muted">
                  We hebben een complete referentie-kapsalon gebouwd om te laten zien hoe snel, stoer en gebruiksvriendelijk StudioChair is voor zowel jouw klanten als jezelf.
                </p>
                <ul className="mt-8 space-y-4 font-mono text-sm">
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center border-2 border-ink bg-signal font-bold text-ink">✓</span>
                    <span><strong>Geen inloggen of gedoe:</strong> Klanten boeken binnen 30 seconden via mobiel of desktop.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center border-2 border-ink bg-signal font-bold text-ink">✓</span>
                    <span><strong>Slimme stoelverdeling:</strong> &apos;Eerste beschikbare&apos; vult automatisch de kapper met de minste bezetting.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center border-2 border-ink bg-signal font-bold text-ink">✓</span>
                    <span><strong>Directe agenda-uitnodiging:</strong> Klant krijgt direct een e-mail en .ics kalender-bestand.</span>
                  </li>
                </ul>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/demo" className={`${ctaClass} bg-signal text-ink shadow-brutal`}>
                    Bekijk de Salon Website →
                  </Link>
                  <Link href="/boeken" className={`${ctaClass} bg-paper text-ink shadow-brutal`}>
                    Test de 4-Staps Planner →
                  </Link>
                </div>
              </div>

              {/* Visual Card */}
              <div className="border-2 border-ink bg-paper p-6 shadow-brutal-lg">
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
              </div>
            </div>
          </div>
        </section>

        {/* ── 4 Harde Voordelen ─────────────────────────────── */}
        <section id="waarom" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <Eyebrow>Waarom StudioChair</Eyebrow>
          <h2 className="display mt-2 text-[clamp(2.75rem,8vw,5.5rem)]">
            Gebouwd voor salons die willen groeien
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="border-2 border-ink bg-card p-6 shadow-brutal sm:p-8">
              <span className="display text-5xl text-signal">01</span>
              <h3 className="display mt-3 text-3xl">Slechts € 0,75 per boeking</h3>
              <p className="mt-3 text-base text-muted">
                Geen 35% commissie over jouw knipbeurten. Je betaalt enkel een fractie van de prijs per succesvolle afspraak. 100% van het behandelbedrag gaat via Mollie iDEAL direct naar jouw eigen rekening.
              </p>
            </div>

            <div className="border-2 border-ink bg-card p-6 shadow-brutal sm:p-8">
              <span className="display text-5xl text-signal">02</span>
              <h3 className="display mt-3 text-3xl">85% Minder No-Shows</h3>
              <p className="mt-3 text-base text-muted">
                Laat klanten optioneel een aanbetaling doen (bijvoorbeeld €15 via iDEAL). Mensen die aanbetalen komen opdagen. De aanbetaling wordt automatisch verrekend bij het afrekenen in de salon.
              </p>
            </div>

            <div className="border-2 border-ink bg-card p-6 shadow-brutal sm:p-8">
              <span className="display text-5xl text-signal">03</span>
              <h3 className="display mt-3 text-3xl">Google Calendar Twee-Weg</h3>
              <p className="mt-3 text-base text-muted">
                Elke kapper heeft zijn eigen Google Agenda. Plan je een tandartsafspraak of privégebeurtenis in je telefoon? Dan sluit dat tijdslot direct automatisch in de planner. Nooit meer dubbel geboekt.
              </p>
            </div>

            <div className="border-2 border-ink bg-card p-6 shadow-brutal sm:p-8">
              <span className="display text-5xl text-signal">04</span>
              <h3 className="display mt-3 text-3xl">DatoCMS Contentbeheer</h3>
              <p className="mt-3 text-base text-muted">
                Prijzen verhogen, nieuwe behandeling toevoegen of een tijdelijke kapper inroosteren? Je regelt het zelf in een eenvoudig, professioneel CMS zonder technische kennis.
              </p>
            </div>
          </div>
        </section>

        {/* ── Vergelijking ─────────────────────────────────── */}
        <section id="vergelijking" className="scroll-mt-20 border-y-2 border-ink bg-card py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Eyebrow>De vergelijking</Eyebrow>
            <h2 className="display mt-2 text-[clamp(2.75rem,8vw,5.5rem)]">
              StudioChair vs. Treatwell
            </h2>

            <div className="mt-10 overflow-x-auto border-2 border-ink shadow-brutal-lg">
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
                  <tr>
                    <td className="p-4 font-bold font-sans sm:p-5">Kosten per nieuwe klant</td>
                    <td className="bg-signal/20 p-4 font-bold text-signal-dark sm:p-5">Vaste micro-fee (€ 0,75)</td>
                    <td className="p-4 sm:p-5 text-error font-bold">35% commissie (€ 15 – € 30 per klant)</td>
                    <td className="p-4 sm:p-5">Abonnement + transactiekosten</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold font-sans sm:p-5">Piekmaanden (bijv. december)</td>
                    <td className="bg-signal/20 p-4 font-bold sm:p-5">Eerlijk: je betaalt enkel die €0,75</td>
                    <td className="p-4 sm:p-5 text-error font-bold">Duizenden euro&apos;s aan commissie kwijt</td>
                    <td className="p-4 sm:p-5">Vaak limieten op aantal boekingen</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold font-sans sm:p-5">Eigendom van klantdata</td>
                    <td className="bg-signal/20 p-4 font-bold sm:p-5">100% van jou</td>
                    <td className="p-4 sm:p-5 text-muted">Eigendom van Treatwell (stuurt concurrent-acties)</td>
                    <td className="p-4 sm:p-5">Opgesloten in hun app</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold font-sans sm:p-5">Design & Uitstraling</td>
                    <td className="bg-signal/20 p-4 font-bold sm:p-5">Uniek Awwwards-ontwerp op maat</td>
                    <td className="p-4 sm:p-5 text-muted">Standaard marketplace grid</td>
                    <td className="p-4 sm:p-5">Generieke saaie widget</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold font-sans sm:p-5">No-show preventie (iDEAL)</td>
                    <td className="bg-signal/20 p-4 font-bold sm:p-5">Direct op jouw Mollie-rekening</td>
                    <td className="p-4 sm:p-5 text-muted">Via Treatwell uitbetaling</td>
                    <td className="p-4 sm:p-5">Soms creditcard-only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Tarieven / Investering ───────────────────────── */}
        <section id="tarieven" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <Eyebrow>Transparante Investering</Eyebrow>
          <h2 className="display mt-2 text-[clamp(2.75rem,8vw,5.5rem)]">
            Eenvoudig & eerlijk verdienmodel
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Geen 35% commissie over jouw zweet en vakmanschap. Je betaalt eenmalig voor het bouwen van jouw maatwerk salon-omgeving en daarna een lage vaste basis plus een micro-fee per boeking.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* Setup Pakket */}
            <div className="border-2 border-ink bg-card p-6 shadow-brutal-lg sm:p-8 flex flex-col justify-between">
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
            </div>

            {/* Maandelijks beheer met Micro-fee */}
            <div className="border-2 border-ink bg-ink p-6 text-white shadow-brutal-lg sm:p-8 flex flex-col justify-between">
              <div>
                <span className="border-2 border-white bg-signal px-2 py-0.5 font-mono text-xs font-bold uppercase text-ink">
                  Lopend Model
                </span>
                <h3 className="display mt-4 text-4xl">Lage Basis + Micro-Fee</h3>
                <p className="mt-2 text-white/80">
                  Zorgeloos online zonder omkijken naar techniek, updates of hosting.
                </p>
                <div className="mt-6 border-y-2 border-white/30 py-4">
                  <p className="display text-4xl text-signal sm:text-5xl">€ 29,- <span className="text-2xl text-white">/mnd</span></p>
                  <p className="mt-1 font-mono text-sm text-white/90">+ slechts <strong className="text-signal">€ 0,75</strong> per voltooide boeking</p>
                </div>
                <ul className="mt-6 space-y-3 font-mono text-sm text-white/90">
                  <li className="flex items-center gap-2">✓ Razendsnelle Vercel Edge hosting & SSL</li>
                  <li className="flex items-center gap-2">✓ 24/7 continue agenda-synchronisatie</li>
                  <li className="flex items-center gap-2">✓ DatoCMS licentie & live beheer</li>
                  <li className="flex items-center gap-2">✓ Geen 35% commissie bij nieuwe klanten</li>
                  <li className="flex items-center gap-2">✓ Directe support van Studio Maaijen</li>
                </ul>
              </div>
              <a href="#contact" className={`${ctaClass} mt-8 w-full border-white bg-card text-ink shadow-[4px_4px_0_0_#fff]`}>
                Start Met StudioChair <Arrow />
              </a>
            </div>
          </div>
        </section>

        {/* ── Contact / Aanvraag ──────────────────────────── */}
        <section id="contact" className="scroll-mt-20 border-t-2 border-ink bg-card py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_500px]">
              <div>
                <Eyebrow>Klaar voor meer marge?</Eyebrow>
                <h2 className="display mt-2 text-[clamp(2.75rem,8vw,5.5rem)] leading-tight">
                  Krijg een voorstel voor jouw salon
                </h2>
                <p className="mt-6 text-lg text-muted">
                  Vul het formulier in. We kijken direct naar jouw huidige situatie, rekenen je exacte besparing voor en plannen een korte online demonstratie.
                </p>

                <div className="mt-10 border-2 border-ink bg-paper p-6 shadow-brutal space-y-3 font-mono text-sm">
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
                    <a href="https://www.studio-maaijen.nl" target="_blank" rel="noreferrer" className="font-bold underline underline-offset-4">
                      www.studio-maaijen.nl
                    </a>
                  </p>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t-2 border-ink bg-paper py-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6 font-mono text-xs uppercase">
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
    </>
  );
}
