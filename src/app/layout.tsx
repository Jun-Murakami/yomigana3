import type { Metadata } from 'next';
import { M_PLUS_1_Code } from 'next/font/google';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
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
  description: 'DTMメロディ譜面＆ボカロ歌詞入力支援ツール',
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
      </body>
    </html>
  );
}
