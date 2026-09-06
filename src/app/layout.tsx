import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Quality Training",
  description:
    "Quality, Automotive Core Tools and Continuous Improvement Training Platform",

  openGraph: {
    title: "Quality Training",
    description:
      "Quality, Automotive Core Tools and Continuous Improvement Training Platform",
    url: "https://bei-quality-training.vercel.app/",
    siteName: "Quality Training",
    images: [
      {
        url: "/og_bei.png",
        width: 800,
        height: 450,
        alt: "PT Bumjin Electronics Indonesia - Quality Training",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Quality Training",
    description:
      "Quality, Automotive Core Tools and Continuous Improvement Training Platform",
    images: ["/og_bei.png"],
  },

  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}