import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui-custom/Navbar";
import { Footer } from "@/components/ui-custom/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sola Planner — Your Dream Wedding, Effortlessly Planned",
  description: "Plan your perfect wedding with trusted vendors, smart budgeting tools, and a guided checklist — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
