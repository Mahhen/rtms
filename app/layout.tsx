import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Navbar1 } from "@/components/navbar1";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner"

import { ThemeProvider } from "@/components/theme-provider";
import {Providers} from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RailBuddy",
  description: "TODO?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
            >
              {/* ✅ Navbar visible on all pages */}
              <Navbar1 />

              {/* ✅ Each page gets rendered here */}
              {children}

              {/* ✅ Footer visible on all pages */}
              <Footer />
              <Toaster />
            </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
