import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saveboard | Saving and Budgeting Dashboard",
  description:
    "Interactive saving and budgeting workspace with dashboard, monthly reporting, goals, and settings.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
