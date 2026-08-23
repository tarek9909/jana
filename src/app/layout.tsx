import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

import prisma from "@/backend/db";

export const metadata: Metadata = {
  title: "Jana Al Aswad Portfolio",
  description: "Bespoke interior architecture and design for sophisticated homes.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } }) || {
    primaryBeige: "#F4EFEA",
    primaryWhite: "#FAFAF9",
    primaryCharcoal: "#1C1B1A",
    primaryAccent: "#8B7E74"
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} font-sans h-full antialiased`}
    >
      <body 
        className="min-h-full flex flex-col bg-primary-white text-charcoal"
        style={{
          "--color-primary-beige-var": settings.primaryBeige || "#F4EFEA",
          "--color-primary-white-var": settings.primaryWhite || "#FAFAF9",
          "--color-charcoal-var": settings.primaryCharcoal || "#1C1B1A",
          "--color-soft-clay-var": settings.primaryAccent || "#8B7E74",
        } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}
