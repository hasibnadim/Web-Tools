import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { migrate } from "@/service/mongodb"; 
import CookieConsent from "@/components/CookieConsent";
await migrate();
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "书 حكمة - Shū Hikma",
  description: "Book and Wisdom, the digital library by Eng. Hasib Nadim", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
