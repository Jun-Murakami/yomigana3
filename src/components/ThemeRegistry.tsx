'use client';

import * as React from 'react';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useColorScheme,
} from '@mui/material';
import { Box } from '@mui/material';
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

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <MaterialUISwitch
        checked={mode === 'dark'}
        onChange={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      />
    </Box>
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
          fontFamily: `var(--font-m-plus-1), system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, "Noto Sans JP", sans-serif`,
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
      <DarkModeToggle />
      {children}
    </ThemeProvider>
  );
}
