import type { Metadata } from 'next';
import { M_PLUS_1_Code } from 'next/font/google';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { GoogleAnalytics } from '@next/third-parties/google';
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
  metadataBase: new URL('https://yomiganaconverterreact.web.app/'),
  openGraph: {
    title: 'よみがなコンバーター',
    description: 'DTMメロディ譜面＆ボーカロイド歌詞入力支援ツール',
    url: 'https://yomiganaconverterreact.web.app/',
    siteName: 'よみがなコンバーター',
    images: [
      {
        url: '/images/yomigana_ogp.png',
        width: 1200,
        height: 630,
        alt: 'よみがなコンバーター',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'よみがなコンバーター',
    description: 'DTMメロディ譜面＆ボーカロイド歌詞入力支援ツール',
    images: ['/images/yomigana_ogp.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={mPlus1.variable}>
        {/* must come before the <main> element */}
        <InitColorSchemeScript attribute="class" />
        <ThemeRegistry>{children}</ThemeRegistry>
        <GoogleAnalytics gaId="G-94NSTE4CKF" />
      </body>
    </html>
  );
}
