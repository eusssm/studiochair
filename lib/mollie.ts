/**
 * Mollie Payments API (v2) — aanbetaling / no-show borg via iDEAL e.d.
 * Zonder MOLLIE_API_KEY wordt de aanbetaling in demo-modus overgeslagen.
 */
import "server-only";

const API = "https://api.mollie.com/v2";

export function mollieEnabled() {
  return Boolean(process.env.MOLLIE_API_KEY);
}

function headers() {
  return { Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`, "Content-Type": "application/json" };
}

export async function createDepositPayment(input: {
  amountCents: number;
  description: string;
  bookingCode: string;
  siteUrl: string;
}): Promise<{ id: string; checkoutUrl: string }> {
  const isLocal = /localhost|127\.0\.0\.1/.test(input.siteUrl);
  const res = await fetch(`${API}/payments`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      amount: { currency: "EUR", value: (input.amountCents / 100).toFixed(2) },
      description: input.description,
      redirectUrl: `${input.siteUrl}/boeken/klaar?code=${input.bookingCode}`,
      // Mollie kan localhost niet bereiken; gebruik ngrok of deploy voor webhooks.
      ...(isLocal ? {} : { webhookUrl: `${input.siteUrl}/api/webhooks/mollie` }),
      metadata: { bookingCode: input.bookingCode },
      locale: "nl_NL",
    }),
  });
  if (!res.ok) throw new Error(`Mollie ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { id: string; _links: { checkout: { href: string } } };
  return { id: json.id, checkoutUrl: json._links.checkout.href };
}

export async function getPaymentStatus(paymentId: string): Promise<string> {
  const res = await fetch(`${API}/payments/${paymentId}`, { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error(`Mollie ${res.status}`);
  return ((await res.json()) as { status: string }).status;
}
