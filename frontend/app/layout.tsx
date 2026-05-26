import type { Metadata } from "next";
import { Geist } from "next/font/google";
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

// Clerk is optional — app works without it until keys are added to Vercel
let ClerkProvider: React.ComponentType<{ children: React.ReactNode }> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    ClerkProvider = require("@clerk/nextjs").ClerkProvider;
  }
} catch {
  // Clerk not available
}

function MaybeClerk({ children }: { children: React.ReactNode }) {
  if (ClerkProvider) return <ClerkProvider>{children}</ClerkProvider>;
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MaybeClerk>
      <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col" style={{ background: "#0A0F1E", color: "#F1F5F9" }}>
          {children}
        </body>
      </html>
    </MaybeClerk>
  );
}
