import type * as React from 'react';
import { Typography, Stack } from '@mui/material';

/**
 * 画面上部のタイトル表示。
 */
export function HeaderTitle(): React.ReactElement {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ my: 3 }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{ fontWeight: 700, color: '#6c5ce7' }}
      >
        よみがなコンバーター
      </Typography>
      <Typography variant="caption" sx={{ color: '#6c5ce7' }}>
        DTMメロディ譜面＆ボーカロイド歌詞入力支援ツール
      </Typography>
    </Stack>
  );
}
