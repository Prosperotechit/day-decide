import { useEffect, useState } from 'react';
import { SEED_WARDROBE } from './seedWardrobe';
import type { ClothingItem } from './types';

const STORAGE_KEY = 'day-decide:wardrobe';

function loadWardrobe(): ClothingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_WARDROBE;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_WARDROBE;
  } catch {
    return SEED_WARDROBE;
  }
}

export function useWardrobe() {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(loadWardrobe);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wardrobe));
    } catch {
      // localStorage unavailable (private browsing, etc.) — state still works for this session
    }
  }, [wardrobe]);

  function addItem(item: ClothingItem) {
    setWardrobe((prev) => [...prev, item]);
  }

  function removeItem(id: string) {
    setWardrobe((prev) => prev.filter((item) => item.id !== id));
  }

  return { wardrobe, addItem, removeItem };
}
