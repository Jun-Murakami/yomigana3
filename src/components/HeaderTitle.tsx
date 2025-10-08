import * as React from 'react';
import { Typography, Stack, Button, Box } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { MaterialUISwitch } from './DarkModeSwitch';

/**
 * 画面上部のタイトル表示。
 */
export function HeaderTitle(): React.ReactElement {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      // アドセンスが見切れないよう、少し上にオフセットしてスクロール
      const rect = aboutSection.getBoundingClientRect();
      const scrollTop = window.pageYOffset + rect.top - 160; // 200px上にオフセット
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  };

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
      
      {/* スマホサイズでのみ表示されるボタンとスイッチ */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 2 }}>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="outlined"
            size="small"
            onClick={handleScrollToAbout}
            sx={{
              minWidth: 'auto',
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
            }}
          >
            使い方
          </Button>
          {mounted && (
            <MaterialUISwitch
              checked={mode === 'dark'}
              onChange={() => setMode(mode === 'dark' ? 'light' : 'dark')}
            />
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
