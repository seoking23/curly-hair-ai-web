import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Curly Hair AI - Expert Hair Analysis & Personalized Care",
  description: "Get professional curly hair analysis powered by AI. Upload photos for personalized curl pattern assessment, porosity testing, and custom hair care routines.",
  keywords: "curly hair, hair analysis, AI hair expert, curl pattern, hair porosity, hair care routine",
  authors: [{ name: "Curly Hair AI" }],
  icons: {
    icon: '/curly-hair-silhouette.png',
    shortcut: '/curly-hair-silhouette.png',
    apple: '/curly-hair-silhouette.png',
  },
  openGraph: {
    title: "Curly Hair AI - Expert Hair Analysis",
    description: "Professional AI-powered curly hair analysis and personalized care recommendations",
    type: "website",
    images: [
      {
        url: '/curly-hair-images/hair_type_4c.jpg',
        width: 1200,
        height: 630,
        alt: 'Curly Hair AI - Professional hair analysis and care',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curly Hair AI - Expert Hair Analysis',
    description: 'Professional AI-powered curly hair analysis and personalized care recommendations',
    images: ['/curly-hair-images/hair_type_4c.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
