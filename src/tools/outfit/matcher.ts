import { colorHarmony } from './colorUtils';
import {
  OCCASION_FORMALITY_RANGE,
  type ClothingItem,
  type Occasion,
  type Outfit,
  type ScoredOutfit,
  type Season,
} from './types';

function byCategory(items: ClothingItem[], category: ClothingItem['category']) {
  return items.filter((item) => item.category === category);
}

function fitsContext(item: ClothingItem, occasion: Occasion, weather: Season): boolean {
  const [min, max] = OCCASION_FORMALITY_RANGE[occasion];
  if (item.formality < min || item.formality > max) return false;
  return item.seasons.includes(weather);
}

function scoreOutfit(outfit: Outfit, occasion: Occasion): ScoredOutfit {
  const pieces = [outfit.top, outfit.bottom, outfit.shoes, outfit.outerwear, outfit.watch, outfit.accessory].filter(
    (item): item is ClothingItem => Boolean(item),
  );

  const reasons: string[] = [];
  let score = 0;
  let pairs = 0;

  for (let i = 0; i < pieces.length; i++) {
    for (let j = i + 1; j < pieces.length; j++) {
      score += colorHarmony(pieces[i].color, pieces[j].color);
      pairs++;
    }
  }
  const colorScore = pairs > 0 ? score / pairs : 1;

  const boldPieces = pieces.filter((p) => p.pattern === 'bold');
  const patternPenalty = boldPieces.length > 1 ? 0.2 * (boldPieces.length - 1) : 0;
  if (boldPieces.length > 1) {
    reasons.push(`${boldPieces.length} bold patterns competing for attention — consider toning one down`);
  } else if (boldPieces.length === 1) {
    reasons.push(`${boldPieces[0].name} adds a statement pattern, kept in check by solid pieces`);
  }

  const [min, max] = OCCASION_FORMALITY_RANGE[occasion];
  const avgFormality = pieces.reduce((sum, p) => sum + p.formality, 0) / pieces.length;
  const targetFormality = (min + max) / 2;
  const formalityScore = 1 - Math.abs(avgFormality - targetFormality) / 4;

  if (colorScore > 0.8) {
    reasons.push('Colors pair well together');
  } else if (colorScore < 0.5) {
    reasons.push('Colors are a bit of a clash — could work if you like bold contrast');
  }

  const finalScore = colorScore * 0.55 + formalityScore * 0.3 + (1 - patternPenalty) * 0.15;

  return { outfit, score: Math.max(0, Math.min(1, finalScore)), reasons };
}

export function findBestOutfits(
  wardrobe: ClothingItem[],
  occasion: Occasion,
  weather: Season,
  limit = 3,
): ScoredOutfit[] {
  const tops = byCategory(wardrobe, 'top').filter((i) => fitsContext(i, occasion, weather));
  const bottoms = byCategory(wardrobe, 'bottom').filter((i) => fitsContext(i, occasion, weather));
  const shoes = byCategory(wardrobe, 'shoes').filter((i) => fitsContext(i, occasion, weather));
  const outerwear = byCategory(wardrobe, 'outerwear').filter((i) => fitsContext(i, occasion, weather));
  const accessories = byCategory(wardrobe, 'accessory').filter((i) => fitsContext(i, occasion, weather));
  const watches = byCategory(wardrobe, 'watch').filter((i) => fitsContext(i, occasion, weather));

  const results: ScoredOutfit[] = [];

  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const shoe of shoes) {
        const base: Outfit = { top, bottom, shoes: shoe };
        const outerOptions: (ClothingItem | undefined)[] =
          weather === 'cold' || weather === 'rainy' ? outerwear.length ? outerwear : [undefined] : [undefined];
        const accessoryOptions: (ClothingItem | undefined)[] =
          accessories.length ? [undefined, ...accessories] : [undefined];
        const watchOptions: (ClothingItem | undefined)[] = watches.length ? [undefined, ...watches] : [undefined];

        for (const outer of outerOptions) {
          for (const accessory of accessoryOptions) {
            for (const watch of watchOptions) {
              results.push(scoreOutfit({ ...base, outerwear: outer, accessory, watch }, occasion));
            }
          }
        }
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
