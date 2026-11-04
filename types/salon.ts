/**
 * StudioChair — domeinmodellen.
 * Spiegelt de DatoCMS-modellen uit STUDIOCHAIR.md §2 (camelCase in code,
 * snake_case API keys in DatoCMS).
 */

/** 0 = zondag … 6 = zaterdag (zoals Date.getDay()) */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Een aaneengesloten werkblok, bv. { start: "09:00", end: "13:00" } */
export interface Shift {
  start: string; // "HH:MM" lokale salontijd
  end: string; // "HH:MM"
  label?: "ochtend" | "middag" | "avond";
}

/** Openingstijden per weekdag. Ontbrekende/lege dag = gesloten. */
export type OpeningHours = Partial<Record<Weekday, Shift[]>>;

export interface SalonSetting {
  name: string;
  tagline: string;
  address: string;
  email: string;
  phone: string;
  /** Schoonmaak/pauze tussen afspraken (default 10) */
  bufferMinutes: number;
  /** Aanbetaling in centen, 0 = geen aanbetaling */
  depositAmountCents: number;
  /** Stapgrootte van het rooster (15 of 30) */
  slotIntervalMinutes: number;
  /** Minimale tijd tussen nu en de eerste boekbare plek */
  leadTimeMinutes: number;
  /** Hoeveel dagen vooruit klanten kunnen boeken */
  bookingHorizonDays: number;
  /** IANA tijdzone van de salon */
  timeZone: string;
  /** Extra DatoCMS JSON-veld `opening_hours` (uitbreiding op de spec) */
  openingHours: OpeningHours;
}

export interface SalonServiceCategory {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
}

export interface SalonService {
  id: string;
  name: string;
  categoryId: string;
  priceCents: number;
  durationMinutes: number;
  description: string;
  isPopular: boolean;
}

export interface SalonImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface SalonStaff {
  id: string;
  name: string;
  role: string;
  avatar: SalonImage | null;
  email: string;
  calendarId: string;
  isActive: boolean;
  /** Extra veld `working_days` — welke dagen deze kapper in de salon staat */
  workingDays: Weekday[];
}

export interface SalonData {
  settings: SalonSetting;
  categories: SalonServiceCategory[];
  services: SalonService[];
  staff: SalonStaff[];
  source: "datocms" | "mock";
}

/** Bezet venster in minuten vanaf middernacht (salontijd). */
export interface BusyWindow {
  start: number;
  end: number;
}

export interface TimeSlot {
  time: string; // "HH:MM"
  staffId: string;
  staffName: string;
}

export interface AvailabilityResponse {
  date: string;
  serviceDuration: number;
  slots: TimeSlot[];
}

export interface DaySummary {
  date: string;
  open: boolean;
  count: number;
}

export interface BookingCustomer {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface BookingRequest {
  serviceId: string;
  staffId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  customer: BookingCustomer;
}

export type BookingStatus = "pending_payment" | "confirmed" | "cancelled" | "expired";

export interface Booking extends BookingRequest {
  code: string;
  status: BookingStatus;
  createdAt: string;
  startUtc: string; // ISO
  endUtc: string; // ISO
  durationMinutes: number;
  priceCents: number;
  depositCents: number;
  paymentId?: string;
  calendarEventId?: string;
  /** Pending boekingen houden de stoel vast tot dit moment */
  holdUntil?: string;
}

export interface BookingResponse {
  bookingCode: string;
  status: BookingStatus;
  checkoutUrl?: string;
  booking: Booking;
}
