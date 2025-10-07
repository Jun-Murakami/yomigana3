# よみがなコンバーター ver3 開発方針（AGENTS）

本ドキュメントは、旧版（CRA）アプリの仕様を継承しつつ、Next.js 15 + MUI v7 を採用して再実装するための「開発の指針」をまとめたものです。外部かな変換APIの終了に伴い、kuroshiro を用いたクライアントサイド変換へ移行します。

- 参考記事（仕様の出典・画面仕様）: [【Webアプリ公開】『読みがなコンバーター』](https://note.com/junmurakami/n/n35cd70b8dc12)
- 旧版ソース: `sankou/` ディレクトリ（ビジネスロジックを流用可能）

---

## 1. プロダクト目標

- 歌詞テキスト（漢字混じり）をひらがな・カタカナへ一括変換し、譜面ソフトへ貼り付けやすい形（スペース区切り可）で出力する超軽量ツール。
- 旧UIと操作感を踏襲（添付スクリーンショット準拠）。
- クラウドAPIへ依存せずオフラインでも機能する（辞書同梱/動的読み込み）。

## 2. 非目標（スコープ外）

- サーバーサイドでの変換処理、ユーザー認証、多言語UI切替、複雑な状態管理やグローバルストア。

## 3. 技術スタックと方針

- フレームワーク: Next.js 15（App Router）
  - クライアントオンリーの静的サイトとして `output: 'export'` を前提に構築（SSR/Edge は不要）。
- UI: MUI v7（`@mui/material` + `@mui/icons-material`）
  - スタイリングは `sx` を基本。必要に応じて `styled` を補助的に使用。
  - 余白/レイアウトは MUI の `Stack`, `Container`, `Grid` を優先。
- かな変換: `kuroshiro` + 形態素解析器 `kuromoji`（`kuroshiro-analyzer-kuromoji`）
  - 初回アクセス時に動的 import で読み込み（バンドル肥大と初期表示遅延を両立）
  - 解析辞書は CDN または同梱を選択可（既定は同梱/動的読込）
- 状態管理: `useState` のみ（コンテキスト未使用）
- 品質: TypeScript, Biome（リポジトリに `biome.json` あり）
- デプロイ: Firebase Hosting（旧版と置換）

## 4. 画面とコンポーネント

単一ページ構成。中央寄せの 2 カラム（左: 変換前、右: 変換後）+ 下部操作バー。

- Header: タイトル「よみがなコンバーター」
- LeftPane: 入力テキスト `TextField`（multiline）
- RightPane: 変換結果 `TextField`（multiline, readOnly）
- Actions:
  - 変換実行, クリア, クリップボードからペースト, クリップボードへコピー
  - ［は］↔［わ］ トグル, ［へ］↔［え］ トグル, 改行削除
- Options（Switch/Checkbox）:
  - 英語を変換しない
  - カタカナを変換しない
  - 拗音（ゃゅょゎぁぃぅぇぉ）を繋げる
  - 促音（っ）を繋げる
  - 半角スペースで分離する（OFF なら完全連結）

推奨コンポーネント分割（`src/components`）

- `HeaderTitle.tsx`（ロゴ/タイトル）
- `TextAreas.tsx`（左右のテキストエリア）
- `ActionButtons.tsx`（主要ボタン群）
- `OptionToggles.tsx`（スイッチ/チェックボックス群）
- `Footer.tsx`（クレジットとサポートリンク）

## 5. 変換仕様（決定事項）

1) ひらがな変換

- `kuroshiro.convert(text, { to: 'hiragana', mode: 'normal' })` を基本とし、語単位のスペースは付与しない。
- 変換後、アプリ独自ロジックで文字単位の区切りを行い、オプション（拗音/促音の結合、半角スペース分離）を適用する。

2) 英語/カタカナの扱い

- 「英語を変換しない」が ON の場合、`[A-Za-z0-9'\-]` 等で検出した ASCII ブロックを保護し未変換で通す。
- 「カタカナを変換しない」が ON の場合、`/\p{Script=Katakana}/u` を目安に保護し、他は通常変換。

3) ［は］↔［わ］、［へ］↔［え］の相互変換

- 変換は結果テキスト上で実施する。
- 「元は『は』→『わ』に変えた箇所のみ」を正確に復元するため、トグル適用時に位置インデックスのマスク（Set<number>）を保持する。
- 同様に「へ↔え」でも独立したマスクを保持し、往復で破綻しないようにする。

4) 改行削除

- 実行時に `\r?\n` を全削除。取り消し不可のワンショット操作として扱う。

5) スペース付与

- 「半角スペースで分離する」ON の場合のみ、最終的に区切りスペースを挿入。
- OFF の場合は完全連結（オプション「拗音/促音を繋げる」は無効化）。

## 6. 実装ガイド（サンプルコード）

> 注意: 以下は ver3 の方針を具体化するためのサンプルです。実装時は `src/lib` 配下に整理してください。コメントは保守のために詳細に付与しています。

```ts
// src/lib/kuroshiroLoader.ts
// - 初回のみ動的 import で kuroshiro と kuromoji アナライザを読み込む。
// - 形態素解析辞書はパブリック配下に同梱（例: /kuromoji/dict/）。
// - 辞書の配置を変える場合は dicPath を合わせること。

import type Kuroshiro from 'kuroshiro';

let kuroshiroInstance: Kuroshiro | null = null;

export async function getKuroshiro(): Promise<Kuroshiro> {
  if (kuroshiroInstance) return kuroshiroInstance;

  const [{ default: KuroshiroClass }, { default: KuromojiAnalyzer }] = await Promise.all([
    import('kuroshiro'),
    import('kuroshiro-analyzer-kuromoji'),
  ]);

  const kuro = new KuroshiroClass();
  await kuro.init(new KuromojiAnalyzer({
    // public/kuromoji/dict に辞書を配置する想定
    dicPath: '/kuromoji/dict',
  }));
  kuroshiroInstance = kuro;
  return kuro;
}
```

```ts
// src/lib/convert.ts
// - 入力文字列をひらがなに変換し、アプリ固有の区切りロジックを適用する。
// - 設定オプションの組合せに応じて、スペース区切り/連結を制御する。

export type ConvertOptions = {
  keepEnglish: boolean; // 英語を変換しない
  keepKatakana: boolean; // カタカナを変換しない
  connectYouon: boolean; // 拗音を繋げる
  connectSokuon: boolean; // 促音(っ)を繋げる
  splitWithHalfSpace: boolean; // 半角スペースで分離する
};

const YOUON = new Set(['ゃ','ゅ','ょ','ゎ','ぁ','ぃ','ぅ','ぇ','ぉ']);
const SOKUON = 'っ';

// 英数記号ブロック（簡易）。必要に応じて調整。
const ASCII_BLOCK = /[A-Za-z0-9'\-]+/g;

export async function convertToHiraganaSegments(
  input: string,
  options: ConvertOptions,
): Promise<string> {
  const { getKuroshiro } = await import('./kuroshiroLoader');
  const kuro = await getKuroshiro();

  // 1) 保護対象の退避（英語/カタカナ）
  //    変換前にプレースホルダへ退避し、変換後に戻す。
  type Slot = { key: string; value: string };
  const slots: Slot[] = [];
  let work = input;

  // 英語保護
  if (options.keepEnglish) {
    work = work.replace(ASCII_BLOCK, (m) => {
      const key = `__ENG_${slots.length}__`;
      slots.push({ key, value: m });
      return key;
    });
  }

  // カタカナ保護（Unicode Script=Katakana をざっくり）
  if (options.keepKatakana) {
    work = work.replace(/([\p{Script=Katakana}ー]+)/gu, (m) => {
      const key = `__KATA_${slots.length}__`;
      slots.push({ key, value: m });
      return key;
    });
  }

  // 2) kuroshiro でひらがな化
  const hira = await kuro.convert(work, { to: 'hiragana', mode: 'normal' });

  // 3) プレースホルダを復元
  let restored = hira;
  for (const s of slots) {
    restored = restored.replaceAll(s.key, s.value);
  }

  // 4) 文字単位に分割し、拗音/促音の結合とスペース区切りを適用
  if (!options.splitWithHalfSpace) {
    // 完全連結（オプションは無効）
    return restored.replace(/\s+/g, '');
  }

  const chars = Array.from(restored.replace(/\s+/g, ''));
  const out: string[] = [];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const prev = out[out.length - 1] ?? '';

    // 促音を直前に結合
    if (options.connectSokuon && ch === SOKUON && out.length > 0) {
      out[out.length - 1] = prev + ch;
      continue;
    }

    // 拗音を直前に結合
    if (options.connectYouon && YOUON.has(ch) && out.length > 0) {
      out[out.length - 1] = prev + ch;
      continue;
    }

    out.push(ch);
  }

  return out.join(' ');
}
```

```ts
// src/lib/toggles.ts
// - ［は］↔［わ］／［へ］↔［え］トグルの往復整合性を保つためのマスク実装例。

export type ToggleMask = {
  // トグルで変更したインデックスの集合（復元時にのみ影響）
  waMask: Set<number>;
  heMask: Set<number>;
};

export function toggleWaHa(text: string, mask: ToggleMask, toWa: boolean): string {
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (toWa) {
      if (ch === 'は') { chars[i] = 'わ'; mask.waMask.add(i); }
    } else {
      // 変更履歴のある位置だけ『わ→は』へ戻す。元から『わ』だった箇所は維持。
      if (ch === 'わ' && mask.waMask.has(i)) { chars[i] = 'は'; mask.waMask.delete(i); }
    }
  }
  return chars.join('');
}

export function toggleHeE(text: string, mask: ToggleMask, toE: boolean): string {
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (toE) {
      if (ch === 'へ') { chars[i] = 'え'; mask.heMask.add(i); }
    } else {
      if (ch === 'え' && mask.heMask.has(i)) { chars[i] = 'へ'; mask.heMask.delete(i); }
    }
  }
  return chars.join('');
}
```

## 7. キーボードショートカット（推奨）

- Ctrl/Cmd + Enter: 変換実行
- Ctrl/Cmd + Shift + V: クリップボードから貼り付け
- Ctrl/Cmd + B: 変換後をクリップボードへコピー
- Alt + W: ［は］↔［わ］切替
- Alt + E: ［へ］↔［え］切替

## 8. アクセシビリティ

- すべてのトグルに `aria-label` を付与し、読み上げに配慮。
- テキストフィールドは `aria-labelledby` と見出し連携。
- コントラストは MUI テーマの `contrastThreshold` を適切化。

## 9. パフォーマンス指針

- kuroshiro/kuromoji の読み込みはユーザー操作時（初回変換ボタン押下）に遅延実行。
- 解析中は `Backdrop` + `CircularProgress` を表示。
- 重い処理が懸念される場合は Web Worker 化を検討（将来項目）。

## 10. ディレクトリ構成（提案）

```
src/
  app/
    page.tsx            // 1ページ構成
    layout.tsx
  components/
    HeaderTitle.tsx
    TextAreas.tsx
    ActionButtons.tsx
    OptionToggles.tsx
    Footer.tsx
  lib/
    kuroshiroLoader.ts  // 動的ロードと初期化
    convert.ts          // 変換＆区切りロジック
    toggles.ts          // は/わ・へ/えトグル
  utils/
    clipboard.ts        // クリップボード読み書き
public/
  kuromoji/dict/...     // 形態素解析辞書（同梱）
```

## 11. コーディング規約

- TypeScript 厳格モード。推論可能なローカル変数には型注釈を過剰に付けない。
- 早期 return を多用し、ネストを浅く保つ。不要な try/catch は禁止。
- 変数名/関数名は説明的に（例: `connectYouon`, `toggleWaHa`）。
- スタイルは MUI の `sx` で記述し、ロジックと分離。
- フォーマッタ/リンタは Biome に従う。

## 12. ローカル開発

1. 依存の追加（後続実装時）

```
npm i @mui/material @mui/icons-material @emotion/react @emotion/styled
npm i kuroshiro kuroshiro-analyzer-kuromoji
```

2. 開発起動

```
npm run dev
```

## 13. デプロイ（Firebase Hosting）

- Next.js を静的書き出し（`next.config.ts` に `output: 'export'`）。
- `next build && next export` の出力（`out/`）を Hosting へ配備。
- 旧版の URL をそのまま差し替え。

例（`firebase.json` 抜粋）

```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}
```

## 14. 既存コードの流用ポイント（`sankou/`）

- UI 配置やボタン/トグルのラベル、基本的な入出力フロー。
- 英語/カタカナ保護、拗音/促音結合のルール（アルゴリズムは本ドキュメントの実装方針へ移植）。

## 15. 既知の注意点

- kuromoji 辞書のサイズが大きいため、初回変換が重く感じられることがある。進捗表示と一度ロードしたら再利用するキャッシュで UX を担保する。
- 連続変換時のパフォーマンスを保つため、テキストエリアの `onChange` での都度変換は行わず、明示ボタン押下でのみ変換する。

## 16. 今後の拡張候補

- Web Worker 化による解析の非同期化
- ふりがな（ルビ）モードの追加
- 変換履歴/元に戻す（Undo）
- PWA 化（オフライン対応強化）

---

このドキュメントは、ver3 実装の「単一情報源（Single Source of Truth）」です。UI/仕様の曖昧さは上記参考記事の振る舞いを最優先とし、差異が必要な場合は本書に追記してから実装してください。


