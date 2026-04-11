import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "@/components/Providers";
import { site } from "@/lib/site";
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
  metadataBase: new URL(site.canonicalUrl),
  title: site.pageTitle,
  description: site.description,
  verification: {
    google: site.googleSiteVerification,
  },
  openGraph: {
    title: site.pageTitle,
    description: site.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.pageTitle,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "name": site.personName,
                  "url": site.canonicalUrl,
                },
                {
                  "@type": "Person",
                  "name": site.personName,
                  "url": site.canonicalUrl,
                  "jobTitle": site.jobTitle,
                  "description": site.description,
                  "sameAs": [...site.sameAs],
                  "knowsAbout": [...site.knowsAbout],
                  "hasCredential": site.credentials.map((name) => ({
                    "@type": "EducationalOccupationalCredential",
                    name,
                  })),
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
