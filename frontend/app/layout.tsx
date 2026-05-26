import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WattWise — Energy Intelligence",
  description: "Find out if you're overpaying for energy. Upload your utility bill and get instant AI-powered insights.",
  keywords: ["energy", "utility bills", "electricity", "savings", "AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ background: "#0A0F1E", color: "#F1F5F9" }}>
        {children}
      </body>
    </html>
  );
}
