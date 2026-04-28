import type { Metadata } from "next";
import "./globals.css";
import { BASE_URL } from "./lib/config";
import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

export const metadata: Metadata = {
  title: "Kiyos Cellar & Artisan Mariage Vineyards管理者ページ",
  description: "Kiyos CellarとArtisan Mariage Vineyardsの管理者ページです。",
  metadataBase: new URL(BASE_URL),
  robots: {
    index: false,
  },
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
