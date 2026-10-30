import Providers from "./QueryProvider";
import { AuthProvider } from "@/context/AuthContext";

import { Cairo, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/mianPageNavbar/navbar/NavbarWrapper";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EVO STORE",
  description: "Discover the latest products at EVO STORE.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cairo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col ">
        <AuthProvider>
          <Providers>
            <NavbarWrapper />
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
