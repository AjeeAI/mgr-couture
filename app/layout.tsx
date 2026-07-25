import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-display-body", // Mapped as --font-body in your css
  display: "swap",
});

export const metadata: Metadata = {
  title: "MGR COUTURE | Own Your Style",
  description: "Bespoke elegance, precise tailoring, and timely delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.variable} ${inter.variable} antialiased selection:bg-secondary/30 selection:text-secondary`}>
        {children}
      </body>
    </html>
  );
}