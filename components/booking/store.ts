"use client";
/** Client state machine van de wizard (Zustand). */
import { create } from "zustand";
import type { BookingResponse, TimeSlot } from "@/types/salon.ts";

export type Step = 0 | 1 | 2 | 3 | 4; // 4 = bevestiging

export interface CustomerDraft {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface WizardState {
  step: Step;
  direction: 1 | -1;
  categoryId: string | null;
  serviceId: string | null;
  staffId: string | null; // "any" | staff id
  date: string | null;
  slot: TimeSlot | null;
  customer: CustomerDraft;
  result: BookingResponse | null;

  goTo: (step: Step) => void;
  next: () => void;
  back: () => void;
  setCategory: (id: string) => void;
  selectService: (id: string) => void;
  selectStaff: (id: string) => void;
  selectDate: (date: string) => void;
  selectSlot: (slot: TimeSlot | null) => void;
  setCustomer: (patch: Partial<CustomerDraft>) => void;
  setResult: (r: BookingResponse) => void;
  reset: () => void;
}

const initial = {
  step: 0 as Step,
  direction: 1 as const,
  categoryId: null,
  serviceId: null,
  staffId: null,
  date: null,
  slot: null,
  customer: { name: "", email: "", phone: "", notes: "" },
  result: null,
};

export const useWizard = create<WizardState>((set, get) => ({
  ...initial,
  goTo: (step) => set({ step, direction: step >= get().step ? 1 : -1 }),
  next: () => set((s) => ({ step: Math.min(4, s.step + 1) as Step, direction: 1 })),
  back: () => set((s) => ({ step: Math.max(0, s.step - 1) as Step, direction: -1 })),
  setCategory: (categoryId) => set({ categoryId }),
  // Andere behandeling of kapper → gekozen tijd is niet meer geldig.
  selectService: (serviceId) => set((s) => (s.serviceId === serviceId ? {} : { serviceId, slot: null })),
  selectStaff: (staffId) => set((s) => (s.staffId === staffId ? {} : { staffId, slot: null })),
  selectDate: (date) => set((s) => (s.date === date ? {} : { date, slot: null })),
  selectSlot: (slot) => set({ slot }),
  setCustomer: (patch) => set((s) => ({ customer: { ...s.customer, ...patch } })),
  setResult: (result) => set({ result, step: 4, direction: 1 }),
  reset: () => set({ ...initial, customer: get().customer }), // gegevens onthouden voor een 2e afspraak
}));
