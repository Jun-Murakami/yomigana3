import type { Metadata } from 'next';
import { M_PLUS_1_Code } from 'next/font/google';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import Script from 'next/script';
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
  title: 'よみがなコンバーター | 歌詞の漢字をひらがなに変換',
  description:
    '歌詞テキストの漢字をひらがなに一括変換。DTM・ボーカロイド・譜面ソフト対応。無料でオフライン動作。',
  keywords: [
    'よみがな',
    'ひらがな',
    'カタカナ',
    '変換',
    '歌詞',
    'DTM',
    'ボーカロイド',
    '譜面',
    '無料',
    'オンラインツール',
  ],
  authors: [{ name: 'Jun Murakami' }],
  creator: 'Jun Murakami',
  publisher: 'Jun Murakami',
  metadataBase: new URL('https://yomiganaconverterreact.web.app/'),
  alternates: {
    canonical: 'https://yomiganaconverterreact.web.app/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'よみがなコンバーター | 歌詞の漢字をひらがなに変換',
    description:
      '歌詞テキストの漢字をひらがなに一括変換し、スペースを挿入します。DTM・ボーカロイド・譜面ソフト対応。無料でオフライン動作。',
    url: 'https://yomiganaconverterreact.web.app/',
    siteName: 'よみがなコンバーター',
    images: [
      {
        url: '/images/yomigana_ogp.png',
        width: 1200,
        height: 630,
        alt: 'よみがなコンバーター - 歌詞の漢字をひらがなに変換',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'よみがなコンバーター | 歌詞の漢字をひらがなに変換',
    description:
      '歌詞テキストの漢字をひらがなに一括変換し、スペースを挿入します。DTM・ボーカロイド・譜面ソフト対応。無料でオフライン動作。',
    images: ['/images/yomigana_ogp.png'],
    creator: '@junmurakami',
  },
  verification: {
    google: 'your-google-verification-code', // Google Search Console の認証コード
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9605694766716751"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* must come before the <main> element */}
        <InitColorSchemeScript attribute="class" />
        <ThemeRegistry>{children}</ThemeRegistry>
        <GoogleAnalytics gaId="G-94NSTE4CKF" />
      </body>
    </html>
  );
}
