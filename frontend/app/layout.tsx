import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { BackToTop } from '@/components/common/BackToTop';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { siteConfig } from '@/config/site';

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
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [siteConfig.defaultOgImage],
    type: 'website',
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
          <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">{children}</main>
          <BackToTop />
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
