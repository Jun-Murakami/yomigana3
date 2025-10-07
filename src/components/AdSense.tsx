'use client';

import Script from 'next/script';

type AdSenseProps = {
  slot: string;
  style?: React.CSSProperties;
  format?: string;
  responsive?: boolean;
};

export function AdSense({
  slot,
  style,
  format = 'auto',
  responsive = true,
}: AdSenseProps) {
  return (
    <div style={{ textAlign: 'center', margin: '20px 0', ...style }}>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9605694766716751"
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9605694766716751"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
      <Script id={`adsense-${slot}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}

// 広告ユニットの種類別コンポーネント
export function BannerAd({ slot }: { slot: string }) {
  return (
    <AdSense
      slot={slot}
      style={{ width: '100%', height: '90px' }}
      format="horizontal"
    />
  );
}

export function RectangleAd({ slot }: { slot: string }) {
  return (
    <AdSense
      slot={slot}
      style={{ width: '300px', height: '250px', margin: '0 auto' }}
      format="rectangle"
    />
  );
}

export function SidebarAd({ slot }: { slot: string }) {
  return (
    <AdSense
      slot={slot}
      style={{ width: '160px', height: '600px' }}
      format="vertical"
    />
  );
}
