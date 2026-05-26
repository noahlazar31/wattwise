import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wattwise.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WattWise — Stop Overpaying for Electricity",
    template: "%s | WattWise",
  },
  description:
    "Upload your utility bill and AI finds cheaper energy providers near you. Free rate comparison, personalized savings tips, and provider recommendations in under 10 seconds.",
  keywords: [
    "energy bill analysis",
    "cheaper electricity provider",
    "utility bill comparison",
    "electricity rate comparison",
    "lower energy bill",
    "energy savings tips",
    "switch electricity provider",
    "overpaying electricity",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "WattWise — Stop Overpaying for Electricity",
    description:
      "Upload your bill. AI finds cheaper providers near you and shows you exactly how to save. Free, no account needed.",
    siteName: "WattWise",
  },
  twitter: {
    card: "summary_large_image",
    title: "WattWise — Stop Overpaying for Electricity",
    description:
      "Upload your bill. AI finds cheaper providers near you and shows you exactly how to save.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col" style={{ background: "#0A0F1E", color: "#F1F5F9" }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
