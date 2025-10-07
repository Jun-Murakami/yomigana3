// クリップボード ユーティリティ
// - ブラウザの Clipboard API を安全にラップします。

/** クリップボードへテキストを書き込みます。 */
export async function writeToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** クリップボードからテキストを読み込みます。 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    const text = await navigator.clipboard.readText();
    return text ?? "";
  } catch {
    return null;
  }
}


