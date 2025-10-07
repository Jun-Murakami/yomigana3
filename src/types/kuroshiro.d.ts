// kuroshiro の型定義
declare module 'kuroshiro' {
  export default class Kuroshiro {
    init(analyzer: unknown): Promise<void>;
    convert(
      str: string,
      options?: { to?: 'hiragana' | 'katakana' | 'romaji'; mode?: 'normal' | 'spaced' | 'okurigana' | 'furigana' }
    ): Promise<string>;
  }
}

declare module 'kuroshiro-analyzer-kuromoji' {
  export default class KuromojiAnalyzer {
    constructor(options?: { dictPath?: string });
  }
}

