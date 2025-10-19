"use client";

import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata = {
  title: "Portal Karang Taruna Cilosari Barat",
  description: "Portal digital KARTEJI RT01/RW08 - Semarang",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}