/** Zod-schema's — gedeeld door het formulier (client) en de API (server). */
import { z } from "zod";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ongeldige datum");
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Ongeldige tijd");

/** Accepteert 06 12 34 56 78, +31 6 12345678, 0031…, vaste nummers. */
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s\-().]/g, ""))
  .pipe(
    z
      .string()
      .regex(/^(\+|00)?\d{9,15}$/, "Vul een geldig telefoonnummer in")
      .transform((v) => (v.startsWith("00") ? `+${v.slice(2)}` : v.startsWith("0") ? `+31${v.slice(1)}` : v)),
  );

export const customerSchema = z.object({
  name: z.string().trim().min(2, "Hoe mogen we je noemen?").max(80),
  email: z.string().trim().toLowerCase().email("Dat e-mailadres klopt niet"),
  phone: phoneSchema,
  notes: z.string().trim().max(500, "Max. 500 tekens").optional().or(z.literal("")),
});

export const bookingRequestSchema = z.object({
  serviceId: z.string().min(1),
  staffId: z.string().min(1).refine((v) => v !== "any", "Kies een concrete kapper"),
  date,
  time,
  customer: customerSchema,
});

export const availabilityQuerySchema = z.object({
  date,
  serviceId: z.string().min(1),
  staffId: z.string().optional().nullable(),
});

export const weekQuerySchema = z.object({
  from: date,
  days: z.coerce.number().int().min(1).max(31).default(7),
  serviceId: z.string().min(1),
  staffId: z.string().optional().nullable(),
});

export type CustomerInput = z.input<typeof customerSchema>;
