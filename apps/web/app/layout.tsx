import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Mono, Inter, Instrument_Serif, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { FireflyField } from '@/components/firefly-field';
import { NorthstarMotion } from '@/components/northstar-motion';
import { WebVitalsReporter } from '@/components/web-vitals-reporter';
import { siteConfig } from '@/lib/site';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const bricolageGrotesk = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesk',
  display: 'swap'
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500'],
  display: 'swap'
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'MBMApps | Engineering Growth Platforms',
    template: '%s | MBMApps'
  },
  description: siteConfig.description,
  applicationName: 'MBMApps',
  alternates: {
    canonical: '/'
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' }],
    shortcut: '/icon.svg'
  },
  openGraph: {
    title: 'MBMApps',
    description: siteConfig.description,
    type: 'website',
    url: siteConfig.url,
    siteName: 'MBMApps',
    locale: 'en_US',
    images: [{
      url: '/api/og',
      width: 1200,
      height: 630,
      alt: 'MBMApps purpose-built software and operating systems',
      type: 'image/png'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MBMApps',
    description: siteConfig.description,
    images: [{
      url: '/api/og',
      alt: 'MBMApps purpose-built software and operating systems'
    }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${bricolageGrotesk.variable} ${ibmPlexMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="text-ink antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <FireflyField />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main-content" className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <NorthstarMotion />
        <WebVitalsReporter />
      </body>
    </html>
  );
}
