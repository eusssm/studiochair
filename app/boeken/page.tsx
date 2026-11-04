import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getSalonData } from "@/lib/datocms.ts";
import { toWizardData } from "@/lib/public-data.ts";

export const metadata: Metadata = { title: "Stoel claimen" };

export default async function BoekenPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const [{ service }, data] = await Promise.all([searchParams, getSalonData()]);
  return <BookingWizard data={toWizardData(data)} initialServiceId={service} />;
}
