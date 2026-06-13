import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Road Track | Udupi Tourism Platform",
  description:
    "Road Track helps tourists plan Udupi trips with verified resorts, tourist vehicles, packages, WhatsApp enquiries, and emergency support.",
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
