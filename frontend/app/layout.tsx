import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import Providers from "./Providers";
import { WalletProvider } from "../components/WalletContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SUVIDHA — Government Civic Services",
    template: "%s | SUVIDHA",
  },
  description:
    "A unified platform for filing complaints, paying utility bills, requesting government services, and tracking resolutions.",
  keywords: [
    "government",
    "civic services",
    "complaints",
    "utility bills",
    "SUVIDHA",
  ],
  authors: [{ name: "SUVIDHA Platform" }],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0E17" },
  ],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <WalletProvider>
          <Providers>{children}</Providers>
        </WalletProvider>
      </body>
    </html>
  );
}
