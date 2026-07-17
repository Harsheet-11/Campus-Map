import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import Providers from "@/providers";


export const metadata: Metadata = {
  title: "NITR Campus",
  description: "Your campus story starts here",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}