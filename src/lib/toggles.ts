// toggles
// - ［は］↔［わ］／［へ］↔［え］の相互変換。

export type ToggleMask = {
  waMask: Set<number>; // 使用しない（後方互換性のため保持）
  heMask: Set<number>; // 使用しない（後方互換性のため保持）
};

/**
 * 「は」↔「わ」の双方向トグル。
 * 「は」があれば「わ」に、「わ」があれば「は」に変換。
 */
export function toggleWaHa(text: string): string {
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === "は") {
      chars[i] = "わ";
    } else if (ch === "わ") {
      chars[i] = "は";
    }
  }
  return chars.join("");
}

/**
 * 「へ」↔「え」の双方向トグル。
 * 「へ」があれば「え」に、「え」があれば「へ」に変換。
 */
export function toggleHeE(text: string): string {
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === "へ") {
      chars[i] = "え";
    } else if (ch === "え") {
      chars[i] = "へ";
    }
  }
  return chars.join("");
}



