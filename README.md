# StudioChair

*Maximale stoelbezetting, 0% commissie.* — een product van Studio Maaijen.

Headless afsprakenplanner + salonwebsite (Next.js 16 · Tailwind v4 · Framer Motion · Zustand · Zod), in de **Fris Neo-Brutalism**-stijl. Draait direct op mock-data; DatoCMS, Google Calendar, Mollie en Resend schakelen automatisch in zodra je de sleutels invult.

## Starten (3 commando's)

Open Terminal in deze map en plak:

```bash
npm install
npm run dev
```

Ga naar **http://localhost:3000** (website) of **http://localhost:3000/boeken** (boekingswizard).

Overige commando's: `npm test` (slot-algoritme + .ics), `npm run build` (productiebuild), `npm run lint` (TypeScript-check).

## Wat zit waar

| Map / bestand | Wat |
|---|---|
| `app/page.tsx` | Salon-homepage: hero met live "eerstvolgende stoel", prijslijst, team, openingstijden |
| `app/boeken/` | De 4-staps wizard (`/boeken?service=skin-fade` springt direct naar stap 2) + `klaar/` voor terugkomst na iDEAL |
| `components/booking/` | `BookingWizard`, `StepService`, `StepStaff`, `StepDateTime`, `StepCustomer`, `BookingConfirmation`, `Summary` ("de bon"), Zustand-`store` |
| `components/emails/BookingConfirmationEmail.tsx` | React Email-template (bekijken: `npx email dev --dir components/emails`) |
| `app/globals.css` | **Design tokens** — kleuren, fonts, harde schaduwen, `brutal-press` knop-utility |
| `types/salon.ts` | Alle interfaces (`SalonSetting`, `SalonService`, `SalonStaff`, `TimeSlot`, `BookingRequest`, …) |
| `data/salon-mock.ts` | Demo-salon "Atelier Eugène": 4 categorieën, 8 behandelingen, 3 kappers, openingstijden |
| `lib/datocms.ts` | GraphQL-query + automatische fallback naar mock-data |
| `lib/slots.ts` | Het beschikbaarheidsalgoritme (puur, getest) |
| `lib/availability.ts` | Koppelt algoritme aan agenda (Google of mock) |
| `lib/bookings.ts` | Boekingsflow: race-lock → aanbetaling → agenda-event → mail met .ics |
| `lib/google.ts` · `lib/mollie.ts` · `lib/calendar.ts` | Google Calendar (service account), Mollie iDEAL, .ics-generator |

## API

- `GET /api/availability?date=2026-11-05&serviceId=skin-fade&staffId=marcus|any`
- `GET /api/availability/week?from=2026-11-02&days=7&serviceId=…&staffId=…` → vrije plekken per dag (voor de dagkiezer)
- `POST /api/bookings` → `{ bookingCode, status, checkoutUrl? }` · 409 als de stoel net gekaapt is
- `GET /api/bookings/BK-12345` → status (na Mollie-redirect)
- `POST /api/webhooks/mollie` → bevestigt na betaling

## Slot-regels (`lib/slots.ts`)

- Een afspraak claimt `duur + buffer` (10 min) en moet volledig binnen één shift vallen (lunch 13:00–13:30 blijft vrij).
- Collision: `T + duur + buffer ≤ A.start` of `T ≥ A.end + buffer` — de buffer geldt dus ook ná een bestaande afspraak.
- Raster van `slot_interval_minutes` (15), niets binnen `leadTimeMinutes` (60) van nu, max `bookingHorizonDays` (28) vooruit.
- "Eerste beschikbare" = unie over alle kappers; bij gelijke tijd krijgt de minst bezette kapper de klant.

## Live zetten: sleutels

Kopieer `.env.example` naar `.env.local` en vul in wat je hebt. Alles is optioneel.

| Variabele | Effect als ingevuld | Zonder |
|---|---|---|
| `DATOCMS_API_TOKEN` | Content uit DatoCMS | mock-data |
| `GOOGLE_SERVICE_ACCOUNT_*` | Echte bezetting + afspraak in kappersagenda | nep-afspraken + in-memory |
| `MOLLIE_API_KEY` | iDEAL-aanbetaling vóór bevestiging | aanbetaling overgeslagen (demo) |
| `RESEND_API_KEY` | Bevestigingsmail + .ics | gelogd in de terminal |

### DatoCMS-modellen

Zoals in `STUDIOCHAIR.md` §2, met drie kleine uitbreidingen:

- `SalonSetting.opening_hours` (JSON) — bv. `{"2":[{"start":"09:00","end":"13:00","label":"ochtend"},{"start":"13:30","end":"17:30","label":"middag"}]}` (0 = zondag). Leeg = standaard uit de mock.
- `SalonStaff.working_days` (JSON-array of tekst `"2,3,4,5,6"`).
- (optioneel) `lead_time_minutes`, `booking_horizon_days` — anders defaults.

## Bekende grenzen (bewust)

- Boekingen zonder Google Calendar staan **in het geheugen** van de server: prima voor demo's, niet voor productie op Vercel. Met Google Calendar is de agenda de bron van waarheid; voor extra zekerheid later een database (Postgres/Upstash) toevoegen in `lib/store.ts`.
- Mollie-webhooks werken niet op `localhost` — test die via een deploy of ngrok.
- WhatsApp-herinneringen (24u vooraf) zijn nog niet gebouwd; de .ics bevat wel een alarm 24u van tevoren.
