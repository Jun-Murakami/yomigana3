'use client';

import * as React from 'react';
import {
  Box,
  Button,
  CssBaseline,
  createTheme,
  Stack,
  ThemeProvider,
  useColorScheme,
} from '@mui/material';

import { MaterialUISwitch } from './DarkModeSwitch';

// テーマコンテキスト（ダークモード切替用）
const ThemeContext = React.createContext({
  mode: 'light' as 'light' | 'dark',
  toggleMode: () => {},
});

export function useThemeMode() {
  return React.useContext(ThemeContext);
}

function DarkModeToggle(): React.ReactElement {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

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
      direction="row"
      spacing={1}
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1000,
      }}
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
      <MaterialUISwitch
        checked={mode === 'dark'}
        onChange={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      />
    </Stack>
  );
}

export function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const theme = React.useMemo(
    () =>
      createTheme({
        cssVariables: {
          colorSchemeSelector: 'class',
        },
        colorSchemes: {
          light: {
            palette: {
              primary: {
                main: '#6c5ce7',
              },
              background: {
                default: '#f2f2f2',
              },
            },
          },
          dark: {
            palette: {
              primary: {
                main: '#6c5ce7',
              },
              background: {
                default: '#222',
                paper: '#1c1c1c',
              },
            },
          },
        },
        typography: {
          fontFamily: `var(--font-m-plus-1-code), system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, "Noto Sans JP", sans-serif`,
          h6: {
            fontSize: '1.1rem',
            fontWeight: 400,
          },
        },
      }),
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* デスクトップサイズでのみ表示 */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <DarkModeToggle />
      </Box>
      {children}
    </ThemeProvider>
  );
}
