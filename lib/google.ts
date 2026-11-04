/**
 * Google Calendar-koppeling via een service account (geen extra dependencies).
 *
 * Setup:
 * 1. Google Cloud → maak een service account, download de JSON-key.
 * 2. Zet GOOGLE_SERVICE_ACCOUNT_EMAIL en GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in .env.local
 * 3. Deel de agenda van elke kapper met dat e-mailadres ("Wijzigingen aanbrengen in afspraken").
 * 4. Vul in DatoCMS per kapper het `calendar_id` in (meestal hun Gmail-adres).
 *
 * Alternatief: Cal.com — vervang `getBusyWindows` en `insertEvent` door Cal.com API-calls.
 */
import "server-only";
import { createSign } from "node:crypto";
import type { BusyWindow } from "@/types/salon.ts";
import { zonedParts, zonedToUtc } from "./time.ts";

const SCOPE = "https://www.googleapis.com/auth/calendar";

export function googleEnabled(): boolean {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
}

let cachedToken: { token: string; exp: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.exp > Date.now() + 60_000) return cachedToken.token;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: email,
    scope: SCOPE,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
  });
  if (!res.ok) throw new Error(`Google token ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: json.access_token, exp: Date.now() + json.expires_in * 1000 };
  return json.access_token;
}

/** Busy-vensters (minuten salontijd) van een agenda op een datum, via freeBusy. */
export async function getBusyWindows(calendarId: string, date: string, timeZone: string): Promise<BusyWindow[]> {
  const token = await getAccessToken();
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      timeMin: zonedToUtc(date, "00:00", timeZone).toISOString(),
      timeMax: zonedToUtc(date, "23:59", timeZone).toISOString(),
      timeZone,
      items: [{ id: calendarId }],
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Google freeBusy ${res.status}`);
  const json = (await res.json()) as {
    calendars: Record<string, { busy: { start: string; end: string }[] }>;
  };
  return (json.calendars[calendarId]?.busy ?? []).map((b) => {
    const s = zonedParts(new Date(b.start), timeZone);
    const e = zonedParts(new Date(b.end), timeZone);
    return { start: s.date < date ? 0 : s.minutes, end: e.date > date ? 24 * 60 : e.minutes };
  });
}

export async function insertEvent(input: {
  calendarId: string;
  summary: string;
  description: string;
  startUtc: string;
  endUtc: string;
  timeZone: string;
  location?: string;
}): Promise<string> {
  const token = await getAccessToken();
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(input.calendarId)}/events`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        location: input.location,
        start: { dateTime: input.startUtc, timeZone: input.timeZone },
        end: { dateTime: input.endUtc, timeZone: input.timeZone },
        reminders: { useDefault: true },
      }),
    },
  );
  if (!res.ok) throw new Error(`Google insert ${res.status}: ${await res.text()}`);
  return ((await res.json()) as { id: string }).id;
}
