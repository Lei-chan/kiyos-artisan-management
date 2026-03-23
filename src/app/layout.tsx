import type { Metadata } from "next";
import "./globals.css";
import { BASE_URL } from "./lib/config";

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
