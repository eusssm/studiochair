import { test } from "node:test";
import assert from "node:assert/strict";
import { computeSlots, computeStartTimes, isFree } from "../lib/slots.ts";
import { toMinutes, zonedToUtc, weekdayOf } from "../lib/time.ts";
import { createIcs } from "../lib/calendar.ts";
import { salonMock } from "../data/salon-mock.ts";

const m = toMinutes;

test("collision check volgt de spec-formule (met buffer na afspraak)", () => {
  const busy = [{ start: m("10:00"), end: m("10:30") }];
  assert.equal(isFree(m("09:15"), busy, 30, 10), true); // 09:15+40 = 09:55 ≤ 10:00
  assert.equal(isFree(m("09:30"), busy, 30, 10), false); // 10:10 > 10:00
  assert.equal(isFree(m("10:30"), busy, 30, 10), false); // geen buffer na vorige
  assert.equal(isFree(m("10:40"), busy, 30, 10), true);
});

test("slot past volledig binnen een shift (incl. buffer)", () => {
  const times = computeStartTimes({
    shifts: [{ start: "09:00", end: "13:00" }],
    busy: [],
    durationMinutes: 45,
    bufferMinutes: 10,
    intervalMinutes: 15,
  });
  assert.equal(times[0], m("09:00"));
  assert.equal(times.at(-1), m("12:00")); // 12:00 + 55 = 12:55 ≤ 13:00; 12:15 past niet
});

test("lunchpauze wordt niet overboekt", () => {
  const times = computeStartTimes({
    shifts: [
      { start: "09:00", end: "13:00" },
      { start: "13:30", end: "17:30" },
    ],
    busy: [],
    durationMinutes: 30,
    bufferMinutes: 10,
    intervalMinutes: 15,
  });
  assert.ok(!times.some((t) => t > m("12:15") && t < m("13:30")));
});

test("notBefore filtert tijden van vandaag", () => {
  const times = computeStartTimes({
    shifts: [{ start: "09:00", end: "13:00" }],
    busy: [],
    durationMinutes: 30,
    bufferMinutes: 10,
    intervalMinutes: 15,
    notBefore: m("11:05"),
  });
  assert.equal(times[0], m("11:15"));
});

test("eerste beschikbare: unie, één kapper per tijd, minst bezette wint", () => {
  const date = "2026-11-05"; // donderdag
  assert.equal(weekdayOf(date), 4);
  const slots = computeSlots({
    date,
    settings: salonMock.settings,
    staff: salonMock.staff,
    durationMinutes: 30,
    busyByStaff: { marcus: [{ start: m("09:00"), end: m("12:00") }], sophie: [], dex: [{ start: m("09:00"), end: m("09:30") }] },
  });
  const nine = slots.find((s) => s.time === "09:00");
  assert.equal(nine?.staffId, "sophie");
  const times = slots.map((s) => s.time);
  assert.equal(new Set(times).size, times.length);
  assert.ok(times.includes("20:00")); // koopavond donderdag
});

test("kapper die die dag niet werkt geeft geen slots", () => {
  const sophie = salonMock.staff.find((s) => s.id === "sophie")!;
  const slots = computeSlots({ date: "2026-11-06", settings: salonMock.settings, staff: [sophie], durationMinutes: 30, busyByStaff: {} });
  assert.equal(slots.length, 0); // vrijdag
});

test("zonedToUtc houdt rekening met wintertijd/zomertijd", () => {
  assert.equal(zonedToUtc("2026-11-05", "10:15", "Europe/Amsterdam").toISOString(), "2026-11-05T09:15:00.000Z");
  assert.equal(zonedToUtc("2026-07-01", "10:15", "Europe/Amsterdam").toISOString(), "2026-07-01T08:15:00.000Z");
});

test(".ics is geldig gevouwen en ge-escaped", () => {
  const ics = createIcs({
    uid: "BK-1@studiochair",
    startUtc: "2026-11-05T09:15:00.000Z",
    endUtc: "2026-11-05T10:00:00.000Z",
    summary: "Skin Fade, bij Marcus; Atelier Eugène",
    description: "x".repeat(200),
  });
  assert.match(ics, /DTSTART:20261105T091500Z/);
  assert.ok(ics.includes("SUMMARY:Skin Fade\\, bij Marcus\\; Atelier Eugène"));
  for (const line of ics.split("\r\n")) assert.ok(new TextEncoder().encode(line).length <= 75, line);
});
