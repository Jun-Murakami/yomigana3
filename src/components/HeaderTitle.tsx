import type * as React from 'react';
import { Typography, Stack } from '@mui/material';

/**
 * 画面上部のタイトル表示。
 */
export function HeaderTitle(): React.ReactElement {
  return (
    <Stack direction="row" justifyContent="center" sx={{ my: 3 }}>
      <Typography
        component="h1"
        variant="h4"
        sx={{ fontWeight: 700, color: '#6c5ce7' }}
      >
        よみがなコンバーター
      </Typography>
    </Stack>
  );
}
