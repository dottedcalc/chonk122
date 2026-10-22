import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
