import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata = {
  title: "Portal KARTEJI",
  description: "Portal Digital Karang Taruna Cilosari Barat RT01/RW08 Semarang",
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