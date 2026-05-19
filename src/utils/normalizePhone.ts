export function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return "";

  const keypad: Record<string, string> = {
    A: "2",
    B: "2",
    C: "2",
    D: "3",
    E: "3",
    F: "3",
    G: "4",
    H: "4",
    I: "4",
    J: "5",
    K: "5",
    L: "5",
    M: "6",
    N: "6",
    O: "6",
    P: "7",
    Q: "7",
    R: "7",
    S: "7",
    T: "8",
    U: "8",
    V: "8",
    W: "9",
    X: "9",
    Y: "9",
    Z: "9"
  };

  const digits = phone
    .toUpperCase()
    .split("")
    .map((character) => {
      if (/\d/.test(character)) return character;
      return keypad[character] ?? "";
    })
    .join("");

  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }

  return digits;
}
