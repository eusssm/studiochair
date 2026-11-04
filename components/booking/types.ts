import type { SalonService, SalonServiceCategory, SalonSetting, SalonStaff } from "@/types/salon.ts";

/** Wat de browser te zien krijgt — geen e-mailadressen/agenda-ID's van kappers. */
export interface WizardData {
  settings: Pick<
    SalonSetting,
    "name" | "tagline" | "address" | "phone" | "depositAmountCents" | "bookingHorizonDays" | "timeZone" | "openingHours"
  >;
  categories: SalonServiceCategory[];
  services: SalonService[];
  staff: (Pick<SalonStaff, "id" | "name" | "role" | "avatar" | "workingDays">)[];
}
