import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kiyos Cellar & Artisan Mariage Vineyards管理者ページ",
  description: "Kiyos CellarとArtisan Mariage Vineyardsの管理者ページです。",
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
