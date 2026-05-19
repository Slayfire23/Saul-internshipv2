import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Summarist Home Page",
  description: "A responsive Summarist landing page built with Next.js.",
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
