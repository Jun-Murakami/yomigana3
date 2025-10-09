'use client';

import { MusicNote, Speed, Translate } from '@mui/icons-material';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';

export function AboutSection(): React.ReactElement {
  return (
    <Box sx={{ my: 4 }} id="about-section">
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <MusicNote color="primary" />
          よみがなコンバーターについて
        </Typography>
        <Typography variant="body1" paragraph>
          よみがなコンバーターは、歌詞テキストの漢字をひらがなに一括変換し、間にスペースを挿入する無料のオンラインツールです。
          DTM・ボーカロイド・譜面ソフトでの歌詞入力作業を効率化します。
        </Typography>

        <Typography
          variant="h6"
          gutterBottom
          sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Translate color="primary" />
          主な機能
        </Typography>
        <Stack spacing={1} sx={{ ml: 2 }}>
          <Typography variant="body2">• 漢字をひらがなに自動変換</Typography>
          <Typography variant="body2">• 英語・カタカナの保護機能</Typography>
          <Typography variant="body2">• 拗音・促音の結合設定</Typography>
          <Typography variant="body2">• 半角スペースでの区切り</Typography>
          <Typography variant="body2">• は↔わ、へ↔えの相互変換</Typography>
          <Typography variant="body2">
            • オフライン動作（プライバシー保護）
          </Typography>
        </Stack>

        <Typography
          variant="h6"
          gutterBottom
          sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Speed color="primary" />
          使い方
        </Typography>
        <Stack spacing={1} sx={{ ml: 2 }}>
          <Typography variant="body2">
            1. 左側のテキストエリアに歌詞を入力
          </Typography>
          <Typography variant="body2">2. 変換オプションを設定</Typography>
          <Typography variant="body2">
            3. 「変換実行」ボタンをクリック
          </Typography>
          <Typography variant="body2">
            4. 右側に変換結果が表示されます
          </Typography>
          <Typography variant="body2">5. 必要に応じて手動で編集可能</Typography>
        </Stack>

        <Typography
          variant="h6"
          gutterBottom
          sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Translate color="primary" />
          オプション設定の詳細解説
        </Typography>
        <Stack spacing={2} sx={{ ml: 2 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              • カタカナを変換しない
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              チェックが入っていると、カタカナをそのまま出力します。
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              • 拗音(ゃゅょゎぁぃぅぇぉ)を繋げる
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              チェックが入っていると、拗音をスペースで区切らず前の字に繋げます。場面に合わせて使い分けてください。
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              • 促音(っ)を繋げる
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              チェックが入っていると、促音をスペースで区切らず前の字に繋げます。
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              • 半角スペースで分離する
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              このチェックを外すと、スペースで区切らずにすべての文字を繋げます。スペース区切りでの歌詞連続入力に対応していないソフトでも、仮名変換機能のみを使うことができます。このチェックが外れている時、上2つのオプション設定は無効になります。
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              • 英語を半角スペースで分離する
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              チェックが入っていると、英語の各文字間にスペースを挿入します。全体の半角スペース分離設定とは独立して動作し、英語のみを制御します。
            </Typography>
          </Box>
        </Stack>

        <Typography
          variant="h6"
          gutterBottom
          sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Speed color="primary" />
          相互変換機能
        </Typography>
        <Stack spacing={2} sx={{ ml: 2 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              • 「は」←→「わ」相互変換ボタン
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              VOCALOIDやAIシンガーソフトなどで用いられる、発音用表記の切り替えを行います。この機能はテキスト変換実行後でも常に相互に切り替え可能で、歌詞の流しこみ中にチェックボックスをクリックすることで、いつでも「は」と「わ」を見比べながら作業ができます。
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              • 「へ」←→「え」相互変換ボタン
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              同じく、「へ」←→「え」を相互に変換します。
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              • 改行削除ボタン
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              一部のソフトへの対応と、より早く流し込みを行えるように改行を削除します。この機能は取り消しが出来ないので、編集が済んでから実行することをお勧めします。
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          対象ユーザー
        </Typography>
        <Stack spacing={1} sx={{ ml: 2 }}>
          <Typography variant="body2">
            • 音楽ディレクター/プロデューサー
          </Typography>
          <Typography variant="body2">
            • DTM（デスクトップミュージック）制作者
          </Typography>
          <Typography variant="body2">• ボーカロイド楽曲制作者</Typography>
          <Typography variant="body2">• 譜面ソフトユーザー</Typography>
          <Typography variant="body2">
            • 歌詞入力支援が必要な音楽制作者
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          技術仕様
        </Typography>
        <Stack spacing={1} sx={{ ml: 2 }}>
          <Typography variant="body2">
            • クライアントサイド処理（プライバシー保護）
          </Typography>
          <Typography variant="body2">
            • kuroshiro + kuromoji による高精度変換
          </Typography>
          <Typography variant="body2">• オフライン動作対応</Typography>
          <Typography variant="body2">• レスポンシブデザイン</Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary">
          このツールは無料でご利用いただけます。入力したテキストは外部に送信されず、
          お使いのデバイス内で処理されます。
        </Typography>
      </Paper>
    </Box>
  );
}
