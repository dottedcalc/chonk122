import type { Metadata } from "next";
import { Gaegu, Nunito } from "next/font/google";
import "./globals.css";

const hand = Gaegu({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-hand" });
const body = Nunito({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "chonk122",
  description: "Interactive explainers for CMU 15-122",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hand.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
