'use client';

import * as React from 'react';
import { Link, Stack, Typography } from '@mui/material';
import { LicenseDialog } from './LicenseDialog';

export function Footer(): React.ReactElement {
  const [licenseOpen, setLicenseOpen] = React.useState(false);

  return (
    <>
      <Stack alignItems="center" sx={{ my: 3, color: 'text.secondary' }}>
        <Typography variant="body2" sx={{ my: 1 }}>
          Developed by{' '}
          <Link href="https://jun-murakami.com" target="_blank">
            Jun Murakami
          </Link>
          .
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 1,
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Link
            onClick={() =>
              window.open(
                'https://note.com/junmurakami/n/n35cd70b8dc12',
                '_blank',
              )
            }
            component="button"
            sx={{ mx: 1 }}
          >
            解説記事＆ご意見はこちらまで
          </Link>
          |
          <Link
            component="button"
            onClick={() => setLicenseOpen(true)}
            sx={{ cursor: 'pointer', mx: 1 }}
          >
            オープンソースライセンス
          </Link>
          |
          <Link
            component="button"
            onClick={() =>
              window.open('https://github.com/Jun-Murakami/yomigana3', '_blank')
            }
            sx={{ cursor: 'pointer', mx: 1 }}
          >
            GitHub
          </Link>
        </Typography>
        <Typography variant="caption" sx={{ mt: 1 }}></Typography>
      </Stack>

      <LicenseDialog open={licenseOpen} onClose={() => setLicenseOpen(false)} />
    </>
  );
}
