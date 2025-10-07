// convert
// - 入力文字列をひらがなに変換し、アプリ固有の区切りロジックを適用します。
// - オプションの組み合わせで、英語/カタカナ保護、拗音/促音の結合、半角スペース分離を制御します。

export type ConvertOptions = {
  keepEnglish: boolean; // 英語を変換しない
  keepKatakana: boolean; // カタカナを変換しない
  connectYouon: boolean; // 拗音を繋げる
  connectSokuon: boolean; // 促音(っ)を繋げる
  splitWithHalfSpace: boolean; // 半角スペースで分離する
};

const YOUON = new Set(["ゃ", "ゅ", "ょ", "ゎ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ"]);
const SOKUON = "っ";

// ASCII英数記号の連なりを簡易検出
const ASCII_BLOCK = /[A-Za-z0-9'\-]+/g;

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

    if (options.keepEnglish) {
      work = work.replace(ASCII_BLOCK, (m) => {
        const key = `__ENG_${slots.length}__`;
        slots.push({ key, value: m });
        return key;
      });
    }

    if (options.keepKatakana) {
      work = work.replace(/([\p{Script=Katakana}ー]+)/gu, (m) => {
        const key = `__KATA_${slots.length}__`;
        slots.push({ key, value: m });
        return key;
      });
    }

    // 2) kuroshiro でひらがな化
    const hira = (await kuro.convert(work, {
      to: "hiragana",
      mode: "normal",
    })) as string;

    // 3) プレースホルダを復元
    let restored = hira;
    for (const s of slots) {
      restored = restored.replaceAll(s.key, s.value);
    }

    // 4) スペース制御
    if (!options.splitWithHalfSpace) {
      // 完全連結（行内のスペースのみ除去、改行は保持）
      convertedLines.push(restored.replace(/\s+/g, ""));
    } else {
      // 半角スペースで分離しつつ、拗音/促音の任意結合を適用
      const chars = Array.from(restored.replace(/\s+/g, ""));
      const out: string[] = [];
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const prev = out[out.length - 1] ?? "";

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
      convertedLines.push(out.join(" "));
    }
  }

  return convertedLines.join("\n");
}



