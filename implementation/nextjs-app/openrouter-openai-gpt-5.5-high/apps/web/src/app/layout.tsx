import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Addition Demo",
  description: "Minimal Next.js application skeleton",
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
