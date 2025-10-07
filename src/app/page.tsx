'use client';

import * as React from 'react';
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Stack,
} from '@mui/material';
import { HeaderTitle } from '@/components/HeaderTitle';
import { TextAreas } from '@/components/TextAreas';
import { OptionToggles, type OptionState } from '@/components/OptionToggles';
import { Footer } from '@/components/Footer';
import { BannerAd } from '@/components/AdSense';
import { convertToHiraganaSegments } from '@/lib/convert';
import { toggleHeE, toggleWaHa } from '@/lib/toggles';
import { readFromClipboard, writeToClipboard } from '@/utils/clipboard';

export default function Page(): React.ReactElement {
  // 入出力テキスト
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  // オプション状態
  const [opts, setOpts] = React.useState<OptionState>({
    keepEnglish: true,
    keepKatakana: true,
    connectYouon: true,
    connectSokuon: true,
    splitWithHalfSpace: true,
  });

  // ローディング表示
  const [loading, setLoading] = React.useState(false);

  // 変換実行
  const handleConvert = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await convertToHiraganaSegments(input, opts);
      setOutput(result);
    } finally {
      setLoading(false);
    }
  }, [input, opts]);

  // クリア（入力欄のみ）
  const handleClear = React.useCallback(() => {
    setInput('');
  }, []);

  // クリップボード
  const handlePaste = React.useCallback(async () => {
    const text = await readFromClipboard();
    if (text != null) setInput(text);
  }, []);

  const handleCopy = React.useCallback(async () => {
    await writeToClipboard(output);
  }, [output]);

  // は↔わ, へ↔え（双方向トグル）
  const handleToggleWa = React.useCallback(() => {
    setOutput((prev) => toggleWaHa(prev));
  }, []);

  const handleToggleHe = React.useCallback(() => {
    setOutput((prev) => toggleHeE(prev));
  }, []);

  // 改行削除
  const handleRemoveNewLines = React.useCallback(() => {
    setOutput((prev) => prev.replace(/\r?\n/g, ''));
  }, []);

  // ショートカット
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMeta = e.ctrlKey || e.metaKey;
      if (isMeta && e.key === 'Enter') {
        e.preventDefault();
        void handleConvert();
      } else if (isMeta && e.shiftKey && (e.key === 'V' || e.key === 'v')) {
        e.preventDefault();
        void handlePaste();
      } else if (isMeta && (e.key === 'B' || e.key === 'b')) {
        e.preventDefault();
        void handleCopy();
      } else if (e.altKey && (e.key === 'W' || e.key === 'w')) {
        e.preventDefault();
        handleToggleWa();
      } else if (e.altKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        handleToggleHe();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleConvert, handleCopy, handlePaste, handleToggleHe, handleToggleWa]);

  // アプリ起動時に辞書を先読みして体感待ち時間を削減
  React.useEffect(() => {
    // 失敗しても画面に影響しないように握りつぶす
    import('@/lib/kuroshiroLoader').then((m) =>
      m.getKuroshiro().catch(() => undefined),
    );
  }, []);

  return (
    <Container maxWidth="xl">
      <HeaderTitle />
      <TextAreas
        input={input}
        output={output}
        onChangeInput={setInput}
        onChangeOutput={setOutput}
        // 左側のボタン
        onConvert={handleConvert}
        onClear={handleClear}
        onPaste={handlePaste}
        // 右側のボタン
        onToggleWa={handleToggleWa}
        onToggleHe={handleToggleHe}
        onRemoveNewLines={handleRemoveNewLines}
        onCopy={handleCopy}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <OptionToggles
          {...opts}
          onChange={(p) => setOpts((prev) => ({ ...prev, ...p }))}
        />
      </Box>

      {/* 広告エリア */}
      <BannerAd slot="5500365657" />

      <Footer />

      <Backdrop
        open={loading}
        sx={{ color: '#fff', zIndex: (t) => t.zIndex.modal + 1 }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress color="inherit" />
          解析中...
        </Stack>
      </Backdrop>
    </Container>
  );
}
