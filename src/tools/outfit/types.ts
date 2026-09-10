export type ClothingCategory =
  | 'top'
  | 'bottom'
  | 'shoes'
  | 'outerwear'
  | 'accessory';

export type Pattern = 'solid' | 'subtle' | 'bold';

export type Season = 'hot' | 'mild' | 'cold' | 'rainy';

export type Occasion =
  | 'casual'
  | 'business-casual'
  | 'business-formal'
  | 'formal'
  | 'athletic';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  /** Hex color, e.g. #1f2937 */
  color: string;
  pattern: Pattern;
  /** 1 = very casual, 5 = very formal */
  formality: 1 | 2 | 3 | 4 | 5;
  seasons: Season[];
}

export interface Outfit {
  top?: ClothingItem;
  bottom?: ClothingItem;
  shoes?: ClothingItem;
  outerwear?: ClothingItem;
  accessory?: ClothingItem;
}

export interface ScoredOutfit {
  outfit: Outfit;
  score: number;
  reasons: string[];
}

export const OCCASION_LABELS: Record<Occasion, string> = {
  casual: 'Casual',
  'business-casual': 'Business Casual',
  'business-formal': 'Business Formal',
  formal: 'Formal',
  athletic: 'Athletic',
};

export const OCCASION_FORMALITY_RANGE: Record<Occasion, [number, number]> = {
  casual: [1, 3],
  'business-casual': [2, 4],
  'business-formal': [3, 5],
  formal: [4, 5],
  athletic: [1, 2],
};

export const SEASON_LABELS: Record<Season, string> = {
  hot: 'Hot',
  mild: 'Mild',
  cold: 'Cold',
  rainy: 'Rainy',
};
