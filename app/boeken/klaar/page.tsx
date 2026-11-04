import type { Metadata } from "next";
import { PaymentReturn } from "@/components/booking/PaymentReturn";
import { getSalonData } from "@/lib/datocms.ts";
import { toWizardData } from "@/lib/public-data.ts";

export const metadata: Metadata = { title: "Boeking", robots: { index: false } };

/** Landingspagina na de iDEAL-betaling (Mollie redirectUrl). */
export default async function KlaarPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const [{ code }, data] = await Promise.all([searchParams, getSalonData()]);
  return (
    <div className="mx-auto min-h-svh max-w-6xl px-4 py-12 sm:px-6">
      <PaymentReturn code={code ?? ""} data={toWizardData(data)} />
    </div>
  );
}
