/**
 * React Email template — bevestigingsmail (Neo-Brutalism huisstijl).
 * Voorbeeld bekijken: `npx email dev --dir components/emails`
 */
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface BookingConfirmationEmailProps {
  salonName: string;
  salonAddress: string;
  salonPhone: string;
  customerName: string;
  serviceName: string;
  staffName: string;
  dateLabel: string; // "donderdag 5 november"
  time: string; // "10:15"
  durationLabel: string; // "45 min"
  priceLabel: string; // "€45,-"
  depositLabel?: string; // "€15,00 betaald"
  bookingCode: string;
  manageUrl?: string;
}

const ink = "#0E0E0E";
const paper = "#F5F5F0";
const signal = "#FF4500";
const mono = "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace";
const display = "'Anton', 'Impact', 'Arial Narrow', sans-serif";

export default function BookingConfirmationEmail(p: BookingConfirmationEmailProps) {
  const first = p.customerName.split(" ")[0];
  return (
    <Html lang="nl">
      <Head />
      <Preview>{`Stoel staat vast: ${p.dateLabel} om ${p.time} bij ${p.staffName}`}</Preview>
      <Body style={{ background: paper, margin: 0, padding: "32px 12px", fontFamily: "Helvetica, Arial, sans-serif", color: ink }}>
        <Container style={{ maxWidth: 520, margin: "0 auto" }}>
          <Text style={{ fontFamily: mono, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>
            {p.salonName} × StudioChair
          </Text>
          <Section style={{ background: "#FFFFFF", border: `2px solid ${ink}`, boxShadow: `6px 6px 0 ${ink}`, padding: 28 }}>
            <Text
              style={{
                display: "inline-block",
                background: signal,
                border: `2px solid ${ink}`,
                fontFamily: mono,
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 8px",
                margin: 0,
              }}
            >
              {p.bookingCode}
            </Text>
            <Heading style={{ fontFamily: display, fontSize: 44, lineHeight: "44px", textTransform: "uppercase", margin: "18px 0 8px", letterSpacing: 0.5 }}>
              Stoel staat vast, {first}.
            </Heading>
            <Text style={{ fontSize: 16, lineHeight: "24px", margin: "0 0 20px" }}>
              Je afspraak is binnen. Zet hem in je agenda met de bijlage — wij zien je in de stoel.
            </Text>
            <Hr style={{ borderColor: ink, borderWidth: 1, margin: "0 0 16px" }} />
            {[
              ["Wat", p.serviceName],
              ["Wie", p.staffName],
              ["Wanneer", `${p.dateLabel} · ${p.time}`],
              ["Duur", p.durationLabel],
              ["Prijs", p.priceLabel],
              ...(p.depositLabel ? [["Aanbetaling", p.depositLabel]] : []),
            ].map(([k, v]) => (
              <Text key={k} style={{ margin: "0 0 8px", fontSize: 15 }}>
                <span style={{ fontFamily: mono, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, display: "inline-block", width: 110 }}>
                  {k}
                </span>
                <strong>{v}</strong>
              </Text>
            ))}
            {p.manageUrl && (
              <Button
                href={p.manageUrl}
                style={{
                  marginTop: 20,
                  background: ink,
                  color: "#FFFFFF",
                  fontFamily: mono,
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: "uppercase",
                  padding: "14px 18px",
                  border: `2px solid ${ink}`,
                }}
              >
                Afspraak bekijken →
              </Button>
            )}
          </Section>
          <Text style={{ fontSize: 13, lineHeight: "20px", margin: "20px 0 0" }}>
            Verhinderd? Bel of app ons uiterlijk 24 uur van tevoren: <strong>{p.salonPhone}</strong>.
            <br />
            {p.salonName} · {p.salonAddress}
          </Text>
          <Text style={{ fontFamily: mono, fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, margin: "24px 0 0", opacity: 0.6 }}>
            Geboekt via StudioChair — 0% commissie, 100% salon.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

BookingConfirmationEmail.PreviewProps = {
  salonName: "Atelier Eugène",
  salonAddress: "Ridderkerk, Nederland",
  salonPhone: "+31 180 123 456",
  customerName: "Jan Jansen",
  serviceName: "Skin Fade & Hot Towel",
  staffName: "Marcus",
  dateLabel: "donderdag 5 november",
  time: "10:15",
  durationLabel: "45 min",
  priceLabel: "€45,-",
  depositLabel: "€15,00 betaald via iDEAL",
  bookingCode: "BK-84920",
} satisfies BookingConfirmationEmailProps;
