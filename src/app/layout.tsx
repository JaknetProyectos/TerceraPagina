import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

// METADATA REAL DE VIVATRIP
export const metadata: Metadata = {
  title: "Wonder MX - Vive México",
  description: "En WonderMX creemos que viajar es mucho más que moverse de un lugar a otro: es vivir experiencias que despiertan los sentidos, conectan con la cultura y dejan recuerdos inolvidables.",
  keywords: ["México", "Turismo", "Viajes", "Experiencias", "Fútbol"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // No definimos lang aquí porque lo hará el layout dinámico
    <html suppressHydrationWarning>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      {children}
    </html>
  );
}