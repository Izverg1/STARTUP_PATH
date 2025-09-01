import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Startup_Path™ - Navigate Your Distribution Cosmos",
  description: "Your startup is a space station. Find your orbital channels, achieve escape velocity. AI-powered distribution command center.",
  keywords: "startup, distribution, channels, orbit, space station, AI, command center",
  authors: [{ name: "Startup_Path Mission Control" }],
  openGraph: {
    title: "Startup_Path™",
    description: "Your startup is a space station. Navigate the cosmos of distribution channels.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const uiEnhanced = (process.env.NEXT_PUBLIC_UI_ENHANCED || '').toLowerCase() === 'true'
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased ${uiEnhanced ? 'ui-enhanced' : ''}`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
