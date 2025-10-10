import { Button, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

export type TextAreasProps = {
  input: string;
  output: string;
  onChangeInput: (v: string) => void;
  onChangeOutput: (v: string) => void;
  // 左側のボタン群
  onConvert: () => void;
  onClear: () => void;
  onPaste: () => void;
  // 右側のボタン群
  onToggleWa: () => void;
  onToggleHe: () => void;
  onRemoveNewLines: () => void;
  onCopy: () => void;
};

/**
 * 左右のテキストエリア。
 * - 左: 歌詞入力（編集可）+ 操作ボタン
 * - 右: 変換結果（編集可）+ 操作ボタン
 */
export function TextAreas(props: TextAreasProps): React.ReactElement {
  const {
    input,
    output,
    onChangeInput,
    onChangeOutput,
    onConvert,
    onClear,
    onPaste,
    onToggleWa,
    onToggleHe,
    onRemoveNewLines,
    onCopy,
  } = props;

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack spacing={1}>
          <Typography variant="h6">■ 歌詞テキスト</Typography>
          <TextField
            multiline
            minRows={3}
            maxRows={18}
            value={input}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => onChangeInput(e.target.value)}
            placeholder="ここに歌詞をペーストしてください"
            sx={{
              backgroundColor: 'background.paper',
            }}
            fullWidth
            slotProps={{
              input: {
                sx: {
                  '& textarea': {
                    overflow: 'auto !important',
                  },
                },
              },
            }}
          />
          {/* 左側ボタン群 */}
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Button variant="contained" color="primary" onClick={onConvert}>
              変換実行
            </Button>
            <Button variant="outlined" onClick={onClear}>
              クリア
            </Button>
            <Button variant="outlined" onClick={onPaste}>
              クリップボードからペースト
            </Button>
          </Stack>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack spacing={1}>
          <Typography variant="h6">■ 変換後テキスト</Typography>
          <TextField
            multiline
            minRows={3}
            maxRows={18}
            value={output}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => onChangeOutput(e.target.value)}
            fullWidth
            sx={{
              backgroundColor: 'background.paper',
            }}
            slotProps={{
              input: {
                sx: {
                  '& textarea': {
                    overflow: 'auto !important',
                  },
                },
              },
            }}
          />
          {/* 右側ボタン群 */}
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Button variant="outlined" onClick={onToggleWa}>
              [は]↔[わ]
            </Button>
            <Button variant="outlined" onClick={onToggleHe}>
              [へ]↔[え]
            </Button>
            <Button variant="outlined" onClick={onRemoveNewLines}>
              改行削除
            </Button>
            <Button variant="outlined" onClick={onCopy}>
              クリップボードへコピー
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
