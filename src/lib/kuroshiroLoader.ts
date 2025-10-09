// kuroshiroLoader
// - 初回のみ動的 import で `kuroshiro` と `kuroshiro-analyzer-kuromoji` を読み込みます。
// - kuromoji の辞書ファイルは `public/kuromoji/dict` 配下に配置する前提です。
// - 2回目以降の呼び出しは同一インスタンスを返して重複初期化を避けます。

import type Kuroshiro from 'kuroshiro';

let cached: Kuroshiro | null = null;

/**
 * Kuroshiro インスタンスを取得します。
 * - 非同期に動的 import し、kuromoji アナライザで初期化します。
 */
export async function getKuroshiro(): Promise<Kuroshiro> {
  if (cached) return cached;

  // 動的 import で初回ロード時のみ読み込みコストを払う
  const [{ default: KuroshiroClass }, { default: KuromojiAnalyzer }] =
    await Promise.all([
      import('kuroshiro'),
      import('kuroshiro-analyzer-kuromoji'),
    ]);

  const ks = new KuroshiroClass();
  await ks.init(
    new KuromojiAnalyzer({
      // KuromojiAnalyzer のコンストラクタは dictPath を受け取る（19行目参照）
      // 内部で kuromoji.builder({ dicPath: this._dictPath }) に渡される（39行目）
      // Next.js の public 配下: /public/kuromoji/dict/* → ブラウザから /kuromoji/dict/*
      dictPath: '/kuromoji/dict/',
    }),
  );
  cached = ks;
  return ks;
}
