/**
 * Lokale fallback-data — StudioChair draait hiermee zonder DatoCMS-token.
 * Vervang/beheer dit later volledig in DatoCMS.
 */
import type { SalonData } from "../types/salon.ts";

export const salonMock: SalonData = {
  source: "mock",
  settings: {
    name: "Atelier Eugène",
    tagline: "Craftsmanship & Editorial Styling",
    address: "Ridderkerk, Nederland",
    email: "hallo@atelier-eugene.nl",
    phone: "+31 180 123 456",
    bufferMinutes: 10,
    depositAmountCents: 1500,
    slotIntervalMinutes: 15,
    leadTimeMinutes: 60,
    bookingHorizonDays: 28,
    timeZone: "Europe/Amsterdam",
    openingHours: {
      // 0 zondag + 1 maandag: dicht
      2: [
        { start: "09:00", end: "13:00", label: "ochtend" },
        { start: "13:30", end: "17:30", label: "middag" },
      ],
      3: [
        { start: "09:00", end: "13:00", label: "ochtend" },
        { start: "13:30", end: "17:30", label: "middag" },
      ],
      4: [
        { start: "09:00", end: "13:00", label: "ochtend" },
        { start: "13:30", end: "17:30", label: "middag" },
        { start: "18:00", end: "21:00", label: "avond" }, // koopavond
      ],
      5: [
        { start: "09:00", end: "13:00", label: "ochtend" },
        { start: "13:30", end: "17:30", label: "middag" },
        { start: "18:00", end: "21:00", label: "avond" },
      ],
      6: [
        { start: "09:00", end: "13:00", label: "ochtend" },
        { start: "13:30", end: "16:30", label: "middag" },
      ],
    },
  },
  categories: [
    { id: "cat-heren", title: "Heren", slug: "heren", sortOrder: 1 },
    { id: "cat-dames", title: "Dames & Styling", slug: "dames", sortOrder: 2 },
    { id: "cat-baard", title: "Baard & Care", slug: "baard", sortOrder: 3 },
    { id: "cat-kids", title: "Kids", slug: "kids", sortOrder: 4 },
  ],
  services: [
    {
      id: "skin-fade",
      name: "Skin Fade & Hot Towel",
      categoryId: "cat-heren",
      priceCents: 4500,
      durationMinutes: 45,
      description: "Wassen, fade tot op de huid, stylen en nekcontour met het mes.",
      isPopular: true,
    },
    {
      id: "precision-cut",
      name: "Precision Cut (Klassiek)",
      categoryId: "cat-heren",
      priceCents: 3500,
      durationMinutes: 30,
      description: "Schaar- en tondeusewerk, strak afgewerkt. Inclusief styling.",
      isPopular: false,
    },
    {
      id: "buzz-cut",
      name: "Buzz Cut",
      categoryId: "cat-heren",
      priceCents: 2250,
      durationMinutes: 15,
      description: "Eén lengte, overal. Snel, scherp, klaar.",
      isPopular: false,
    },
    {
      id: "dames-knippen",
      name: "Knippen & Föhnen",
      categoryId: "cat-dames",
      priceCents: 5900,
      durationMinutes: 60,
      description: "Consult, wassen, knippen en föhnen in model.",
      isPopular: true,
    },
    {
      id: "kleuren-uitgroei",
      name: "Uitgroei Kleuren",
      categoryId: "cat-dames",
      priceCents: 7900,
      durationMinutes: 90,
      description: "Uitgroei bijkleuren incl. inwerktijd, wassen en föhnen.",
      isPopular: false,
    },
    {
      id: "balayage",
      name: "Balayage Editorial",
      categoryId: "cat-dames",
      priceCents: 18500,
      durationMinutes: 150,
      description: "Handgeschilderde highlights, toner en blowout. Plan er een middag voor.",
      isPopular: false,
    },
    {
      id: "beard-trim",
      name: "Beard Trim & Line-up",
      categoryId: "cat-baard",
      priceCents: 2500,
      durationMinutes: 30,
      description: "Baard in model, contouren met het mes, baardolie.",
      isPopular: true,
    },
    {
      id: "kids-cut",
      name: "Kids Cut (t/m 12)",
      categoryId: "cat-kids",
      priceCents: 2250,
      durationMinutes: 30,
      description: "Rustig aan, goed resultaat. Ook voor de eerste keer.",
      isPopular: false,
    },
  ],
  staff: [
    {
      id: "marcus",
      name: "Marcus",
      role: "Master Barber",
      avatar: { url: "/staff/marcus.svg", alt: "Portret van Marcus" },
      email: "marcus@atelier-eugene.nl",
      calendarId: "marcus@atelier-eugene.nl",
      isActive: true,
      workingDays: [2, 3, 4, 5, 6],
    },
    {
      id: "sophie",
      name: "Sophie",
      role: "Senior Stylist & Colorist",
      avatar: { url: "/staff/sophie.svg", alt: "Portret van Sophie" },
      email: "sophie@atelier-eugene.nl",
      calendarId: "sophie@atelier-eugene.nl",
      isActive: true,
      workingDays: [2, 3, 4, 6],
    },
    {
      id: "dex",
      name: "Dex",
      role: "Barber & Fade Specialist",
      avatar: { url: "/staff/dex.svg", alt: "Portret van Dex" },
      email: "dex@atelier-eugene.nl",
      calendarId: "dex@atelier-eugene.nl",
      isActive: true,
      workingDays: [3, 4, 5, 6],
    },
  ],
};
