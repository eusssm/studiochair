import "server-only";
import type { WizardData } from "@/components/booking/types";
import type { SalonData } from "@/types/salon.ts";

/** Strip gevoelige velden (e-mail, agenda-ID's) voordat data naar de browser gaat. */
export function toWizardData(d: SalonData): WizardData {
  const { name, tagline, address, phone, depositAmountCents, bookingHorizonDays, timeZone, openingHours } = d.settings;
  return {
    settings: { name, tagline, address, phone, depositAmountCents, bookingHorizonDays, timeZone, openingHours },
    categories: d.categories,
    services: d.services,
    staff: d.staff.filter((s) => s.isActive).map(({ id, name, role, avatar, workingDays }) => ({ id, name, role, avatar, workingDays })),
  };
}
