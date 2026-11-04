/**
 * Genereert geldige iCalendar (.ics, RFC 5545) bestanden.
 * Pure functie — werkt in de browser (download) én op de server (e-mailbijlage).
 */

export interface IcsEvent {
  uid: string;
  startUtc: string; // ISO
  endUtc: string; // ISO
  summary: string;
  description?: string;
  location?: string;
  organizerName?: string;
  organizerEmail?: string;
  url?: string;
}

const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function escapeText(v: string) {
  return v.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Vouwt regels op 75 octets (RFC 5545 §3.1). */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let current = "";
  let size = 0;
  for (const ch of line) {
    const len = new TextEncoder().encode(ch).length;
    if (size + len > (out.length ? 74 : 75)) {
      out.push(current);
      current = "";
      size = 0;
    }
    current += ch;
    size += len;
  }
  out.push(current);
  return out.join("\r\n ");
}

export function createIcs(e: IcsEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Studio Maaijen//StudioChair//NL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.uid}`,
    `DTSTAMP:${fmt(new Date().toISOString())}`,
    `DTSTART:${fmt(e.startUtc)}`,
    `DTEND:${fmt(e.endUtc)}`,
    `SUMMARY:${escapeText(e.summary)}`,
    e.description && `DESCRIPTION:${escapeText(e.description)}`,
    e.location && `LOCATION:${escapeText(e.location)}`,
    e.url && `URL:${e.url}`,
    e.organizerEmail && `ORGANIZER;CN=${escapeText(e.organizerName ?? "")}:mailto:${e.organizerEmail}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT24H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(`Morgen: ${e.summary}`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean) as string[];
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** Browser-helper: start een .ics download. */
export function downloadIcs(ics: string, filename: string) {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
