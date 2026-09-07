import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { BackToTop } from '@/components/common/BackToTop';
import { FloatingAgent } from '@/components/agent/FloatingAgent';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { getSiteDescription, siteConfig } from '@/config/site';

import './globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: getSiteDescription('zh'),
  openGraph: {
    title: siteConfig.name,
    description: getSiteDescription('zh'),
    url: siteConfig.url,
    images: [siteConfig.defaultOgImage],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: getSiteDescription('zh'),
    images: [siteConfig.defaultOgImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(()=>{try{const t=localStorage.getItem('theme')||'system';const d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=t==='system'?(d?'dark':'light'):t}catch{}})();",
          }}
        />
        <ThemeProvider>
          <SiteHeader />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-5 sm:py-10">{children}</main>
          <BackToTop />
          <FloatingAgent />
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
