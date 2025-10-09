import { Box, FormControlLabel, Switch } from '@mui/material';

export type OptionState = {
  keepKatakana: boolean;
  connectYouon: boolean;
  connectSokuon: boolean;
  splitWithHalfSpace: boolean;
  splitEnglishWithSpace: boolean;
};

export type OptionTogglesProps = OptionState & {
  onChange: (next: Partial<OptionState>) => void;
};

/**
 * 変換オプションのトグル群。
 */
export function OptionToggles(props: OptionTogglesProps): React.ReactElement {
  const {
    keepKatakana,
    connectYouon,
    connectSokuon,
    splitWithHalfSpace,
    splitEnglishWithSpace,
    onChange,
  } = props;
  return (
    <Box
      display="flex"
      justifyContent="space-evenly"
      gap={3}
      flexWrap="wrap"
      sx={{ my: 2.5, width: '95%', maxWidth: '1300px' }}
    >
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={keepKatakana}
            onChange={(_, v) => onChange({ keepKatakana: v })}
          />
        }
        label="カタカナを変換しない"
        sx={{ whiteSpace: 'nowrap' }}
      />
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={connectYouon}
            onChange={(_, v) => onChange({ connectYouon: v })}
          />
        }
        label="拗音(ゃゅょゎぁぃぅぇぉ)を繋げる"
        sx={{ whiteSpace: 'nowrap' }}
      />
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={connectSokuon}
            onChange={(_, v) => onChange({ connectSokuon: v })}
          />
        }
        label="促音(っ)を繋げる"
        sx={{ whiteSpace: 'nowrap' }}
      />
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={splitWithHalfSpace}
            onChange={(_, v) => onChange({ splitWithHalfSpace: v })}
          />
        }
        label="半角スペースで分離する"
        sx={{ whiteSpace: 'nowrap' }}
      />
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={splitEnglishWithSpace}
            onChange={(_, v) => onChange({ splitEnglishWithSpace: v })}
          />
        }
        label="英語を半角スペースで分離する"
        sx={{ whiteSpace: 'nowrap' }}
      />
    </Box>
  );
}
