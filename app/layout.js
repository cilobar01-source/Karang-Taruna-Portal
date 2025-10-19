import "./globals.css";
import Providers from "./providers"; // file baru untuk AuthProvider

export const metadata = {
  title: "Portal Karang Taruna Cilosari Barat",
  description: "Portal digital KARTEJI RT01/RW08 - Semarang",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}