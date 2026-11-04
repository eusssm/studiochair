import type { Metadata, Viewport } from "next";
// Fonts zelf-gehost via Fontsource: geen Google-request, werkt offline en is AVG-vriendelijk.
import "@fontsource/anton/400.css";
import "@fontsource-variable/space-grotesk/wght.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import { getSalonData } from "@/lib/datocms.ts";
import "./globals.css";


export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSalonData();
  return {
    title: { default: `${settings.name} — ${settings.tagline}`, template: `%s — ${settings.name}` },
    description: `Boek direct je stoel bij ${settings.name} in ${settings.address}. Kies behandeling, kapper en tijd — klaar.`,
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "32x32" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
  };
}

export const viewport: Viewport = { themeColor: "#F5F5F0", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
