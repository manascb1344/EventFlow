import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from '../providers/providers';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "EventFlow | Event management and ticketing",
    template: "%s | EventFlow",
  },
  description: "Create, manage, and sell tickets for events with EventFlow.",
  openGraph: {
    title: "EventFlow",
    description: "Create, manage, and sell tickets for events with EventFlow.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        inter.className, poppins.variable,
        "min-h-screen bg-[#0a0c10] relative overflow-x-hidden antialiased",
      )}>
        <div className="relative">
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  )
}
