import type { Metadata } from 'next';
import { M_PLUS_1_Code } from 'next/font/google';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import Script from 'next/script';
import './globals.css';
import { ThemeRegistry } from '@/components/ThemeRegistry';

const mPlus1 = M_PLUS_1_Code({
  variable: '--font-m-plus-1-code',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'よみがなコンバーター',
  description: 'DTMメロディ譜面＆ボーカロイド歌詞入力支援ツール',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-94NSTE4CKF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-94NSTE4CKF');
          `}
        </Script>
      </head>
      <body className={mPlus1.variable}>
        {/* must come before the <main> element */}
        <InitColorSchemeScript attribute="class" />
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
