interface Hsl {
  h: number;
  s: number;
  l: number;
}

export function hexToHsl(hex: string): Hsl {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      break;
    case g:
      h = ((b - r) / d + 2) * 60;
      break;
    default:
      h = ((r - g) / d + 4) * 60;
  }

  return { h, s, l };
}

/** True for near-black, near-white, and low-saturation greys — colors that pair with almost anything. */
export function isNeutral({ s, l }: Hsl): boolean {
  return s < 0.15 || l < 0.12 || l > 0.92;
}

function hueDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Scores how well two colors pair, from 0 (clashing) to 1 (great match).
 * Rewards neutrals, analogous hues (~0-40°), and complementary hues (~150-210°);
 * penalizes the awkward middle ground.
 */
export function colorHarmony(hexA: string, hexB: string): number {
  const a = hexToHsl(hexA);
  const b = hexToHsl(hexB);

  if (isNeutral(a) || isNeutral(b)) return 0.9;

  const dist = hueDistance(a.h, b.h);

  if (dist <= 20) return 0.85; // near-identical / monochrome
  if (dist <= 50) return 0.95; // analogous
  if (dist <= 110) return 0.35; // awkward middle ground
  if (dist <= 160) return 0.55; // triadic-ish, workable
  return 0.9; // complementary
}
