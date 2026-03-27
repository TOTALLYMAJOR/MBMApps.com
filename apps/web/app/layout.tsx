import type { Metadata } from 'next';
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WebVitalsReporter } from '@/components/web-vitals-reporter';
import { siteConfig } from '@/lib/site';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap'
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500'],
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
  openGraph: {
    title: 'MBMApps',
    description: siteConfig.description,
    type: 'website',
    url: siteConfig.url,
    images: [`${siteConfig.url}/api/og?title=MBMApps%20Engineering%20at%20Scale`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MBMApps',
    description: siteConfig.description,
    images: [`${siteConfig.url}/api/og?title=MBMApps%20Engineering%20at%20Scale`]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <body className="text-ink antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <WebVitalsReporter />
      </body>
    </html>
  );
}
