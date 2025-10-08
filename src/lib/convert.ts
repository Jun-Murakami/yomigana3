// convert
// - 入力文字列をひらがなに変換し、アプリ固有の区切りロジックを適用します。
// - オプションの組み合わせで、英語/カタカナ保護、拗音/促音の結合、半角スペース分離を制御します。

export type ConvertOptions = {
  keepKatakana: boolean; // カタカナを変換しない
  connectYouon: boolean; // 拗音を繋げる
  connectSokuon: boolean; // 促音(っ)を繋げる
  splitWithHalfSpace: boolean; // 半角スペースで分離する
  splitEnglishWithSpace: boolean; // 英語に半角スペースを付ける
};

const YOUON = new Set(["ゃ", "ゅ", "ょ", "ゎ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ"]);
const SOKUON = "っ";
// カタカナの拗音・促音
const KATAKANA_YOUON = new Set(["ャ", "ュ", "ョ", "ヮ", "ァ", "ィ", "ゥ", "ェ", "ォ"]);
const KATAKANA_SOKUON = "ッ";

// ASCII英数記号の連なりを簡易検出（スペースを含む連続した英語ブロック）
const ASCII_BLOCK = /[A-Za-z0-9'-]+(?:\s+[A-Za-z0-9'-]+)*/g;

// 日本語セグメントを処理して文字配列に変換（ひらがな・カタカナ両対応）
function processJapaneseSegment(text: string, options: ConvertOptions): string[] {
  const chars = Array.from(text);
  const out: string[] = [];

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const prev = out[out.length - 1] ?? "";

    // 促音を直前に結合（ひらがな・カタカナ両方）
    if (options.connectSokuon && (ch === SOKUON || ch === KATAKANA_SOKUON) && out.length > 0) {
      out[out.length - 1] = prev + ch;
      continue;
    }

    // 拗音を直前に結合（ひらがな・カタカナ両方）
    if (options.connectYouon && (YOUON.has(ch) || KATAKANA_YOUON.has(ch)) && out.length > 0) {
      out[out.length - 1] = prev + ch;
      continue;
    }

    out.push(ch);
  }

  // 各文字の間にスペースを入れる
  return out.map((char, index) => {
    if (index === 0) return char;
    return `${" "}${char}`;
  });
}

/**
 * 歌詞文字列をひらがなに変換して分割/結合を行う。
 */
export async function convertToHiraganaSegments(
  input: string,
  options: ConvertOptions
): Promise<string> {
  const { getKuroshiro } = await import("./kuroshiroLoader");
  const kuro = await getKuroshiro();

  // 1) 改行を保持するため、行ごとに処理
  const lines = input.split(/\r?\n/);
  const convertedLines: string[] = [];

  for (const line of lines) {
    // 空行はそのまま保持
    if (line.trim() === "") {
      convertedLines.push("");
      continue;
    }

    // 保護対象（英語/カタカナ）をプレースホルダに退避
    type Slot = { key: string; value: string };
    const slots: Slot[] = [];
    let work = line;

    // 英語保護（常に一旦保護して、後で処理を分岐）
    work = work.replace(ASCII_BLOCK, (m) => {
      const key = `__ENG_${slots.length}__`;
      slots.push({ key, value: m });
      return key;
    });


    // カタカナを事前にひらがなに変換（オプションがOFFの場合のみ）
    if (!options.keepKatakana) {
      work = work.replace(/[\p{Script=Katakana}ー]/gu, (char) => {
        // カタカナ→ひらがな変換テーブル（濁点、拗音、促音含む）
        const katakanaToHiragana: { [key: string]: string } = {
          // 基本文字
          'ア': 'あ', 'イ': 'い', 'ウ': 'う', 'エ': 'え', 'オ': 'お',
          'カ': 'か', 'キ': 'き', 'ク': 'く', 'ケ': 'け', 'コ': 'こ',
          'サ': 'さ', 'シ': 'し', 'ス': 'す', 'セ': 'せ', 'ソ': 'そ',
          'タ': 'た', 'チ': 'ち', 'ツ': 'つ', 'テ': 'て', 'ト': 'と',
          'ナ': 'な', 'ニ': 'に', 'ヌ': 'ぬ', 'ネ': 'ね', 'ノ': 'の',
          'ハ': 'は', 'ヒ': 'ひ', 'フ': 'ふ', 'ヘ': 'へ', 'ホ': 'ほ',
          'マ': 'ま', 'ミ': 'み', 'ム': 'む', 'メ': 'め', 'モ': 'も',
          'ヤ': 'や', 'ユ': 'ゆ', 'ヨ': 'よ',
          'ラ': 'ら', 'リ': 'り', 'ル': 'る', 'レ': 'れ', 'ロ': 'ろ',
          'ワ': 'わ', 'ヲ': 'を', 'ン': 'ん',

          // 濁音
          'ガ': 'が', 'ギ': 'ぎ', 'グ': 'ぐ', 'ゲ': 'げ', 'ゴ': 'ご',
          'ザ': 'ざ', 'ジ': 'じ', 'ズ': 'ず', 'ゼ': 'ぜ', 'ゾ': 'ぞ',
          'ダ': 'だ', 'ヂ': 'ぢ', 'ヅ': 'づ', 'デ': 'で', 'ド': 'ど',
          'バ': 'ば', 'ビ': 'び', 'ブ': 'ぶ', 'ベ': 'べ', 'ボ': 'ぼ',

          // 半濁音
          'パ': 'ぱ', 'ピ': 'ぴ', 'プ': 'ぷ', 'ペ': 'ぺ', 'ポ': 'ぽ',

          // 拗音
          'キャ': 'きゃ', 'キュ': 'きゅ', 'キョ': 'きょ',
          'シャ': 'しゃ', 'シュ': 'しゅ', 'ショ': 'しょ',
          'チャ': 'ちゃ', 'チュ': 'ちゅ', 'チョ': 'ちょ',
          'ニャ': 'にゃ', 'ニュ': 'にゅ', 'ニョ': 'にょ',
          'ヒャ': 'ひゃ', 'ヒュ': 'ひゅ', 'ヒョ': 'ひょ',
          'ミャ': 'みゃ', 'ミュ': 'みゅ', 'ミョ': 'みょ',
          'リャ': 'りゃ', 'リュ': 'りゅ', 'リョ': 'りょ',
          'ギャ': 'ぎゃ', 'ギュ': 'ぎゅ', 'ギョ': 'ぎょ',
          'ジャ': 'じゃ', 'ジュ': 'じゅ', 'ジョ': 'じょ',
          'ビャ': 'びゃ', 'ビュ': 'びゅ', 'ビョ': 'びょ',
          'ピャ': 'ぴゃ', 'ピュ': 'ぴゅ', 'ピョ': 'ぴょ',

          // 促音
          'ッ': 'っ',

          // 小文字
          'ァ': 'ぁ', 'ィ': 'ぃ', 'ゥ': 'ぅ', 'ェ': 'ぇ', 'ォ': 'ぉ',
          'ャ': 'ゃ', 'ュ': 'ゅ', 'ョ': 'ょ', 'ヮ': 'ゎ',

          // 長音符
          'ー': 'ー'
        };
        return katakanaToHiragana[char] || char;
      });
    } else {
      // カタカナ保護（オプションがONの場合）
      work = work.replace(/([\p{Script=Katakana}ー]+)/gu, (m) => {
        const key = `__KATA_${slots.length}__`;
        slots.push({ key, value: m });
        return key;
      });
    }

    // 2) kuroshiro でひらがな化（漢字のみ）
    console.log('Before kuroshiro:', work);
    const hira = (await kuro.convert(work, {
      to: "hiragana",
      mode: "normal",
    })) as string;
    console.log('After kuroshiro:', hira);

    // kuroshiroの変換結果から不要なスペースを除去
    const cleanedHira = hira.replace(/\s+/g, '');
    console.log('After cleaning spaces:', cleanedHira);

    // 3) プレースホルダを復元（英語とカタカナは後で処理するので除外）
    let restored = cleanedHira;
    const englishSlots: Slot[] = [];
    const katakanaSlots: Slot[] = [];
    for (const s of slots) {
      if (s.key.startsWith('__ENG_')) {
        englishSlots.push(s);
      } else if (s.key.startsWith('__KATA_')) {
        katakanaSlots.push(s);
      } else {
        restored = restored.replaceAll(s.key, s.value);
      }
    }

    // 4) スペース制御
    if (!options.splitWithHalfSpace) {
      // 完全連結（行内のスペースのみ除去、改行は保持）
      let result = restored.replace(/\s+/g, "");
      // 英語とカタカナを復元（スペースなし）
      for (const s of englishSlots) {
        result = result.replaceAll(s.key, s.value);
      }
      for (const s of katakanaSlots) {
        result = result.split(s.key).join(s.value);
      }
      convertedLines.push(result);
    } else {
      // 半角スペースで分離しつつ、拗音/促音の任意結合を適用

      // まず英語とカタカナのプレースホルダを復元（文字配列化の前に処理）
      let processedText = restored;

      // 英語部分の処理
      if (options.splitEnglishWithSpace) {
        // 英語を文字ごとにスペース区切りで復元（元のスペースは保持）
        for (const s of englishSlots) {
          // スペースで分割して、各単語内の文字をスペース区切りにする
          const words = s.value.split(/\s+/);
          const spacedWords = words.map(word => Array.from(word).join(" "));
          // 単語間は元のスペースを保持（ここでは単一スペースで結合）
          const spacedValue = spacedWords.join(" ");
          processedText = processedText.replaceAll(s.key, spacedValue);
        }
      } else {
        // 英語をそのまま復元
        for (const s of englishSlots) {
          processedText = processedText.replaceAll(s.key, s.value);
        }
      }

      // カタカナ部分の処理（拗音・促音の結合を適用するため個別処理）
      for (const s of katakanaSlots) {
        // カタカナも日本語と同じように文字分割処理
        const katakanaSegments = processJapaneseSegment(s.value, options);
        const katakanaResult = katakanaSegments.join("");
        processedText = processedText.replaceAll(s.key, katakanaResult);
      }

      // 日本語部分のみ文字分割処理
      // テキストを英語ブロックと日本語ブロックに分割
      const segments: string[] = [];
      let lastIndex = 0;

      // 英語ブロックを検出して処理
      const englishMatches = [...processedText.matchAll(/[A-Za-z0-9'-]+(?:\s+[A-Za-z0-9'\-]+)*/g)];

      for (const match of englishMatches) {
        const matchIndex = match.index ?? 0;

        // マッチ前の日本語部分を処理
        if (matchIndex > lastIndex) {
          const japaneseText = processedText.substring(lastIndex, matchIndex);
          if (japaneseText.trim()) {
            segments.push(...processJapaneseSegment(japaneseText, options));
          }
        }

        // 英語部分をそのまま追加（既にスペース処理済み）
        segments.push(match[0]);
        lastIndex = matchIndex + match[0].length;
      }

      // 残りの日本語部分を処理
      if (lastIndex < processedText.length) {
        const japaneseText = processedText.substring(lastIndex);
        if (japaneseText.trim()) {
          segments.push(...processJapaneseSegment(japaneseText, options));
        }
      }

      // セグメントを結合（日本語部分は既にスペース付きで返される）
      const result = segments.join(" ").replace(/\s+/g, " ").trim();
      convertedLines.push(result);
    }
  }

  return convertedLines.join("\n");
}