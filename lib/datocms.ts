/**
 * DatoCMS-laag met resilient fallback.
 * - Geen DATOCMS_API_TOKEN → mock-data.
 * - Fout/timeout bij DatoCMS → mock-data (en een waarschuwing in de log).
 */
import "server-only";
import { cache } from "react";
import { salonMock } from "@/data/salon-mock.ts";
import type {
  OpeningHours,
  SalonData,
  SalonService,
  SalonServiceCategory,
  SalonSetting,
  SalonStaff,
  Weekday,
} from "@/types/salon.ts";

const ENDPOINT = "https://graphql.datocms.com/";

export const SALON_QUERY = /* GraphQL */ `
  query SalonData {
    salonSetting {
      name
      tagline
      address
      email
      phone
      bufferMinutes
      depositAmountCents
      slotIntervalMinutes
      openingHours
    }
    allSalonServiceCategories(orderBy: sortOrder_ASC, first: 100) {
      id
      title
      slug
      sortOrder
    }
    allSalonServices(first: 100) {
      id
      name
      category { id }
      priceCents
      durationMinutes
      description
      isPopular
    }
    allSalonStaffs(first: 100) {
      id
      name
      role
      avatar { url alt width height }
      email
      calendarId
      isActive
      workingDays
    }
  }
`;

interface DatoResponse {
  salonSetting: Partial<SalonSetting> & { openingHours?: unknown } | null;
  allSalonServiceCategories: SalonServiceCategory[];
  allSalonServices: (Omit<SalonService, "categoryId"> & { category: { id: string } | null })[];
  allSalonStaffs: (Omit<SalonStaff, "workingDays"> & { workingDays?: unknown })[];
}

function parseOpeningHours(raw: unknown): OpeningHours | null {
  if (!raw || typeof raw !== "object") return null;
  return raw as OpeningHours;
}

function parseWorkingDays(raw: unknown): Weekday[] {
  if (Array.isArray(raw)) return raw.map(Number).filter((d) => d >= 0 && d <= 6) as Weekday[];
  if (typeof raw === "string" && raw.trim()) {
    return raw.split(",").map((d) => Number(d.trim())).filter((d) => d >= 0 && d <= 6) as Weekday[];
  }
  return [0, 1, 2, 3, 4, 5, 6];
}

async function fetchFromDato(token: string): Promise<SalonData> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: SALON_QUERY }),
    next: { revalidate: 60, tags: ["datocms"] },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`DatoCMS ${res.status}`);
  const json = (await res.json()) as { data?: DatoResponse; errors?: unknown[] };
  if (json.errors?.length || !json.data) throw new Error(`DatoCMS: ${JSON.stringify(json.errors)}`);

  const d = json.data;
  const fallback = salonMock.settings;
  const s = d.salonSetting ?? {};

  return {
    source: "datocms",
    settings: {
      ...fallback,
      ...Object.fromEntries(Object.entries(s).filter(([, v]) => v !== null && v !== undefined)),
      openingHours: parseOpeningHours(s.openingHours) ?? fallback.openingHours,
    } as SalonSetting,
    categories: d.allSalonServiceCategories,
    services: d.allSalonServices.map(({ category, ...rest }) => ({
      ...rest,
      categoryId: category?.id ?? "",
      description: rest.description ?? "",
      isPopular: Boolean(rest.isPopular),
    })),
    staff: d.allSalonStaffs.map((st) => ({
      ...st,
      avatar: st.avatar?.url
        ? { ...st.avatar, alt: st.avatar.alt ?? st.name }
        : { url: `/staff/${st.name.toLowerCase()}.svg`, alt: `Portret van ${st.name}` },
      workingDays: parseWorkingDays(st.workingDays),
    })),
  };
}

/** Haalt alle salondata op (gecached per request). */
export const getSalonData = cache(async (): Promise<SalonData> => {
  const token = process.env.DATOCMS_API_TOKEN;
  if (!token) return salonMock;
  try {
    return await fetchFromDato(token);
  } catch (err) {
    console.warn("[studiochair] DatoCMS niet bereikbaar, val terug op mock-data:", err);
    return salonMock;
  }
});
